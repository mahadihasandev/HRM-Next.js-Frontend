"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  ClipboardCheck,
  FileCheck,
  GraduationCap,
  MessageCircle,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  CardWrapper,
  EmptyState,
  PageHeader,
  SearchInput,
  Select,
  StatCard,
  Text,
} from "@/components/shared";
import {
  usePeopleOverviewQuery,
  usePeopleRecordsQuery,
  useSavePeopleRecordMutation,
} from "@/store/services/people/peopleApi";
import type {
  PeopleKind,
  PeoplePayload,
} from "@/store/services/people/peopleApi";
import { cn } from "@/lib/utils";
import { payrollError } from "../payroll/PayrollWorkspace";
import {
  displayLabel,
  newRecord,
  sections,
  statuses,
  todayDhaka,
} from "./config";
import { PeopleRecordForm } from "./PeopleRecordForm";
import { PeopleRecordDetail } from "./PeopleRecordDetail";
const icons = {
  document: FileCheck,
  roster: Users,
  training: GraduationCap,
  grievance: MessageCircle,
  incident: ShieldCheck,
  holiday: CalendarDays,
};

export function PeopleOperationsView({ kind, onSectionChange }: {
  kind: PeopleKind;
  onSectionChange: (kind: PeopleKind) => void;
}) {
  const overviewQuery = usePeopleOverviewQuery();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<PeoplePayload | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [save, saveState] = useSavePeopleRecordMutation();
  const recordsQuery = usePeopleRecordsQuery({ kind, page, q, status });
  const overview = overviewQuery.data?.data;
  const section = sections.find((item) => item.kind === kind)!;
  const records = recordsQuery.currentData?.data;
  const canManage =
    kind === "grievance"
      ? overview?.capabilities.grievances
      : overview?.capabilities.manage;
  const canAdd = Boolean(
    overview && (canManage || kind === "grievance" || kind === "incident"),
  );
  function selectKind(next: PeopleKind) {
    onSectionChange(next);
    setPage(1);
    setQ("");
    setSearch("");
    setStatus("");
    setEditing(null);
    setSelectedId(null);
  }
  async function submit(payload: PeoplePayload) {
    try {
      const result = await save(payload).unwrap();
      setEditing(null);
      setSelectedId(result.data.id);
      toast.success("HR record saved.");
    } catch (error) {
      throw new Error(payrollError(error));
    }
  }
  if (overviewQuery.isLoading)
    return <Text role="status">Loading HR workspace…</Text>;
  if (overviewQuery.error || !overview)
    return (
      <EmptyState
        title="HR workspace unavailable"
        description={payrollError(overviewQuery.error)}
        action={
          <Button variant="outline" onClick={() => overviewQuery.refetch()}>
            Retry
          </Button>
        }
      />
    );
  return (
    <div className="space-y-6">
      <PageHeader
        title="HR & compliance"
        subtitle="Keep worker records current and follow through on the things that matter."
        badge={<Badge variant="outline">PEOPLE OPERATIONS</Badge>}
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Documents expiring"
          value={overview.stats.documents_due}
          subtitle="Due within 30 days"
          icon={<FileCheck className="size-4" />}
          onClick={() => selectKind("document")}
        />
        <StatCard
          title="Open concerns"
          value={overview.stats.open_concerns}
          subtitle="Grievances & safety incidents"
          icon={<MessageCircle className="size-4" />}
          variant="blue"
          onClick={() => selectKind("grievance")}
        />
        <StatCard
          title="Overdue follow-ups"
          value={overview.stats.overdue_actions}
          subtitle="Actions needing attention"
          icon={<ClipboardCheck className="size-4" />}
          variant="amber"
          onClick={() => selectKind("incident")}
        />
        <StatCard
          title="Upcoming training"
          value={overview.stats.upcoming_training}
          subtitle="Planned within 30 days"
          icon={<GraduationCap className="size-4" />}
          variant="purple"
          onClick={() => selectKind("training")}
        />
      </div>
      <div
        className="flex overflow-x-auto gap-1 rounded-xl border border-slate-200 bg-white p-1.5"
        aria-label="HR sections"
      >
        {sections.map((item) => {
          const Icon = icons[item.kind];
          return (
            <button
              key={item.kind}
              type="button"
              aria-pressed={kind === item.kind}
              onClick={() => selectKind(item.kind)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                kind === item.kind
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-500 hover:bg-slate-50",
              )}
            >
              <Icon className="size-4" />
              {item.title}
            </button>
          );
        })}
      </div>
      {(kind === "grievance" || kind === "incident") && (
        <div className="flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal-700" />
          <Text className="!text-xs !text-teal-900">
            {kind === "grievance"
              ? "Concerns are confidential within your company. Your identity is visible to authorized grievance handlers. Follow your factory’s grievance process for urgent assistance."
              : "Reports are visible to you and authorized HR managers. Use your factory’s emergency procedure for immediate danger."}
          </Text>
        </div>
      )}
      {editing && (
        <PeopleRecordForm
          key={`${kind}-${editing.id || "new"}-${editing.version || 0}`}
          initial={editing}
          overview={overview}
          busy={saveState.isLoading}
          onSave={submit}
          onCancel={() => setEditing(null)}
        />
      )}
      {selectedId && !editing && (
        <PeopleRecordDetail
          key={selectedId}
          id={selectedId}
          overview={overview}
          onClose={() => setSelectedId(null)}
          onEdit={setEditing}
        />
      )}
      <CardWrapper
        title={section.title}
        description={section.description}
        headerAction={
          canAdd && (
            <Button
              size="sm"
              leftIcon={<Plus className="size-4" />}
              disabled={saveState.isLoading}
              onClick={() => {
                setEditing(newRecord(kind));
                setSelectedId(null);
              }}
            >
              {section.addLabel}
            </Button>
          )
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <SearchInput
            key={kind}
            value={search}
            onChange={setSearch}
            onDebouncedChange={(next) => {
              setQ(next);
              setPage(1);
            }}
            aria-label="Search HR records"
            placeholder="Search title or employee ID…"
            className="flex-1"
          />
          <Select
            label="Filter status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {statuses[kind].map((option) => (
              <option key={option} value={option}>
                {displayLabel(option)}
              </option>
            ))}
          </Select>
        </div>
        {recordsQuery.isFetching && (
          <Text role="status" className="mb-3 !text-xs !text-slate-500">
            Loading records…
          </Text>
        )}
        {recordsQuery.error ? (
          <EmptyState
            title="Records could not load"
            description={payrollError(recordsQuery.error)}
            action={
              <Button variant="outline" onClick={() => recordsQuery.refetch()}>
                Retry
              </Button>
            }
          />
        ) : records?.records.length === 0 ? (
          <EmptyState
            title={`No ${section.title.toLowerCase()} yet`}
            description={
              canAdd
                ? "Add your first record to start tracking it here."
                : "Your records will appear here when HR assigns them."
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {records?.records.map((record) => {
              const expiry =
                record.kind === "document" &&
                record.due_date &&
                !["archived", "expired"].includes(record.status);
              const overdue =
                record.due_date &&
                record.due_date < todayDhaka() &&
                (expiry ||
                  ["open", "in_review", "in_progress"].includes(record.status));
              const Icon = icons[record.kind];
              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(record.id);
                    setEditing(null);
                  }}
                  className="flex w-full items-start gap-3 rounded-lg py-4 text-left transition hover:bg-slate-50 sm:px-2"
                >
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Text className="truncate !text-sm !font-semibold">
                      {record.title}
                    </Text>
                    <Text variant="muted" className="mt-1 !text-xs">
                      {record.employee_full_id
                        ? `${overview.employees.find((employee) => employee.employee_full_id === record.employee_full_id)?.name || record.employee_full_id} · `
                        : ""}
                      {record.start_date}
                      {record.due_date ? ` → ${record.due_date}` : ""}
                    </Text>
                    <Text variant="muted" className="mt-1 !text-xs">
                      {record.details.category
                        ? displayLabel(record.details.category)
                        : record.details.shift_code
                          ? `Shift ${record.details.shift_code} · ${record.details.factory_code}`
                          : ""}
                      {record.details.participants
                        ? ` · ${record.details.participants.length} participant${record.details.participants.length === 1 ? "" : "s"}`
                        : ""}
                    </Text>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge variant="outline">
                      {displayLabel(record.status)}
                    </Badge>
                    {overdue && (
                      <Badge variant="warning">
                        {expiry ? "Expired date" : "Overdue"}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {records && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <Text variant="muted" className="!text-xs">
              {records.pagination.total} records · Page{" "}
              {records.pagination.current_page} of{" "}
              {records.pagination.last_page}
            </Text>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || recordsQuery.isFetching}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={
                  page >= records.pagination.last_page ||
                  recordsQuery.isFetching
                }
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardWrapper>
    </div>
  );
}
