"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        containerClassName="toast-container"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0f172a",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "12px 16px",
          },
          success: {
            duration: 3500,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </Provider>
  );
}
