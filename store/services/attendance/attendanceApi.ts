import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import {
  MobilePunchRequest,
  TodayAttendanceData,
  PunchResponse,
  AllEmployeesTodayAttendanceResponse,
} from "./types";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayAttendance: builder.query<ApiResponse<TodayAttendanceData>, void>({
      query: () => "/hrm/today-attendance-report",
      providesTags: ["Attendance"],
    }),

    getAllEmployeesTodayAttendance: builder.query<
      AllEmployeesTodayAttendanceResponse,
      { date?: string; status?: string; department?: string; search?: string } | void
    >({
      query: (params) => ({
        url: "/hrm/all-employees-today-attendance",
        params: params || {},
      }),
      providesTags: ["Attendance"],
    }),

    postMobilePunch: builder.mutation<ApiResponse<PunchResponse>, MobilePunchRequest>({
      query: (body) => ({
        url: "/hrm/mobile-attendance-store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance", "Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTodayAttendanceQuery,
  useGetAllEmployeesTodayAttendanceQuery,
  usePostMobilePunchMutation,
} = attendanceApi;
