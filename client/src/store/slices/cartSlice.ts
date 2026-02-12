import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ApiResponse, CartItem, Product } from "../../types";
import { SERVER_LOCATION } from "../../utils/constants";
import type { RootState } from "..";

interface CartState {
  items: CartItem[];
  justCheckedOut: boolean;
  showToast: boolean;
}

interface CartPayload {
  items: CartItem[];
}

type CartMutation =
  | { type: "add"; product: Product }
  | { type: "decrease"; productId: number }
  | { type: "remove"; productId: number }
  | { type: "clear" };

const mutateCart = async (
  action: CartMutation,
  currentItems: CartItem[],
): Promise<CartItem[]> => {
  let response: Response | null = null;

  if (action.type === "add") {
    response = await fetch(`${SERVER_LOCATION}/api/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: action.product.id, quantity: 1 }),
    });
  }

  if (action.type === "decrease") {
    const current = currentItems.find(
      (item) => item.product.id === action.productId,
    );

    if (!current) return currentItems;

    if (current.quantity <= 1) {
      response = await fetch(
        `${SERVER_LOCATION}/api/cart/items/${action.productId}`,
        { method: "DELETE" },
      );
    } else {
      response = await fetch(
        `${SERVER_LOCATION}/api/cart/items/${action.productId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: current.quantity - 1,
          }),
        },
      );
    }
  }

  if (action.type === "remove") {
    response = await fetch(
      `${SERVER_LOCATION}/api/cart/items/${action.productId}`,
      { method: "DELETE" },
    );
  }

  if (action.type === "clear") {
    response = await fetch(`${SERVER_LOCATION}/api/cart/clear`, {
      method: "POST",
    });
  }

  if (!response) return currentItems;

  if (!response.ok) throw new Error(`Cart update failed: ${response.status}`);

  const payload = (await response.json()) as ApiResponse<CartPayload>;

  return payload.data.items;
};

const readCart = async () => {
  const response = await fetch(`${SERVER_LOCATION}/api/cart`);

  if (!response.ok) throw new Error(`Cart request failed: ${response.status}`);

  const payload = (await response.json()) as ApiResponse<CartPayload>;
  return payload.data.items;
};

export const fetchCart = createAsyncThunk<CartItem[]>(
  "cart/fetchCart",
  async () => readCart(),
);

export const addToCart = createAsyncThunk<
  CartItem[],
  Product,
  { state: RootState }
>("cart/addToCart", async (product, { getState }) =>
  mutateCart({ type: "add", product }, getState().cart.items),
);

export const decreaseItem = createAsyncThunk<
  CartItem[],
  number,
  { state: RootState }
>("cart/decreaseItem", async (productId, { getState }) =>
  mutateCart({ type: "decrease", productId }, getState().cart.items),
);

export const removeItem = createAsyncThunk<
  CartItem[],
  number,
  { state: RootState }
>("cart/removeItem", async (productId, { getState }) =>
  mutateCart({ type: "remove", productId }, getState().cart.items),
);

export const clearCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState }
>("cart/clearCart", async (_, { getState }) =>
  mutateCart({ type: "clear" }, getState().cart.items),
);

const initialState: CartState = {
  items: [],
  justCheckedOut: false,
  showToast: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setJustCheckedOut: (state, action: PayloadAction<boolean>) => {
      state.justCheckedOut = action.payload;
    },
    setShowToast: (state, action: PayloadAction<boolean>) => {
      state.showToast = action.payload;
    },
  },
  extraReducers: (builder) => {
    const applyItems = (state: CartState, items: CartItem[]) => {
      state.items = items;
      if (items.length > 0 && state.justCheckedOut)
        state.justCheckedOut = false;
    };

    builder
      .addCase(fetchCart.fulfilled, (state, action) =>
        applyItems(state, action.payload),
      )
      .addCase(addToCart.fulfilled, (state, action) =>
        applyItems(state, action.payload),
      )
      .addCase(decreaseItem.fulfilled, (state, action) =>
        applyItems(state, action.payload),
      )
      .addCase(removeItem.fulfilled, (state, action) =>
        applyItems(state, action.payload),
      )
      .addCase(clearCart.fulfilled, (state, action) =>
        applyItems(state, action.payload),
      );
  },
});

export const cartActions = cartSlice.actions;

export const checkoutCart = createAsyncThunk<void, void, { state: RootState }>(
  "cart/checkoutCart",
  async (_, { dispatch, getState }) => {
    const items = getState().cart.items;

    if (items.length === 0) return;

    dispatch(cartActions.setJustCheckedOut(true));
    dispatch(cartActions.setShowToast(true));

    const result = dispatch(clearCart());

    if (clearCart.rejected.match(result))
      dispatch(cartActions.setJustCheckedOut(false));

    setTimeout(() => dispatch(cartActions.setShowToast(false)), 3000);
  },
);

export const selectCartItems = (state: RootState) => state.cart.items;
const selectJustCheckedOut = (state: RootState) => state.cart.justCheckedOut;
const selectShowToast = (state: RootState) => state.cart.showToast;

export const selectCartTotals = createSelector([selectCartItems], (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return { totalItems, totalCost };
});

export const selectCartUi = createSelector(
  [selectJustCheckedOut, selectShowToast],
  (justCheckedOut, showToast) => ({ justCheckedOut, showToast }),
);

export default cartSlice.reducer;
