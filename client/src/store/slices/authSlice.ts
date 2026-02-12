import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ApiResponse, Role } from "../../types";
import { SERVER_LOCATION } from "../../utils/constants";

interface AuthPayload {
  role: Role | null;
}

interface AuthState {
  role: Role;
  authLoading: boolean;
  loginRole: Role;
  loginLoading: boolean;
  loginError: string | null;
}

const initialState: AuthState = {
  role: "guest",
  authLoading: true,
  loginRole: "user",
  loginLoading: false,
  loginError: null,
};

export const loadSession = createAsyncThunk<Role>(
  "auth/loadSession",
  async () => {
    try {
      const response = await fetch(`${SERVER_LOCATION}/api/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to load auth state");

      const payload = (await response.json()) as { data: AuthPayload };
      return payload.data.role ?? "guest";
    } catch {
      return "guest";
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await fetch(`${SERVER_LOCATION}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error(err);
  }
});

export const login = createAsyncThunk<Role, Role>(
  "auth/login",
  async (role) => {
    const response = await fetch(`${SERVER_LOCATION}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    });

    if (!response.ok) throw new Error(`Login failed: ${response.status}`);

    const payload = (await response.json()) as ApiResponse<AuthPayload>;

    if (!payload.data.role) throw new Error("Login failed: missing role");

    return payload.data.role;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginRole: (state, action: PayloadAction<Role>) => {
      state.loginRole = action.payload;
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSession.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.role = action.payload;
        state.authLoading = false;
      })
      .addCase(loadSession.rejected, (state) => {
        state.role = "guest";
        state.authLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.role = action.payload;
        state.loginLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginLoading = false;
        state.loginError = action.error.message ?? "Login failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.role = "guest";
      });
  },
});

export const { setLoginRole } = authSlice.actions;

export default authSlice.reducer;
