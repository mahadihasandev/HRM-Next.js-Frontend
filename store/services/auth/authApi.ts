import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import {
  HealthCheckData,
  EmployeeProfile,
  LoginCredentials,
  LoginResponseData,
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  RegisterUserRequest,
  RegisterUserResponse,
} from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealthStatus: builder.query<ApiResponse<HealthCheckData>, void>({
      query: () => "/health",
      providesTags: ["Health"],
    }),

    login: builder.mutation<ApiResponse<LoginResponseData>, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "Dashboard"],
    }),

    getUserProfile: builder.query<ApiResponse<EmployeeProfile>, void>({
      query: () => "/hrm/profile",
      providesTags: ["Employee"],
    }),

    sendVerificationCode: builder.mutation<SendVerificationCodeResponse, SendVerificationCodeRequest>({
      query: (body) => ({
        url: "/auth/send-verification-code",
        method: "POST",
        body,
      }),
    }),

    verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
      query: (body) => ({
        url: "/auth/verify-code",
        method: "POST",
        body,
      }),
    }),

    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Dashboard", "Employee"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetHealthStatusQuery,
  useLoginMutation,
  useGetUserProfileQuery,
  useSendVerificationCodeMutation,
  useVerifyCodeMutation,
  useRegisterUserMutation,
} = authApi;

