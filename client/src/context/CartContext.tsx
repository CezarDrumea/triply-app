import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  CartContext,
  cartReducer,
  initialState,
  type CartAction,
} from "./cartStore";
import { SERVER_LOCATION } from "../utils/constants";
import type { ApiResponse, CartItem } from "../types";

interface CartPayload {
  items: CartItem[];
}

async function readCart() {
  const response = await fetch(`${SERVER_LOCATION}/api/cart`);
  if (!response.ok) throw new Error(`Cart request failed: ${response.status}`);
  const payload = (await response.json()) as ApiResponse<CartPayload>;
  return payload.data.items;
}

async function mutateCart(
  action: CartAction,
  currentItems: CartItem[],
): Promise<CartItem[]> {
  let response: Response | null = null;

  switch (action.type) {
    case "add": {
      response = await fetch(`${SERVER_LOCATION}/api/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      break;
    }

    case "decrease": {
      const current = currentItems.find(
        (item) => item.product.id === action.productId,
      );
      if (!current) return currentItems;
      if (current.quantity <= 1) {
        response = await fetch(
          `${SERVER_LOCATION}/api/cart/items/${action.productId}`,
          {
            method: "DELETE",
          },
        );
      } else {
        response = await fetch(
          `${SERVER_LOCATION}/api/cart/items/${action.productId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: current.quantity - 1 }),
          },
        );
      }
      break;
    }

    case "remove": {
      response = await fetch(
        `${SERVER_LOCATION}/api/cart/items/${action.productId}`,
        {
          method: "DELETE",
        },
      );
      break;
    }

    case "clear": {
      response = await fetch(`${SERVER_LOCATION}/api/cart/clear`, {
        method: "POST",
      });
      break;
    }

    case "set": {
      return action.items;
    }
  }

  if (!response) return currentItems;
  if (!response.ok) throw new Error(`Cart update failed: ${response.status}`);

  const payload = (await response.json()) as ApiResponse<CartPayload>;
  return payload.data.items;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatchBase] = useReducer(cartReducer, initialState);

  const dispatch = useCallback(
    (action: CartAction) => {
      if (action.type === "set") return dispatchBase(action);

      const run = async () => {
        const items = await mutateCart(action, state.items);
        dispatchBase({ type: "set", items });
      };

      void run();
    },
    [state.items],
  );

  useEffect(() => {
    let active = true;

    const load = async () => {
      const items = await readCart();
      if (active) dispatchBase({ type: "set", items });
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

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
    [state, dispatch, totals],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
