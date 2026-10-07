import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./services/baseApi";
import authReducer, { logout, setUser } from "./authSlice";
const authListener = createListenerMiddleware();
authListener.startListening({
  matcher: isAnyOf(logout, setUser),
  effect: (action, api) => {
    const previous = api.getOriginalState() as { auth: { token: string | null } };
    const current = api.getState() as { auth: { token: string | null } };
    if (logout.match(action) || previous.auth.token !== current.auth.token) api.dispatch(baseApi.util.resetApiState());
  },
});

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListener.middleware).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
