import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types";

interface ProductFormState {
  name: string;
  price: string;
  category: Product["category"];
  rating: string;
  image: string;
  badge: string;
  description: string;
}

interface PostFormState {
  title: string;
  excerpt: string;
  city: string;
  days: string;
  cover: string;
  date: string;
}

interface DestinationFormState {
  name: string;
  country: string;
  temperature: string;
  season: string;
  image: string;
  highlight: string;
}

interface AdminState {
  productForm: ProductFormState;
  postForm: PostFormState;
  destinationForm: DestinationFormState;
  productStatus: string | null;
  postStatus: string | null;
  destinationStatus: string | null;
}

const INITIAL_PRODUCT_FORM: ProductFormState = {
  name: "",
  price: "",
  category: "gear",
  rating: "",
  image: "",
  badge: "",
  description: "",
};

const INITIAL_POST_FORM: PostFormState = {
  title: "",
  excerpt: "",
  city: "",
  days: "",
  cover: "",
  date: "",
};

const INITIAL_DESTINATION_FORM: DestinationFormState = {
  name: "",
  country: "",
  temperature: "",
  season: "",
  image: "",
  highlight: "",
};

const initialState: AdminState = {
  productForm: INITIAL_PRODUCT_FORM,
  postForm: INITIAL_POST_FORM,
  destinationForm: INITIAL_DESTINATION_FORM,
  productStatus: null,
  postStatus: null,
  destinationStatus: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    updateProductForm: (
      state,
      action: PayloadAction<Partial<ProductFormState>>,
    ) => {
      state.productForm = {
        ...state.productForm,
        ...action.payload,
      };
    },
    resetProductForm: (state) => {
      state.productForm = INITIAL_PRODUCT_FORM;
    },
    setProductStatus: (state, action: PayloadAction<string | null>) => {
      state.productStatus = action.payload;
    },
    updatePostForm: (state, action: PayloadAction<Partial<PostFormState>>) => {
      state.postForm = {
        ...state.postForm,
        ...action.payload,
      };
    },
    resetPostForm: (state) => {
      state.postForm = INITIAL_POST_FORM;
    },
    setPostStatus: (state, action: PayloadAction<string | null>) => {
      state.postStatus = action.payload;
    },
    updateDestinationForm: (
      state,
      action: PayloadAction<Partial<DestinationFormState>>,
    ) => {
      state.destinationForm = {
        ...state.destinationForm,
        ...action.payload,
      };
    },
    resetDestinationForm: (state) => {
      state.destinationForm = INITIAL_DESTINATION_FORM;
    },
    setDestinationStatus: (state, action: PayloadAction<string | null>) => {
      state.destinationStatus = action.payload;
    },
  },
});

export const adminActions = adminSlice.actions;

export default adminSlice.reducer;
