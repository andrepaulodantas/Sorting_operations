import axios from "axios";
import { Product } from "../types";
import { ProductAdapter } from "../utils/productAdapter";

// Accessing the API directly by address and port
const API_BASE_URL = "http://localhost:8080";

// Create an axios instance with default configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Remove withCredentials to avoid CORS preflight issues
  withCredentials: false,
});

// Add token to all requests - kept for future JWT auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@App:token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions exported individually for test compatibility
export async function getProducts() {
  return api.get("/products").then((response) => {
    return {
      status: response.status,
      data: ProductAdapter.toFrontendList(response.data),
    };
  });
}

export async function getProductByBarcode(barcode: string) {
  return api.get(`/products/${barcode}`).then((response) => {
    return {
      status: response.status,
      data: ProductAdapter.toFrontend(response.data),
    };
  });
}

export async function createProduct(product: Product) {
  const backendProduct = ProductAdapter.toBackend(product);
  return api.post("/products", backendProduct).then((response) => {
    return {
      status: response.status,
      data: ProductAdapter.toFrontend(response.data),
    };
  });
}

export async function updateProduct(product: Product) {
  const backendProduct = ProductAdapter.toBackend(product);
  return api
    .put(`/products/${product.barcode}`, backendProduct)
    .then((response) => {
      return {
        status: response.status,
        data: ProductAdapter.toFrontend(response.data),
      };
    });
}

export async function deleteProduct(barcode: string) {
  return api.delete(`/products/${barcode}`).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
}

export async function getProductsByPriceRange(
  minPrice: number,
  maxPrice: number
) {
  return api.get(`/filter/price/${minPrice}/${maxPrice}`).then((response) => {
    return {
      status: response.status,
      data: ProductAdapter.toFrontendList(response.data),
    };
  });
}

export async function getSortedProductNames() {
  return api.get("/sort/price").then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
}

// API service methods
export const apiService = {
  // Auth - Mock implementations for auth endpoints
  async register(username: string, password: string) {
    console.log("Mock register called with:", username);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Check if username exists (mock check in localStorage)
      const existingUsers = JSON.parse(
        localStorage.getItem("mock_users") || "[]"
      );

      if (existingUsers.find((u: any) => u.username === username)) {
        const error = new Error(
          "Username already exists. Please choose another."
        );
        throw error;
      }

      // Store in localStorage for demo purposes
      const newUser = { id: Date.now(), username, password };
      localStorage.setItem(
        "mock_users",
        JSON.stringify([...existingUsers, newUser])
      );

      console.log("User registered successfully:", username);
      return { success: true, message: "User registered successfully" };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  async login(username: string, password: string) {
    console.log("Mock login called with:", username);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Check if credentials match
      const existingUsers = JSON.parse(
        localStorage.getItem("mock_users") || "[]"
      );

      const user = existingUsers.find(
        (u: any) => u.username === username && u.password === password
      );

      if (!user) {
        // For demo purposes, auto-create the user if not found
        if (username === "admin" && password === "admin") {
          console.log("Using default admin credentials");
          const userData = { id: Date.now(), username };
          const token = `mock_token_${Math.random().toString(36).substring(2)}`;
          return { token, user: userData };
        }

        // If no match and not using admin credentials, throw error
        throw new Error("Invalid username or password");
      }

      // Remove password from user data
      const userData = { id: user.id, username: user.username };
      const token = `mock_token_${Math.random().toString(36).substring(2)}`;

      console.log("Login successful for:", username);
      return { token, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async logout() {
    console.log("Mock logout called");
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
  },

  // Products - Real API endpoints
  async fetchProducts() {
    try {
      // Direct API call with logging
      console.log("Fetching products from API...");
      const response = await api.get("/products");
      console.log("API response:", response);

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        return ProductAdapter.toFrontendList(response.data);
      } else {
        console.error("Expected array but got:", response.data);
        return []; // Return empty array as fallback
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      return []; // Return empty array on error
    }
  },

  async getProductByBarcode(barcode: string) {
    try {
      const response = await api.get(`/products/${barcode}`);
      return ProductAdapter.toFrontend(response.data);
    } catch (error) {
      console.error(`Error fetching product with barcode ${barcode}:`, error);
      throw error;
    }
  },

  async createProduct(product: Product) {
    try {
      const backendProduct = ProductAdapter.toBackend(product);
      const response = await api.post("/products", backendProduct);
      return ProductAdapter.toFrontend(response.data);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(barcode: string, product: Product) {
    try {
      const backendProduct = ProductAdapter.toBackend(product);
      const response = await api.put(`/products/${barcode}`, backendProduct);
      return ProductAdapter.toFrontend(response.data);
    } catch (error) {
      console.error(`Error updating product with barcode ${barcode}:`, error);
      throw error;
    }
  },

  async deleteProduct(barcode: string) {
    try {
      const response = await api.delete(`/products/${barcode}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with barcode ${barcode}:`, error);
      throw error;
    }
  },

  async filterProductsByPrice(initialRange: number, finalRange: number) {
    try {
      const response = await api.get(
        `/filter/price/${initialRange}/${finalRange}`
      );
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        return ProductAdapter.toFrontendList(response.data);
      } else {
        console.error("Expected array but got:", response.data);
        return []; // Return empty array as fallback
      }
    } catch (error) {
      console.error("Error filtering products by price:", error);
      return []; // Return empty array on error
    }
  },

  async sortProductsByPrice() {
    try {
      const response = await api.get("/sort/price");
      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.error("Expected array but got:", response.data);
        return []; // Return empty array as fallback
      }
      return response.data;
    } catch (error) {
      console.error("Error sorting products by price:", error);
      return []; // Return empty array on error
    }
  },
};

export default apiService;
