"use client";
import toast from "react-hot-toast";
import {
  Badge,
  Button,
  CardWrapper,
  EmptyState,
  Input,
  Text,
} from "@/components/shared";
import {
  useAttachPeopleFileMutation,
  useDownloadPeopleFileMutation,
  usePeopleRecordQuery,
} from "@/store/services/people/peopleApi";
import type {
  PeopleOverview,
  PeoplePayload,
} from "@/store/services/people/peopleApi";
import { payrollError } from "../payroll/PayrollWorkspace";
import { displayLabel } from "./config";

export function PeopleRecordDetail({
  id,
  overview,
  onEdit,
  onClose,
}: {
  id: number;
  overview: PeopleOverview;
  onEdit: (payload: PeoplePayload) => void;
  onClose: () => void;
}) {
  const { data, error, isLoading, isFetching, refetch } =
    usePeopleRecordQuery(id);
  const [attach, attachState] = useAttachPeopleFileMutation();
  const [download, downloadState] = useDownloadPeopleFileMutation();
  const record = data?.data;
  if (isLoading) return <Text role="status">Loading record…</Text>;
  if (error || !record)
    return (
      <EmptyState
        title="Record unavailable"
        description={payrollError(error)}
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  const canEdit =
    record.kind === "grievance"
      ? overview.capabilities.grievances
      : overview.capabilities.manage;
  return (
    <CardWrapper
      title={record.title}
      description={`Record #${record.id} · Version ${record.version}`}
      headerAction={
        <>
          <Badge variant="outline">{displayLabel(record.status)}</Badge>
          {canEdit && (
            <Button
              size="sm"
              disabled={isFetching}
              onClick={() => onEdit(record)}
            >
              Edit record
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close details
          </Button>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3 min-w-0">
          <Text variant="muted" className="!text-xs">
            {record.employee_full_id || "Company record"} · {record.start_date}
            {record.due_date ? ` → ${record.due_date}` : ""}
          </Text>
          {Object.entries(record.details)
            .filter(([key]) => key !== "participants")
            .map(
              ([key, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined && (
                  <div key={key}>
                    <Text
                      variant="caption"
                      className="!text-xs !text-slate-500"
                    >
                      {displayLabel(key)}
                    </Text>
                    <Text className="mt-1 whitespace-pre-wrap break-words !text-sm">
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value).replace(/_/g, " ")}
                    </Text>
                  </div>
                ),
            )}
          {record.details.participants && (
            <div className="space-y-2">
              <Text className="!font-semibold !text-sm">
                Training attendance
              </Text>
              {record.details.participants.map((participant) => (
                <div
                  key={participant.employee_full_id}
                  className="flex justify-between gap-2 rounded-lg bg-slate-50 p-2 text-xs"
                >
                  <span>
                    {overview.employees.find(
                      (employee) =>
                        employee.employee_full_id ===
                        participant.employee_full_id,
                    )?.name || participant.employee_full_id}
                  </span>
                  <Badge variant="outline">
                    {displayLabel(participant.result)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-5 min-w-0">
          {record.kind === "document" && (
            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <Text className="!font-semibold !text-sm">
                Private attachments
              </Text>
              {record.files.length === 0 && (
                <Text variant="muted" className="!text-xs">
                  No files attached yet.
                </Text>
              )}
              {record.files.map((file) => (
                <Button
                  key={file.id}
                  size="sm"
                  variant="outline"
                  className="!justify-start w-full overflow-hidden"
                  disabled={downloadState.isLoading}
                  onClick={async () => {
                    try {
                      await download({
                        id,
                        fileId: file.id,
                        name: file.name,
                      }).unwrap();
                    } catch (failure) {
                      toast.error(payrollError(failure));
                    }
                  }}
                >
                  <span className="truncate">{file.name}</span>
                  <span className="ml-auto text-xs">
                    {Math.ceil(file.size / 1024)} KB
                  </span>
                </Button>
              ))}
              {canEdit && (
                <Input
                  label="Attach a file"
                  type="file"
                  disabled={attachState.isLoading}
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.txt"
                  helperText="PDF, image, DOCX or TXT · Up to 10 MB"
                  onChange={async (event) => {
                    const input = event.currentTarget;
                    const file = input.files?.[0];
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error("Choose a file smaller than 10 MB.");
                      input.value = "";
                      return;
                    }
                    try {
                      await attach({ id, file }).unwrap();
                      toast.success("Private file attached.");
                    } catch (failure) {
                      toast.error(payrollError(failure));
                    } finally {
                      input.value = "";
                    }
                  }}
                />
              )}
            </div>
          )}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <Text className="!font-semibold !text-sm">Change history</Text>
            <div className="max-h-64 overflow-auto space-y-3">
              {record.events
                ?.slice()
                .reverse()
                .map((event) => (
                  <div
                    key={event.id}
                    className="border-l-2 border-teal-200 pl-3"
                  >
                    <Text className="!text-xs !font-medium">
                      {event.actor_name} · {displayLabel(event.action)}
                    </Text>
                    <Text variant="muted" className="mt-1 !text-xs">
                      {displayLabel(event.status)} · v{event.version} ·{" "}
                      {new Date(event.created_at).toLocaleString("en-GB", {
                        timeZone: "Asia/Dhaka",
                      })}
                    </Text>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
