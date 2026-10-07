import { isSuccessfulApiResponse } from "@/lib/api/response";
import { API_BASE_URL } from "@/lib/api/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    validateStatus: (response, body: unknown) => isSuccessfulApiResponse(response.status, body),
    prepareHeaders: (headers, { getState }) => {
      headers.set("Accept", "application/json");

      // Resolve dynamic auth token from localStorage
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token || "";
      let hrmApiKey = "";

      if (typeof window !== "undefined") {

        const storedApiKey = localStorage.getItem("hrm_api_key");

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
    "Factory",
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
