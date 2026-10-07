import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import {
  ApplyLeaveRequest,
  LeaveTypeItem,
  LeaveApplicationItem,
  LeaveApplicationResponse,
} from "./types";

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveApplications: builder.query<ApiResponse<LeaveApplicationItem[]>, void>({
      query: () => "/hrm/leave-applications",
      providesTags: ["Leave"],
    }),

    getLeaveTypes: builder.query<ApiResponse<LeaveTypeItem[]>, void>({
      query: () => "/hrm/leave/types",
    }),

    transitionLeave: builder.mutation<ApiResponse<LeaveApplicationItem>, { id: number | string; action: 'recommend' | 'approve' }>({
      query: ({ id, action }) => ({ url: `/hrm/${action}-leave-application/${id}`, method: 'POST' }),
      invalidatesTags: ['Leave', 'Dashboard'],
    }),
    applyLeave: builder.mutation<ApiResponse<LeaveApplicationResponse>, ApplyLeaveRequest>({
      query: (body) => ({
        url: "/hrm/leave/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leave", "Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeaveApplicationsQuery,
  useGetLeaveTypesQuery,
  useApplyLeaveMutation,
  useTransitionLeaveMutation,
} = leaveApi;
