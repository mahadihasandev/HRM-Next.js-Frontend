import { clearAuthSession, persistAuthSession, readAuthSession } from "@/lib/api/authStorage";
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
  rememberMe: boolean;
}



// Safely restore persisted state in browser environment
const getInitialAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    try {
      const persisted = readAuthSession();
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
            rememberMe: parsed.rememberMe !== false,
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
    rememberMe: true,
  };
};

const initialState: AuthState = getInitialAuthState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: AuthUser | null; token: string | null; rememberMe?: boolean }>
    ) => {
      let user = action.payload.user;
      if (user && (user.fullId === "admin@smart.com" || user.fullId === "admin@smarterp.biz")) {
        user = { ...user, fullId: "SMT-0001" };
      }
      state.user = user;
      state.token = action.payload.token;
      state.rememberMe = action.payload.rememberMe ?? state.rememberMe;

      if (typeof window !== "undefined") {
        try {
          persistAuthSession({ user, token: action.payload.token, rememberMe: state.rememberMe }, state.rememberMe);
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
          clearAuthSession();
        } catch {
          // ignore
        }
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
