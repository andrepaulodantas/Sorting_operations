import { configureStore } from "@reduxjs/toolkit";
import productReducer, {
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
import { Product } from "../types/Product";

// Mock API service
jest.mock("../services/api", () => ({
  getProducts: jest.fn(),
  getProductsByPriceRange: jest.fn(),
  getSortedProductNames: jest.fn(),
}));

describe("Product Redux Slice", () => {
  const initialState = {
    products: [],
    loading: false,
    error: null,
  };

  const mockProducts: Product[] = [
    {
      barcode: "74001234",
      item: "Test Product 1",
      category: "Test Category",
      price: 1999,
      discount: 10,
      available: 1,
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

  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productReducer,
      },
    });
  });

  test("should return the initial state", () => {
    const state = store.getState().products;
    expect(state).toEqual(initialState);
  });

  test("should handle setProducts action", () => {
    store.dispatch(setProducts(mockProducts));

    const state = store.getState().products;
    expect(state.products).toEqual(mockProducts);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  test("should handle addProduct action", () => {
    const newProduct: Product = {
      barcode: "74009999",
      item: "New Product",
      category: "New Category",
      price: 1599,
      discount: 0,
      available: 1,
    };

    // Add first product
    store.dispatch(setProducts(mockProducts));
    // Add new product
    store.dispatch(addProduct(newProduct));

    const state = store.getState().products;
    expect(state.products).toHaveLength(3);
    expect(state.products[2]).toEqual(newProduct);
  });

  test("should handle updateProduct action", () => {
    store.dispatch(setProducts(mockProducts));

    const updatedProduct: Product = {
      ...mockProducts[0],
      item: "Updated Product",
      price: 2499,
    };

    store.dispatch(updateProduct(updatedProduct));

    const state = store.getState().products;
    expect(state.products).toHaveLength(2);
    expect(state.products[0]).toEqual(updatedProduct);
    expect(state.products[1]).toEqual(mockProducts[1]);
  });

  test("should handle removeProduct action", () => {
    store.dispatch(setProducts(mockProducts));
    store.dispatch(removeProduct("74001234"));

    const state = store.getState().products;
    expect(state.products).toHaveLength(1);
    expect(state.products[0]).toEqual(mockProducts[1]);
  });

  test("should handle selectProducts selector", () => {
    store.dispatch(setProducts(mockProducts));

    const products = selectProducts(store.getState());
    expect(products).toEqual(mockProducts);
  });

  test("should handle selectProductByBarcode selector", () => {
    store.dispatch(setProducts(mockProducts));

    const product = selectProductByBarcode(store.getState(), "74001234");
    expect(product).toEqual(mockProducts[0]);

    const nonExistentProduct = selectProductByBarcode(
      store.getState(),
      "nonexistent"
    );
    expect(nonExistentProduct).toBeUndefined();
  });

  test("should handle selectProductCount selector", () => {
    store.dispatch(setProducts(mockProducts));

    const count = selectProductCount(store.getState());
    expect(count).toBe(2);
  });

  test("should handle selectLoading selector", () => {
    // Initial state
    expect(selectLoading(store.getState())).toBe(false);

    // Pending state of async thunk
    store.dispatch({ type: "products/fetchProducts/pending" });
    expect(selectLoading(store.getState())).toBe(true);

    // Fulfilled state of async thunk
    store.dispatch({
      type: "products/fetchProducts/fulfilled",
      payload: mockProducts,
    });
    expect(selectLoading(store.getState())).toBe(false);
  });

  test("should handle selectError selector", () => {
    // Initial state
    expect(selectError(store.getState())).toBe(null);

    // Rejected state of async thunk
    store.dispatch({
      type: "products/fetchProducts/rejected",
      error: { message: "Error fetching products" },
    });

    expect(selectError(store.getState())).toBe("Error fetching products");
  });

  test("fetchProducts thunk should handle successful API response", async () => {
    const { getProducts } = require("../services/api");
    getProducts.mockResolvedValueOnce({ data: mockProducts });

    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(state.products).toEqual(mockProducts);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  test("fetchProducts thunk should handle API error", async () => {
    const errorMessage = "Network Error";
    const { getProducts } = require("../services/api");
    getProducts.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(state.products).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  test("fetchProductsByPriceRange thunk should handle successful API response", async () => {
    const { getProductsByPriceRange } = require("../services/api");
    getProductsByPriceRange.mockResolvedValueOnce({ data: [mockProducts[0]] });

    await store.dispatch(fetchProductsByPriceRange({ min: 1000, max: 2000 }));

    const state = store.getState().products;
    expect(getProductsByPriceRange).toHaveBeenCalledWith(1000, 2000);
    expect(state.products).toEqual([mockProducts[0]]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  test("fetchSortedProductNames thunk should handle successful API response", async () => {
    const sortedNames = ["Test Product 1", "Test Product 2"];
    const { getSortedProductNames } = require("../services/api");
    getSortedProductNames.mockResolvedValueOnce({ data: sortedNames });

    const result = await store.dispatch(fetchSortedProductNames());

    expect(getSortedProductNames).toHaveBeenCalledTimes(1);
    expect(result.payload).toEqual(sortedNames);
  });
});
