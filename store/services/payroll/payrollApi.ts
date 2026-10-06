import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import { PayslipQueryParams, PayslipData } from "./types";

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayslip: builder.query<ApiResponse<PayslipData>, PayslipQueryParams | void>({
      query: (params) => ({
        url: "/hrm/payslip",
        params: params || {},
      }),
      providesTags: ["Payroll"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayslipQuery,
} = payrollApi;
