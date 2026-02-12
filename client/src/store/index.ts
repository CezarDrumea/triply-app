import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import catalogReducer from "./slices/catalogSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    admin: adminReducer,
    auth: authReducer,
    cart: cartReducer,
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type TypedDispatch = typeof store.dispatch;
