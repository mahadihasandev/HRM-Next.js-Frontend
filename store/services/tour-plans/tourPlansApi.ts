import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import {
  TourPlanItem,
  TourClaimItem,
  WorkTypeItem,
  TransportTypeItem,
  StoreTourPlanPayload,
  PunchPlanPayload,
  StoreTourClaimPayload,
  TourPlanActionResponse,
} from "./types";

export const tourPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkTypes: builder.query<ApiResponse<WorkTypeItem[]>, void>({
      query: () => "/hrm/get-work-types",
    }),

    getTransportTypes: builder.query<ApiResponse<TransportTypeItem[]>, void>({
      query: () => "/hrm/get-transport-types",
    }),

    getTourPlans: builder.query<ApiResponse<TourPlanItem[]>, void>({
      query: () => "/hrm/tour-plans",
      providesTags: ["TourPlans"],
    }),

    storeTourPlan: builder.mutation<ApiResponse<TourPlanActionResponse>, StoreTourPlanPayload>({
      query: (body) => ({
        url: "/hrm/tour-plans/store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TourPlans"],
    }),

    punchPlan: builder.mutation<ApiResponse<TourPlanActionResponse>, PunchPlanPayload>({
      query: (body) => ({
        url: "/hrm/punch-plan",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TourPlans"],
    }),

    getTourPlanClaims: builder.query<ApiResponse<TourClaimItem[]>, { month?: string } | void>({
      query: (params) => ({
        url: "/hrm/tour-plans-claims",
        params: params || {},
      }),
      providesTags: ["Claims"],
    }),

    storeTourPlanClaim: builder.mutation<ApiResponse<TourPlanActionResponse>, StoreTourClaimPayload>({
      query: (body) => ({
        url: "/hrm/tour-plans-claims/store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Claims"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWorkTypesQuery,
  useGetTransportTypesQuery,
  useGetTourPlansQuery,
  useStoreTourPlanMutation,
  usePunchPlanMutation,
  useGetTourPlanClaimsQuery,
  useStoreTourPlanClaimMutation,
} = tourPlansApi;
