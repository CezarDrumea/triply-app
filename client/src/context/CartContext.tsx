import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import {
  CartContext,
  cartReducer,
  initialState,
  type CartState,
} from "./cartStore";

const STORAGE_KEY = "triply-cart-state";

function loadCartState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return initialState;

    const parsed = JSON.parse(raw) as CartState;

    if (!parsed || !Array.isArray(parsed.items)) return initialState;

    return parsed;
  } catch {
    return initialState;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    loadCartState,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => {
    const totalItems = state.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalCost = state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    return { totalItems, totalCost };
  }, [state.items]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      totalItems: totals.totalItems,
      totalCost: totals.totalCost,
    }),
    [state, totals],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
