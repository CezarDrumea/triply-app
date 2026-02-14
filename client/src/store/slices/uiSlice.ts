import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const TABS = ["shop", "blog", "destinations"] as const;

export type Category = "all" | "gear" | "prints" | "guides";

export type Tab = (typeof TABS)[number] | "admin";

interface UiState {
  category: Category;
}

const initialState: UiState = {
  category: "all",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<Category>) => {
      state.category = action.payload;
    },
  },
});

export const { setCategory } = uiSlice.actions;
export default uiSlice.reducer;
