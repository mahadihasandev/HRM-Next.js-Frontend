import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import {
  SfmTargetDashboardData,
  TargetCommitmentItem,
  SfmDivisionItem,
  SfmRegionItem,
  SfmZoneItem,
  SfmBaseItem,
  SfmThanaItem,
  UpdateCommitmentPayload,
  ShopVisitingReportItem,
  ShopSummaryData,
  SrSummaryItem,
  ReasonBreakdownItem,
  DateWiseAttendanceItem,
  SfmEmployeeItem,
  SfmActionResponse,
} from "./types";

export const sfmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSfmTargetDashboard: builder.query<ApiResponse<SfmTargetDashboardData>, void>({
      query: () => "/sfm/target-dashboard",
      providesTags: ["SfmDashboard"],
    }),

    getSfmDivisions: builder.query<ApiResponse<SfmDivisionItem[]>, void>({
      query: () => "/sfm/setups/divisions",
    }),

    getSfmRegions: builder.query<ApiResponse<SfmRegionItem[]>, void>({
      query: () => "/sfm/setups/regions",
    }),

    getSfmZones: builder.query<ApiResponse<SfmZoneItem[]>, void>({
      query: () => "/sfm/setups/zones",
    }),

    getSfmBases: builder.query<ApiResponse<SfmBaseItem[]>, void>({
      query: () => "/sfm/setups/bases",
    }),

    getSfmThanas: builder.query<ApiResponse<SfmThanaItem[]>, void>({
      query: () => "/sfm/setups/thanas",
    }),

    getTargetCommitments: builder.query<
      ApiResponse<TargetCommitmentItem[]>,
      { month?: string; per_page?: number } | void
    >({
      query: (params) => ({
        url: "/sfm/target-commitments",
        params: params || {},
      }),
      providesTags: ["SfmCommitments"],
    }),

    updateTargetCommitment: builder.mutation<
      ApiResponse<SfmActionResponse>,
      UpdateCommitmentPayload
    >({
      query: ({ id, details }) => ({
        url: `/sfm/target-commitments/${id}/update`,
        method: "PUT",
        body: { details },
      }),
      invalidatesTags: ["SfmCommitments", "SfmDashboard"],
    }),

    getShopVisitingReport: builder.query<ApiResponse<ShopVisitingReportItem[]>, void>({
      query: () => "/sfm/reports/shop-visiting-report",
      providesTags: ["SfmVisits"],
    }),

    getShopSummary: builder.query<ApiResponse<ShopSummaryData>, void>({
      query: () => "/sfm/reports/shop-visiting-report/shop-summary",
    }),

    getSrSummary: builder.query<ApiResponse<SrSummaryItem[]>, void>({
      query: () => "/sfm/reports/shop-visiting-report/sr-summary",
    }),

    getReasonsBreakdown: builder.query<ApiResponse<ReasonBreakdownItem[]>, void>({
      query: () => "/sfm/reports/shop-visiting-report/reasons-breakdown",
    }),

    getDateWiseAttendance: builder.query<ApiResponse<DateWiseAttendanceItem[]>, { date?: string } | void>({
      query: (params) => ({
        url: "/sfm/reports/date-wise-attendance-report",
        params: params || {},
      }),
    }),

    getSfmEmployees: builder.query<ApiResponse<SfmEmployeeItem[]>, { search?: string } | void>({
      query: (params) => ({
        url: "/sfm/employees",
        params: params || {},
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSfmTargetDashboardQuery,
  useGetSfmDivisionsQuery,
  useGetSfmRegionsQuery,
  useGetSfmZonesQuery,
  useGetSfmBasesQuery,
  useGetSfmThanasQuery,
  useGetTargetCommitmentsQuery,
  useUpdateTargetCommitmentMutation,
  useGetShopVisitingReportQuery,
  useGetShopSummaryQuery,
  useGetSrSummaryQuery,
  useGetReasonsBreakdownQuery,
  useGetDateWiseAttendanceQuery,
  useGetSfmEmployeesQuery,
} = sfmApi;
