import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "../services/api";
import { Product } from "../types/product";
import { RootState } from "./index";

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  sortedProductNames: string[];
  loading: boolean;
  error: string | null;
  currentProduct: Product | null;
}

export const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  sortedProductNames: [],
  loading: false,
  error: null,
  currentProduct: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.fetchProducts();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const fetchProductByBarcode = createAsyncThunk(
  "products/fetchByBarcode",
  async (barcode: string, { rejectWithValue }) => {
    try {
      return await apiService.getProductByBarcode(barcode);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch product");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: Product, { rejectWithValue }) => {
    try {
      const response = await apiService.createProduct(product);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { barcode, product }: { barcode: string; product: Product },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.updateProduct(barcode, product);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (barcode: string, { rejectWithValue }) => {
    try {
      await apiService.deleteProduct(barcode);
      return barcode;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const fetchProductsByPriceRange = createAsyncThunk(
  "products/filterByPrice",
  async (
    { minPrice, maxPrice }: { minPrice: number; maxPrice: number },
    { rejectWithValue }
  ) => {
    try {
      return await apiService.filterProductsByPrice(minPrice, maxPrice);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to filter products");
    }
  }
);

export const fetchSortedProductNames = createAsyncThunk(
  "products/sortByPrice",
  async (_, { rejectWithValue }) => {
    try {
      return await apiService.sortProductsByPrice();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to sort products");
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.barcode !== action.payload
      );
    },
    clearFilteredProducts: (state) => {
      state.filteredProducts = [];
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch product by barcode
    builder.addCase(fetchProductByBarcode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProductByBarcode.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      }
    );
    builder.addCase(fetchProductByBarcode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Filter products by price
    builder.addCase(fetchProductsByPriceRange.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProductsByPriceRange.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      }
    );
    builder.addCase(fetchProductsByPriceRange.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Sort products by price
    builder.addCase(fetchSortedProductNames.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchSortedProductNames.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.sortedProductNames = action.payload;
      }
    );
    builder.addCase(fetchSortedProductNames.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload);
        state.currentProduct = action.payload;
        state.error = null;
      }
    );
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.barcode === action.payload.barcode
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.currentProduct = action.payload;
        state.error = null;
      }
    );
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteProduct.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.barcode !== action.payload
        );
        state.currentProduct = null;
        state.filteredProducts = state.filteredProducts.filter(
          (p) => p.barcode !== action.payload
        );
        state.error = null;
      }
    );
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setProducts,
  addProduct,
  removeProduct,
  clearFilteredProducts,
  clearCurrentProduct,
} = productSlice.actions;

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductByBarcode = (state: RootState, barcode: string) =>
  state.products.products.find((product) => product.barcode === barcode);
export const selectProductCount = (state: RootState) =>
  state.products.products.length;
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;
export const selectFilteredProducts = (state: RootState) =>
  state.products.filteredProducts;
export const selectSortedProductNames = (state: RootState) =>
  state.products.sortedProductNames;

export default productSlice.reducer;
