import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "../services/api";
import { Product } from "../types/product";

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  sortedProductNames: string[];
  loading: boolean;
  error: string | null;
  currentProduct: Product | null;
}

const initialState: ProductState = {
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
  "products/create",
  async (product: Product, { rejectWithValue }) => {
    try {
      return await apiService.createProduct(product);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (
    { barcode, product }: { barcode: string; product: Product },
    { rejectWithValue }
  ) => {
    try {
      return await apiService.updateProduct(barcode, product);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (barcode: string, { rejectWithValue }) => {
    try {
      await apiService.deleteProduct(barcode);
      return barcode;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

export const filterProductsByPrice = createAsyncThunk(
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

export const sortProductsByPrice = createAsyncThunk(
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
      }
    );
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Filter products by price
    builder.addCase(filterProductsByPrice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      filterProductsByPrice.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      }
    );
    builder.addCase(filterProductsByPrice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Sort products by price
    builder.addCase(sortProductsByPrice.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      sortProductsByPrice.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.sortedProductNames = action.payload;
      }
    );
    builder.addCase(sortProductsByPrice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearFilteredProducts, clearCurrentProduct } =
  productSlice.actions;
export default productSlice.reducer;
