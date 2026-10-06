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
} = leaveApi;
