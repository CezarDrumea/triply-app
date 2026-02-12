import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ApiResponse, Destination, Post, Product } from "../../types";
import { SERVER_LOCATION } from "../../utils/constants";

interface CatalogState {
  products: Product[];
  posts: Post[];
  destinations: Destination[];
  productsStatus: "idle" | "loading" | "failed";
  postsStatus: "idle" | "loading" | "failed";
  destinationsStatus: "idle" | "loading" | "failed";
}

export const fetchProducts = createAsyncThunk(
  "catalog/fetchProducts",
  async () => {
    const response = await fetch(`${SERVER_LOCATION}/api/products`);

    if (!response.ok)
      throw new Error(`Products request failed: ${response.status}`);

    const payload = (await response.json()) as ApiResponse<Product[]>;

    return payload.data;
  },
);

export const fetchPosts = createAsyncThunk("catalog/fetchPosts", async () => {
  const response = await fetch(`${SERVER_LOCATION}/api/posts`);

  if (!response.ok) throw new Error(`Posts request failed: ${response.status}`);

  const payload = (await response.json()) as ApiResponse<Post[]>;

  return payload.data;
});

export const fetchDestinations = createAsyncThunk(
  "catalog/fetchDestinations",
  async () => {
    const response = await fetch(`${SERVER_LOCATION}/api/destinations`);

    if (!response.ok)
      throw new Error(`Destinations request failed: ${response.status}`);

    const payload = (await response.json()) as ApiResponse<Destination[]>;

    return payload.data;
  },
);

const initialState: CatalogState = {
  products: [],
  posts: [],
  destinations: [],
  productsStatus: "idle",
  postsStatus: "idle",
  destinationsStatus: "idle",
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsStatus = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.productsStatus = "idle";
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.productsStatus = "failed";
      })
      .addCase(fetchPosts.pending, (state) => {
        state.postsStatus = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.postsStatus = "idle";
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.postsStatus = "failed";
      })
      .addCase(fetchDestinations.pending, (state) => {
        state.destinationsStatus = "loading";
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.destinations = action.payload;
        state.destinationsStatus = "idle";
      })
      .addCase(fetchDestinations.rejected, (state) => {
        state.destinationsStatus = "failed";
      });
  },
});

export default catalogSlice.reducer;
