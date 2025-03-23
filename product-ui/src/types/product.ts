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
