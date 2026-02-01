import { createContext, type Dispatch } from "react";
import type { CartItem, Product } from "../types";

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "add"; product: Product }
  | { type: "remove"; productId: number }
  | { type: "decrease"; productId: number }
  | { type: "clear" }
  | { type: "set"; items: CartItem[] };

type CartContextType = {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  totalItems: number;
  totalCost: number;
} | null;

export const CartContext = createContext<CartContextType>(null);

export const initialState = {
  items: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id,
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }

    case "decrease": {
      return {
        items: state.items
          .map((item) =>
            item.product.id === action.productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "remove": {
      return {
        items: state.items.filter(
          (item) => item.product.id !== action.productId,
        ),
      };
    }

    case "clear": {
      return { items: [] };
    }

    case "set": {
      return { items: action.items };
    }

    default:
      return state;
  }
}
