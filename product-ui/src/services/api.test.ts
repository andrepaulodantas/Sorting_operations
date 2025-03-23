import { it, describe, expect, beforeEach, vi, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  getProducts,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByPriceRange,
  getSortedProductNames,
} from "./api";
import { Product } from "../types/product";
import { ProductAdapter } from "../utils/productAdapter";

// Spying on ProductAdapter methods
vi.mock("../utils/productAdapter", () => ({
  ProductAdapter: {
    toFrontendList: vi.fn((data) => data),
    toFrontend: vi.fn((data) => data),
    toBackend: vi.fn((data) => data),
  },
}));

describe("API Service", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  // Frontend product format
  const mockFrontendProducts: Product[] = [
    {
      barcode: "74001234",
      name: "Test Product 1",
      category: "Test Category",
      price: 1999,
      discount: 10,
      available: true,
    },
    {
      barcode: "74005678",
      name: "Test Product 2",
      category: "Test Category",
      price: 2999,
      discount: 5,
      available: false,
    },
  ];

  // Backend product format
  const mockBackendProducts = [
    {
      barcode: "74001234",
      item: "Test Product 1", // backend uses 'item'
      category: "Test Category",
      price: 1999,
      discount: 10,
      available: 1, // backend uses 0/1
    },
    {
      barcode: "74005678",
      item: "Test Product 2",
      category: "Test Category",
      price: 2999,
      discount: 5,
      available: 0,
    },
  ];

  it("getProducts should fetch products from API", async () => {
    mockAxios.onGet("/products").reply(200, mockBackendProducts);

    // Mock the adapter to return our frontend format
    vi.mocked(ProductAdapter.toFrontendList).mockReturnValue(
      mockFrontendProducts
    );

    const response = await getProducts();

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockFrontendProducts);
    expect(ProductAdapter.toFrontendList).toHaveBeenCalledWith(
      mockBackendProducts
    );
  });

  it("getProductByBarcode should fetch a specific product", async () => {
    const barcode = "74001234";
    mockAxios.onGet(`/products/${barcode}`).reply(200, mockBackendProducts[0]);

    // Mock the adapter to return our frontend format
    vi.mocked(ProductAdapter.toFrontend).mockReturnValue(
      mockFrontendProducts[0]
    );

    const response = await getProductByBarcode(barcode);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockFrontendProducts[0]);
    expect(ProductAdapter.toFrontend).toHaveBeenCalledWith(
      mockBackendProducts[0]
    );
  });

  it("getProductByBarcode should handle 404 for non-existent product", async () => {
    const barcode = "nonexistent";
    mockAxios.onGet(`/products/${barcode}`).reply(404);

    await expect(getProductByBarcode(barcode)).rejects.toThrow();
  });

  it("createProduct should send POST request with product data", async () => {
    const newFrontendProduct: Product = {
      barcode: "74009999",
      name: "New Product",
      category: "New Category",
      price: 1599,
      discount: 0,
      available: true,
    };

    const newBackendProduct = {
      barcode: "74009999",
      item: "New Product",
      category: "New Category",
      price: 1599,
      discount: 0,
      available: 1,
    };

    // Mock the adapter
    vi.mocked(ProductAdapter.toBackend).mockReturnValue(newBackendProduct);

    mockAxios.onPost("/products").reply(201, newBackendProduct);
    vi.mocked(ProductAdapter.toFrontend).mockReturnValue(newFrontendProduct);

    const response = await createProduct(newFrontendProduct);

    expect(response.status).toBe(201);
    expect(response.data).toEqual(newFrontendProduct);
    expect(ProductAdapter.toBackend).toHaveBeenCalledWith(newFrontendProduct);
  });

  it("createProduct should handle validation errors", async () => {
    const invalidProduct = {
      barcode: "74009999",
      // Missing required fields
      price: -100,
      discount: 0,
      available: true,
    };

    mockAxios.onPost("/products").reply(400, {
      message: "Validation failed",
    });

    await expect(createProduct(invalidProduct as any)).rejects.toThrow();
  });

  it("updateProduct should send PUT request with updated data", async () => {
    const updatedFrontendProduct: Product = {
      ...mockFrontendProducts[0],
      name: "Updated Product",
      price: 2499,
    };

    const updatedBackendProduct = {
      ...mockBackendProducts[0],
      item: "Updated Product",
      price: 2499,
    };

    // Mock the adapter
    vi.mocked(ProductAdapter.toBackend).mockReturnValue(updatedBackendProduct);

    mockAxios
      .onPut(`/products/${updatedFrontendProduct.barcode}`)
      .reply(200, updatedBackendProduct);

    vi.mocked(ProductAdapter.toFrontend).mockReturnValue(
      updatedFrontendProduct
    );

    const response = await updateProduct(updatedFrontendProduct);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(updatedFrontendProduct);
    expect(ProductAdapter.toBackend).toHaveBeenCalledWith(
      updatedFrontendProduct
    );
  });

  it("updateProduct should handle 404 for non-existent product", async () => {
    const nonExistentProduct: Product = {
      barcode: "nonexistent",
      name: "Non-existent",
      category: "Test",
      price: 999,
      discount: 0,
      available: true,
    };

    mockAxios.onPut(`/products/${nonExistentProduct.barcode}`).reply(404);

    await expect(updateProduct(nonExistentProduct)).rejects.toThrow();
  });

  it("deleteProduct should send DELETE request", async () => {
    const barcode = "74001234";
    mockAxios.onDelete(`/products/${barcode}`).reply(200);

    const response = await deleteProduct(barcode);

    expect(response.status).toBe(200);
  });

  it("deleteProduct should handle 404 for non-existent product", async () => {
    const barcode = "nonexistent";
    mockAxios.onDelete(`/products/${barcode}`).reply(404);

    await expect(deleteProduct(barcode)).rejects.toThrow();
  });

  it("getProductsByPriceRange should filter products by price range", async () => {
    const minPrice = 1000;
    const maxPrice = 2000;

    mockAxios
      .onGet(`/filter/price/${minPrice}/${maxPrice}`)
      .reply(200, [mockBackendProducts[0]]);

    vi.mocked(ProductAdapter.toFrontendList).mockReturnValue([
      mockFrontendProducts[0],
    ]);

    const response = await getProductsByPriceRange(minPrice, maxPrice);

    expect(response.status).toBe(200);
    expect(response.data).toEqual([mockFrontendProducts[0]]);
    expect(ProductAdapter.toFrontendList).toHaveBeenCalledWith([
      mockBackendProducts[0],
    ]);
  });

  it("getProductsByPriceRange should handle invalid range parameters", async () => {
    const minPrice = -100;
    const maxPrice = 2000;
    mockAxios.onGet(`/filter/price/${minPrice}/${maxPrice}`).reply(400, {
      message: "Invalid price range",
    });

    await expect(getProductsByPriceRange(minPrice, maxPrice)).rejects.toThrow();
  });

  it("getSortedProductNames should fetch sorted product names", async () => {
    const sortedNames = ["Test Product 1", "Test Product 2"];
    mockAxios.onGet("/sort/price").reply(200, sortedNames);

    const response = await getSortedProductNames();

    expect(response.status).toBe(200);
    expect(response.data).toEqual(sortedNames);
  });

  test("all API functions should handle network errors", async () => {
    mockAxios.onAny().networkError();

    await expect(getProducts()).rejects.toThrow();
    await expect(getProductByBarcode("74001234")).rejects.toThrow();
    await expect(createProduct(mockFrontendProducts[0])).rejects.toThrow();
    await expect(updateProduct(mockFrontendProducts[0])).rejects.toThrow();
    await expect(deleteProduct("74001234")).rejects.toThrow();
    await expect(getProductsByPriceRange(1000, 2000)).rejects.toThrow();
    await expect(getSortedProductNames()).rejects.toThrow();
  });

  test("all API functions should handle server errors", async () => {
    mockAxios.onAny().reply(500);

    await expect(getProducts()).rejects.toThrow();
    await expect(getProductByBarcode("74001234")).rejects.toThrow();
    await expect(createProduct(mockFrontendProducts[0])).rejects.toThrow();
    await expect(updateProduct(mockFrontendProducts[0])).rejects.toThrow();
    await expect(deleteProduct("74001234")).rejects.toThrow();
    await expect(getProductsByPriceRange(1000, 2000)).rejects.toThrow();
    await expect(getSortedProductNames()).rejects.toThrow();
  });
});
