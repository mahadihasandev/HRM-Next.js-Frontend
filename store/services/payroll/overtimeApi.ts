import { baseApi } from "../baseApi";
import {
  ApiResponse,
  OvertimeRatesData,
  OvertimeRateLogItem,
} from "@/types/hrm";
export const overtimeApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    overtimeRates: builder.query<ApiResponse<OvertimeRatesData>, void>({
      query: () => "/hrm/overtime/rates",
    }),
    overtimeLogs: builder.query<ApiResponse<OvertimeRateLogItem[]>, void>({
      query: () => "/hrm/overtime/logs",
    }),
    setOvertimeRate: builder.mutation<
      ApiResponse<unknown>,
      {
        employee_full_id: string;
        overtime_rate: number;
        reason: string;
        operator_id: string;
      }
    >({
      query: (body) => ({
        url: "/hrm/overtime/set-rate",
        method: "POST",
        body,
      }),
    }),
    bulkOvertimeRates: builder.mutation<
      ApiResponse<{ updated_count?: number }>,
      { mode: string; operator_id: string }
    >({
      query: (body) => ({
        url: "/hrm/overtime/bulk-set",
        method: "POST",
        body,
      }),
    }),
  }),
});
export const {
  useOvertimeRatesQuery,
  useOvertimeLogsQuery,
  useSetOvertimeRateMutation,
  useBulkOvertimeRatesMutation,
} = overtimeApi;
