// Product type definition
export interface Product {
  barcode: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  available: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PriceFilterParams {
  initialRange: number;
  finalRange: number;
}
