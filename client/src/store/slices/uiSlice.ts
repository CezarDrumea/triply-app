import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const TABS = ["shop", "blog", "destinations"] as const;

export type Category = "all" | "gear" | "prints" | "guides";

export type Tab = (typeof TABS)[number] | "admin";

interface UiState {
  activeTab: Tab;
  category: Category;
  showAuth: boolean;
}

const initialState: UiState = {
  activeTab: "shop",
  category: "all",
  showAuth: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<Tab>) => {
      state.activeTab = action.payload;
    },
    setCategory: (state, action: PayloadAction<Category>) => {
      state.category = action.payload;
    },
    setShowAuth: (state, action: PayloadAction<boolean>) => {
      state.showAuth = action.payload;
    },
  },
});

export const { setActiveTab, setCategory, setShowAuth } = uiSlice.actions;
export default uiSlice.reducer;
