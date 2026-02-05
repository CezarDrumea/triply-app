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

export interface ApiResponse<T> {
  data: T;
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  highlight: string;
  season: string;
  image: string;
  temperature: `${number}-${number}C`;
}

export interface Post {
  id: number;
  city: string;
  cover: string;
  date: `${number}-${number}-${number}`;
  days: number;
  excerpt: string;
  title: string;
}

export type Role = "user" | "admin";
