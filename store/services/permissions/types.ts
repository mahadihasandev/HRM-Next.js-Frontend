export type { PermissionItem, EmployeePermissionProfile, UpdatePermissionsPayload } from "@/types/hrm";

export interface PermissionsCatalogResponse {
  status: boolean;
  data: import("@/types/hrm").PermissionItem[];
  department_profiles: Record<string, Record<string, boolean>>;
}
