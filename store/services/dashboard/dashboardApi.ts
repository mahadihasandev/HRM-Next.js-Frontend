import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import { DashboardMetrics } from "./types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<ApiResponse<DashboardMetrics>, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardMetricsQuery,
} = dashboardApi;
