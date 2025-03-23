import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";
import { apiService } from "../services/api";

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  sortedProductNames: string[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  sortedProductNames: [],
  loading: false,
  error: null,
};

// Async actions
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await apiService.fetchProducts();
});

export const filterProductsByPrice = createAsyncThunk(
  "products/filterByPrice",
  async ({
    initialRange,
    finalRange,
  }: {
    initialRange: number;
    finalRange: number;
  }) => {
    return await apiService.filterProductsByPrice(initialRange, finalRange);
  }
);

export const sortProductsByPrice = createAsyncThunk(
  "products/sortByPrice",
  async () => {
    return await apiService.sortProductsByPrice();
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearFilters: (state) => {
      state.filteredProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Handle filterProductsByPrice
      .addCase(filterProductsByPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        filterProductsByPrice.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.filteredProducts = action.payload;
        }
      )
      .addCase(filterProductsByPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to filter products";
      })

      // Handle sortProductsByPrice
      .addCase(sortProductsByPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        sortProductsByPrice.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.sortedProductNames = action.payload;
        }
      )
      .addCase(sortProductsByPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to sort products";
      });
  },
});
