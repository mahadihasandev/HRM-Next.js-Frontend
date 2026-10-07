import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
export type SetupKind = "factory" | "line" | "shift" | "grade";
export interface FactorySetup {
  id: number;
  kind: SetupKind;
  code: string;
  name: string;
  active: boolean;
  details: Record<string, string | number>;
}
export interface ProductionRecord {
  id: number;
  date: string;
  factory_code: string;
  line_code: string;
  order_ref: string;
  style: string;
  target: number;
  completed: number;
  rejected: number;
}
export interface SafetyRecord {
  id: number;
  date: string;
  factory_code: string;
  category: "safety" | "training" | "maintenance";
  title: string;
  notes: string;
  owner: string;
  status: "open" | "in_progress" | "completed";
}
export interface FactoryOperations {
  setups: FactorySetup[];
  production: ProductionRecord[];
  safety: SafetyRecord[];
}
export type FactoryPayload =
  | (Omit<FactorySetup, "id"> & { type: "setup"; id?: number })
  | (Omit<ProductionRecord, "id"> & { type: "production"; id?: number })
  | (Omit<SafetyRecord, "id"> & { type: "safety"; id?: number });
export const factoryApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    factoryOperations: builder.query<ApiResponse<FactoryOperations>, void>({
      query: () => "/hrm/factory/operations",
      providesTags: ["Factory"],
    }),
    saveFactoryRecord: builder.mutation<
      ApiResponse<FactorySetup | ProductionRecord | SafetyRecord>,
      FactoryPayload
    >({
      query: (body) => ({ url: "/hrm/factory/records", method: "POST", body }),
      invalidatesTags: ["Factory"],
    }),
  }),
});
export const { useFactoryOperationsQuery, useSaveFactoryRecordMutation } =
  factoryApi;
