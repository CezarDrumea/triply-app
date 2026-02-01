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

// {
//     "id": 1,
//     "name": "Summit Packing Cubes",
//     "price": 38,
//     "category": "gear",
//     "rating": 4.8,
//     "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
//     "badge": "Best Seller",
//     "description": "Lightweight organization for fast-moving itineraries."
// }
