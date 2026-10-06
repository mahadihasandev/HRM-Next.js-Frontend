import { baseApi } from "../baseApi";
import { EmployeePermissionProfile, UpdatePermissionsPayload } from "@/types/hrm";
import { PermissionsCatalogResponse } from "./types";

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissionsCatalog: builder.query<PermissionsCatalogResponse, void>({
      query: () => ({
        url: "/hrm/permissions",
      }),
      providesTags: ["Employee"],
    }),
    getEmployeePermissions: builder.query<EmployeePermissionProfile, number | string>({
      query: (id) => ({
        url: `/hrm/permissions/employee/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Employee", id }],
    }),
    updateEmployeePermissions: builder.mutation<
      EmployeePermissionProfile,
      { id: number | string; data: UpdatePermissionsPayload }
    >({
      query: ({ id, data }) => ({
        url: `/hrm/permissions/employee/${id}`,
        method: "POST",
        body: data,
        headers: data.operator_id ? { "X-Operator-Id": data.operator_id } : undefined,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Employee", id }, "Employee"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPermissionsCatalogQuery,
  useGetEmployeePermissionsQuery,
  useUpdateEmployeePermissionsMutation,
} = permissionApi;
