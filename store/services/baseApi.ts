import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");

      // Resolve dynamic auth token from localStorage
      let token = "";
      let hrmApiKey = "";

      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("auth_token");
        const storedApiKey = localStorage.getItem("hrm_api_key");
        if (storedToken) token = storedToken;
        if (storedApiKey) hrmApiKey = storedApiKey;
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (hrmApiKey) {
        headers.set("hrm-api-key", hrmApiKey);
      }

      return headers;
    },
    credentials: "same-origin",
  }),
  tagTypes: [
    "Health",
    "Auth",
    "Dashboard",
    "Employee",
    "Attendance",
    "Leave",
    "Payroll",
    "Requests",
    "Loans",
    "SndDashboard",
    "SndCustomers",
    "SndOrders",
    "SfmDashboard",
    "SfmCommitments",
    "SfmVisits",
    "TourPlans",
    "Claims",
  ],
  endpoints: () => ({}),
});

// Alias for convenience & backwards compatibility
export const apiSlice = baseApi;
