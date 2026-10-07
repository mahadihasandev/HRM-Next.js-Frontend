import { baseApi } from "../baseApi";
import type { ApiResponse } from "../types";
import type { FactorySetup } from "../factory/factoryApi";

export type PeopleKind =
  | "document"
  | "roster"
  | "training"
  | "grievance"
  | "incident"
  | "holiday";
export interface Participant {
  employee_full_id: string;
  result: "registered" | "attended" | "absent";
}
export interface PeopleDetails {
  category?: string;
  reference?: string;
  notes?: string;
  factory_code?: string;
  shift_code?: string;
  line_code?: string;
  trainer?: string;
  location?: string;
  participants?: Participant[];
  priority?: string;
  description?: string;
  resolution?: string;
  severity?: string;
  corrective_action?: string;
  responsible_person?: string;
  paid?: boolean;
}
export interface PeopleEvent {
  id: number;
  actor_name: string;
  action: string;
  status: string;
  version: number;
  created_at: string;
}
export interface PeopleRecord {
  id: number;
  kind: PeopleKind;
  employee_full_id: string | null;
  title: string;
  start_date: string;
  due_date: string | null;
  status: string;
  details: PeopleDetails;
  version: number;
  updated_at: string;
  files: { id: number; name: string; size: number }[];
  events?: PeopleEvent[];
}
export type PeoplePayload = Omit<
  PeopleRecord,
  "id" | "version" | "updated_at" | "files" | "events"
> & { id?: number; version?: number };
export interface PeopleOverview {
  capabilities: { manage: boolean; grievances: boolean };
  employee_full_id: string;
  stats: {
    documents_due: number;
    overdue_actions: number;
    open_concerns: number;
    upcoming_training: number;
  };
  employees: { employee_full_id: string; name: string; department: string }[];
  setups: FactorySetup[];
}
export const peopleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    peopleOverview: builder.query<ApiResponse<PeopleOverview>, void>({
      query: () => "/hrm/people/overview",
      providesTags: ["People"],
    }),
    peopleRecords: builder.query<
      ApiResponse<{
        records: PeopleRecord[];
        pagination: { current_page: number; last_page: number; total: number };
      }>,
      { kind: PeopleKind; page: number; q: string; status: string }
    >({
      query: (params) => ({ url: "/hrm/people/records", params }),
      providesTags: ["People"],
    }),
    peopleRecord: builder.query<ApiResponse<PeopleRecord>, number>({
      query: (id) => `/hrm/people/records/${id}`,
      providesTags: ["People"],
    }),
    savePeopleRecord: builder.mutation<
      ApiResponse<PeopleRecord>,
      PeoplePayload
    >({
      query: (body) => ({ url: "/hrm/people/records", method: "POST", body }),
      invalidatesTags: ["People", "Attendance"],
    }),
    attachPeopleFile: builder.mutation<
      ApiResponse<PeopleRecord>,
      { id: number; file: File }
    >({
      query: ({ id, file }) => {
        const body = new FormData();
        body.append("file", file);
        return { url: `/hrm/people/records/${id}/files`, method: "POST", body };
      },
      invalidatesTags: ["People"],
    }),
    downloadPeopleFile: builder.mutation<
      null,
      { id: number; fileId: number; name: string }
    >({
      async queryFn({ id, fileId, name }, _api, _extra, baseQuery) {
        const result = await baseQuery({
          url: `/hrm/people/records/${id}/files/${fileId}`,
          responseHandler: async (response) =>
            response.ok ? response.blob() : response.json(),
        });
        if (result.error) return { error: result.error };
        if (!(result.data instanceof Blob))
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "The attachment could not be downloaded.",
            },
          };
        const url = URL.createObjectURL(result.data);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = name;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return { data: null };
      },
    }),
  }),
});
export const {
  usePeopleOverviewQuery,
  usePeopleRecordsQuery,
  usePeopleRecordQuery,
  useSavePeopleRecordMutation,
  useAttachPeopleFileMutation,
  useDownloadPeopleFileMutation,
} = peopleApi;
