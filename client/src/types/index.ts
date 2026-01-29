export interface Product {
  id: number;
  name: string;
  price: number;
  category: "gear" | "prints" | "guides";
  rating: number;
  image: string;
  badge?: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
