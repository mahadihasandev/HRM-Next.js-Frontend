import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import { EmployeeProfile, EmployeeQueryParams } from "./types";
import { CreateEmployeePayload, EmployeeApiRecord, UpdateEmployeePayload } from "@/types/hrm";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<ApiResponse<EmployeeProfile[]>, EmployeeQueryParams | void>({
      query: (params) => ({
        url: "/hrm/get-employees",
        params: params || {},
      }),
      providesTags: ["Employee"],
    }),
    createEmployee: builder.mutation<ApiResponse<EmployeeApiRecord>, CreateEmployeePayload>({
      query: (body) => ({
        url: "/hrm/employee-create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee"],
    }),
    updateEmployee: builder.mutation<ApiResponse<EmployeeApiRecord>, { id: number | string; data: UpdateEmployeePayload }>({
      query: ({ id, data }) => ({
        url: `/hrm/employee-update/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employee"],
    }),
    deleteEmployee: builder.mutation<ApiResponse<{ deleted_id: number }>, number | string>({
      query: (id) => ({
        url: `/hrm/employee-delete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
