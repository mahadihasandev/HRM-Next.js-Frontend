import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string | number;
  fullId?: string;
  name: string;
  email: string;
  department?: string;
  phone_number?: string;
  role?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const STORAGE_KEY = "my-app-auth";

// Safely restore persisted state in browser environment
const getInitialAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    try {
      const persisted = localStorage.getItem(STORAGE_KEY);
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (
          parsed &&
          typeof parsed === "object" &&
          ("user" in parsed || "token" in parsed)
        ) {
          let user = (parsed.user as AuthUser) ?? null;
          if (user && (user.fullId === "admin@smart.com" || user.fullId === "admin@smarterp.biz")) {
            user = { ...user, fullId: "SMT-0001" };
          }
          return {
            user,
            token: typeof parsed.token === "string" ? parsed.token : null,
          };
        }
      }
    } catch {
      // Local storage not accessible or parse error
    }
  }

  return {
    user: null,
    token: null,
  };
};

const initialState: AuthState = getInitialAuthState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: AuthUser | null; token: string | null }>
    ) => {
      let user = action.payload.user;
      if (user && (user.fullId === "admin@smart.com" || user.fullId === "admin@smarterp.biz")) {
        user = { ...user, fullId: "SMT-0001" };
      }
      state.user = user;
      state.token = action.payload.token;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              user,
              token: action.payload.token,
            })
          );
        } catch {
          // ignore storage quota error
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("hrm_api_key");
        } catch {
          // ignore
        }
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
