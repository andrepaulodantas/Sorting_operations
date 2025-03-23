import { configureStore } from '@reduxjs/toolkit';
import { productSlice } from './product.slice';

export const store = configureStore({
  reducer: {
    products: productSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 