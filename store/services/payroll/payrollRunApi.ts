import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import {
  LegacyPayslip,
  PayrollImport,
  PayrollPreview,
  PayrollRun,
} from "./runTypes";
export const payrollRunApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    payrollHistory: builder.query<ApiResponse<LegacyPayslip[]>, void>({
      query: () => "/hrm/payroll/history",
      providesTags: ["Payroll"],
    }),
    payrollRuns: builder.query<ApiResponse<PayrollRun[]>, void>({
      query: () => "/hrm/payroll/runs",
      providesTags: ["Payroll"],
    }),
    payrollRun: builder.query<ApiResponse<PayrollRun>, number>({
      query: (id) => `/hrm/payroll/runs/${id}`,
      providesTags: ["Payroll"],
    }),
    previewPayroll: builder.mutation<
      ApiResponse<PayrollPreview>,
      PayrollImport
    >({
      query: (body) => ({ url: "/hrm/payroll/preview", method: "POST", body }),
    }),
    createPayroll: builder.mutation<ApiResponse<PayrollRun>, PayrollImport>({
      query: (body) => ({ url: "/hrm/payroll/runs", method: "POST", body }),
      invalidatesTags: ["Payroll"],
    }),
    payrollAction: builder.mutation<
      ApiResponse<PayrollRun>,
      {
        id: number;
        action: "approve" | "paid";
        payment_date?: string;
        payment_reference?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/hrm/payroll/runs/${id}/action`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
    discardPayroll: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({ url: `/hrm/payroll/runs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Payroll"],
    }),
    attachPayrollFile: builder.mutation<
      ApiResponse<PayrollRun>,
      { id: number; file: File }
    >({
      query: ({ id, file }) => {
        const body = new FormData();
        body.append("file", file);
        return {
          url: `/hrm/payroll/runs/${id}/attachments`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Payroll"],
    }),
    downloadPayrollFile: builder.mutation<
      string,
      { id: number; attachment: number }
    >({
      query: ({ id, attachment }) => ({
        url: `/hrm/payroll/runs/${id}/attachments/${attachment}`,
        responseHandler: async (response) =>
          response.ok
            ? URL.createObjectURL(await response.blob())
            : response.json(),
      }),
    }),
  }),
});
export const {
  usePayrollHistoryQuery,
  usePayrollRunsQuery,
  usePayrollRunQuery,
  usePreviewPayrollMutation,
  useCreatePayrollMutation,
  usePayrollActionMutation,
  useAttachPayrollFileMutation,
  useDownloadPayrollFileMutation,
  useDiscardPayrollMutation,
} = payrollRunApi;
