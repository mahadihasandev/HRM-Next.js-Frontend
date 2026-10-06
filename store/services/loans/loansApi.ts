import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import { ApplyLoanRequest, HrLoanApiItem, LoanActionResponse } from "./types";

export const loansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHrLoans: builder.query<ApiResponse<HrLoanApiItem[]>, void>({
      query: () => "/hrm/hr-loan-list",
      providesTags: ["Loans"],
    }),

    applyHrLoan: builder.mutation<ApiResponse<LoanActionResponse>, ApplyLoanRequest>({
      query: (body) => ({
        url: "/hrm/hr-loan-apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loans"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetHrLoansQuery,
  useApplyHrLoanMutation,
} = loansApi;
