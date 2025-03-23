// Product type definition
export interface Product {
  id?: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  available: boolean;
  finalPrice?: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PriceFilterParams {
  initialRange: number;
  finalRange: number;
}

export interface ProductFilter {
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}
