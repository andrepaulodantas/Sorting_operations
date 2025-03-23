import { it, describe, expect, beforeEach, vi, afterEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import productReducer, {
  initialState,
  setProducts,
  addProduct,
  updateProduct,
  removeProduct,
  selectProducts,
  selectProductByBarcode,
  selectProductCount,
  selectLoading,
  selectError,
  fetchProducts,
  fetchProductsByPriceRange,
  fetchSortedProductNames,
} from "./productSlice";
import { Product } from "../types";

// Mock the API service
vi.mock("../services/api", () => ({
  apiService: {
    fetchProducts: vi.fn(),
    filterProductsByPrice: vi.fn(),
    sortProductsByPrice: vi.fn(),
  },
}));

// Import the mock after mocking
import { apiService } from "../services/api";

describe("Product Redux Slice", () => {
  const mockProducts: Product[] = [
    {
      barcode: "74001234",
      name: "Test Product 1",
      category: "Test Category",
      price: 1000,
      discount: 10,
      available: true,
    },
    {
      barcode: "74005678",
      name: "Test Product 2",
      category: "Test Category",
      price: 2000,
      discount: 20,
      available: false,
    },
  ];

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productReducer,
      },
    });
    vi.clearAllMocks();
  });

  it("should return the initial state", () => {
    const state = store.getState().products;
    expect(state).toEqual(initialState);
  });

  it("should handle setProducts action", () => {
    store.dispatch(setProducts(mockProducts));

    const state = store.getState().products;
    expect(state.products).toEqual(mockProducts);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it("should handle addProduct action", () => {
    const newProduct: Product = {
      barcode: "74009999",
      name: "New Product",
      category: "Test Category",
      price: 1500,
      discount: 15,
      available: true,
    };

    // Add first product
    store.dispatch(setProducts(mockProducts));
    // Add new product
    store.dispatch(addProduct(newProduct));

    const state = store.getState().products;
    expect(state.products).toHaveLength(3);
    expect(state.products).toContainEqual(newProduct);
  });

  it("should handle updateProduct action", () => {
    // Mock API service
    apiService.updateProduct = vi.fn().mockResolvedValue({
      barcode: "74001234",
      name: "Updated Product",
      category: "Test Category",
      price: 1500,
      discount: 10,
      available: true,
    });

    // Set initial state with mock products
    store.dispatch(setProducts(mockProducts));

    // Initial state should have 2 products
    let state = store.getState().products;
    expect(state.products).toHaveLength(2);

    // Define updated product
    const updatedProduct = {
      barcode: "74001234",
      name: "Updated Product",
      category: "Test Category",
      price: 1500,
      discount: 10,
      available: true,
    };

    // Simulate fulfilled action directly
    store.dispatch({
      type: updateProduct.fulfilled.type,
      payload: updatedProduct,
    });

    // State after update should still have 2 products
    state = store.getState().products;
    expect(state.products).toHaveLength(2);
    expect(state.products[0]).toEqual(updatedProduct);
  });

  it("should handle removeProduct action", () => {
    store.dispatch(setProducts(mockProducts));
    store.dispatch(removeProduct("74001234"));

    const state = store.getState().products;
    expect(state.products).toHaveLength(1);
    expect(state.products[0].barcode).toBe("74005678");
  });

  it("should handle selectProducts selector", () => {
    store.dispatch(setProducts(mockProducts));

    const products = selectProducts(store.getState());
    expect(products).toEqual(mockProducts);
  });

  it("should handle selectProductByBarcode selector", () => {
    store.dispatch(setProducts(mockProducts));

    const product = selectProductByBarcode(store.getState(), "74001234");
    expect(product).toEqual(mockProducts[0]);

    const notFound = selectProductByBarcode(store.getState(), "nonexistent");
    expect(notFound).toBeUndefined();
  });

  it("should handle selectProductCount selector", () => {
    store.dispatch(setProducts(mockProducts));

    const count = selectProductCount(store.getState());
    expect(count).toBe(2);
  });

  it("should handle selectLoading selector", () => {
    // Initial state
    expect(selectLoading(store.getState())).toBe(false);

    // Pending state of async thunk
    store.dispatch({ type: fetchProducts.pending.type });
    expect(selectLoading(store.getState())).toBe(true);

    // Fulfilled state of async thunk
    store.dispatch({
      type: fetchProducts.fulfilled.type,
      payload: mockProducts,
    });
    expect(selectLoading(store.getState())).toBe(false);
  });

  it("should handle selectError selector", () => {
    // Initial state
    expect(selectError(store.getState())).toBe(null);

    // Rejected state of async thunk
    const errorMessage = "Error message";
    store.dispatch({
      type: fetchProducts.rejected.type,
      payload: errorMessage,
      error: true,
    });
    expect(selectError(store.getState())).toBe(errorMessage);
  });

  it("fetchProducts thunk should handle successful API response", async () => {
    (apiService.fetchProducts as any).mockResolvedValueOnce(mockProducts);

    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(apiService.fetchProducts).toHaveBeenCalledTimes(1);
    expect(state.products).toEqual(mockProducts);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it("fetchProducts thunk should handle API error", async () => {
    const errorMessage = "Network Error";
    (apiService.fetchProducts as any).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(apiService.fetchProducts).toHaveBeenCalledTimes(1);
    expect(state.products).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it("fetchProductsByPriceRange thunk should handle successful API response", async () => {
    (apiService.filterProductsByPrice as any).mockResolvedValueOnce([
      mockProducts[0],
    ]);

    await store.dispatch(
      fetchProductsByPriceRange({ minPrice: 1000, maxPrice: 1500 })
    );

    const state = store.getState().products;
    expect(apiService.filterProductsByPrice).toHaveBeenCalledWith(1000, 1500);
    expect(state.filteredProducts).toEqual([mockProducts[0]]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it("fetchSortedProductNames thunk should handle successful API response", async () => {
    const sortedNames = ["Test Product 1", "Test Product 2"];
    (apiService.sortProductsByPrice as any).mockResolvedValueOnce(sortedNames);

    await store.dispatch(fetchSortedProductNames());

    const state = store.getState().products;
    expect(apiService.sortProductsByPrice).toHaveBeenCalledTimes(1);
    expect(state.sortedProductNames).toEqual(sortedNames);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });
});
