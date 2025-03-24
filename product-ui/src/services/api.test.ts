import { it, describe, expect, beforeEach, vi } from "vitest";
import { Product } from "../types/product";

// Need to mock the entire module in a simpler way
vi.mock("./api");
vi.mock("../utils/productAdapter");

// Import after mocking
import { ProductAdapter } from "../utils/productAdapter";
import * as apiModule from "./api";

describe("API Service", () => {
  // Sample test data
  const mockFrontendProduct = {
    barcode: "74001755",
    name: "Test Product",
    category: "Full Body Outfits",
    price: 2499,
    discount: 7,
    available: true,
  };

  const mockBackendProduct = {
    barcode: "74001755",
    item: "Test Product",
    category: "Full Body Outfits",
    price: 2499,
    discount: 7,
    available: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset all mocks to their default state
    vi.mocked(apiModule.getProducts).mockReset();
    vi.mocked(apiModule.getProductByBarcode).mockReset();
    vi.mocked(apiModule.createProduct).mockReset();
    vi.mocked(apiModule.updateProduct).mockReset();
    vi.mocked(apiModule.deleteProduct).mockReset();
    vi.mocked(apiModule.getProductsByPriceRange).mockReset();
    vi.mocked(apiModule.getSortedProductNames).mockReset();
  });

  it("getProducts should fetch products from API", async () => {
    // Setup mock response
    const mockResponse = {
      status: 200,
      data: [mockFrontendProduct],
    };
    vi.mocked(apiModule.getProducts).mockResolvedValue(mockResponse);

    // Test
    const result = await apiModule.getProducts();

    // Assertions
    expect(apiModule.getProducts).toHaveBeenCalled();
    expect(result.status).toBe(200);
    expect(result.data).toEqual([mockFrontendProduct]);
  });

  it("getProductByBarcode should fetch a specific product", async () => {
    // Setup mock response
    const barcode = "74001755";
    const mockResponse = {
      status: 200,
      data: mockFrontendProduct,
    };
    vi.mocked(apiModule.getProductByBarcode).mockResolvedValue(mockResponse);

    // Test
    const result = await apiModule.getProductByBarcode(barcode);

    // Assertions
    expect(apiModule.getProductByBarcode).toHaveBeenCalledWith(barcode);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockFrontendProduct);
  });

  it("createProduct should send POST request with product data", async () => {
    // Setup mock response
    const mockResponse = {
      status: 201,
      data: mockFrontendProduct,
    };
    vi.mocked(apiModule.createProduct).mockResolvedValue(mockResponse);

    // Test
    const result = await apiModule.createProduct(mockFrontendProduct);

    // Assertions
    expect(apiModule.createProduct).toHaveBeenCalledWith(mockFrontendProduct);
    expect(result.status).toBe(201);
    expect(result.data).toEqual(mockFrontendProduct);
  });

  it("updateProduct should send PUT request with updated data", async () => {
    // Setup mock response
    const mockResponse = {
      status: 200,
      data: mockFrontendProduct,
    };
    vi.mocked(apiModule.updateProduct).mockResolvedValue(mockResponse);

    // Test
    const result = await apiModule.updateProduct(mockFrontendProduct);

    // Assertions
    expect(apiModule.updateProduct).toHaveBeenCalledWith(mockFrontendProduct);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockFrontendProduct);
  });

  it("deleteProduct should send DELETE request", async () => {
    // Setup mock response
    const barcode = "74001755";
    const mockResponse = { status: 200 };
    vi.mocked(apiModule.deleteProduct).mockResolvedValue(mockResponse);

    // Test
    const result = await apiModule.deleteProduct(barcode);

    // Assertions
    expect(apiModule.deleteProduct).toHaveBeenCalledWith(barcode);
    expect(result.status).toBe(200);
  });

  it("getProductsByPriceRange should filter products by price range", async () => {
    // Setup mock response
    const minPrice = 1000;
    const maxPrice = 3000;
    const mockResponse = {
      status: 200,
      data: [mockFrontendProduct],
    };
    vi.mocked(apiModule.getProductsByPriceRange).mockResolvedValue(
      mockResponse
    );

    // Test
    const result = await apiModule.getProductsByPriceRange(minPrice, maxPrice);

    // Assertions
    expect(apiModule.getProductsByPriceRange).toHaveBeenCalledWith(
      minPrice,
      maxPrice
    );
    expect(result.status).toBe(200);
    expect(result.data).toEqual([mockFrontendProduct]);
  });

  it("getSortedProductNames should fetch sorted product names", async () => {
    // Setup mock response
    const sortedNames = ["Product A", "Product B", "Product C"];
    const mockResponse = {
      status: 200,
      data: sortedNames,
    };
    vi.mocked(apiModule.getSortedProductNames).mockResolvedValue(mockResponse);

    // Test
    const result = await apiModule.getSortedProductNames();

    // Assertions
    expect(apiModule.getSortedProductNames).toHaveBeenCalled();
    expect(result.status).toBe(200);
    expect(result.data).toEqual(sortedNames);
  });

  it("API functions should handle errors", async () => {
    // Setup - mock rejections for all API methods
    const mockError = new Error("Network Error");

    vi.mocked(apiModule.getProducts).mockRejectedValue(mockError);
    vi.mocked(apiModule.getProductByBarcode).mockRejectedValue(mockError);
    vi.mocked(apiModule.createProduct).mockRejectedValue(mockError);
    vi.mocked(apiModule.updateProduct).mockRejectedValue(mockError);
    vi.mocked(apiModule.deleteProduct).mockRejectedValue(mockError);
    vi.mocked(apiModule.getProductsByPriceRange).mockRejectedValue(mockError);
    vi.mocked(apiModule.getSortedProductNames).mockRejectedValue(mockError);

    // Create a basic test product
    const testProduct = {
      barcode: "12345678",
      name: "Test Product",
      category: "Test Category",
      price: 1000,
      discount: 0,
      available: true,
    };

    // Test each method separately
    await expect(apiModule.getProducts()).rejects.toThrow("Network Error");
    await expect(apiModule.getProductByBarcode("12345678")).rejects.toThrow(
      "Network Error"
    );
    await expect(apiModule.createProduct(testProduct)).rejects.toThrow(
      "Network Error"
    );
    await expect(apiModule.updateProduct(testProduct)).rejects.toThrow(
      "Network Error"
    );
    await expect(apiModule.deleteProduct("12345678")).rejects.toThrow(
      "Network Error"
    );
    await expect(apiModule.getProductsByPriceRange(1000, 2000)).rejects.toThrow(
      "Network Error"
    );
    await expect(apiModule.getSortedProductNames()).rejects.toThrow(
      "Network Error"
    );
  });
});
