"use client";
import { useState } from "react";
import {
  ClipboardCheck,
  Factory,
  Gauge,
  Plus,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Badge,
  Button,
  CardWrapper,
  EmptyState,
  PageHeader,
  SearchInput,
  Text,
} from "@/components/shared";
import {
  FactoryPayload,
  FactorySetup,
  ProductionRecord,
  SafetyRecord,
  useFactoryOperationsQuery,
  useSaveFactoryRecordMutation,
} from "@/store/services/factory/factoryApi";
import { payrollError } from "../payroll/PayrollWorkspace";
import { label } from "@/lib/payroll/import";
import { FactoryRecordForm } from "./FactoryRecordForm";
const tabs = [
  "production",
  "factory",
  "line",
  "shift",
  "grade",
  "safety",
] as const;
type Tab = (typeof tabs)[number];
export function FactoryOperationsView({ canManage }: { canManage: boolean }) {
  const { data, isLoading, error, refetch } = useFactoryOperationsQuery();
  const [save, saveState] = useSaveFactoryRecordMutation();
  const [tab, setTab] = useState<Tab>("production");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<FactoryPayload | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const records = data?.data;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  });
  const production =
    records?.production.filter((record) => record.date === today) || [];
  const target = production.reduce((sum, record) => sum + record.target, 0);
  const accepted = production.reduce(
    (sum, record) => sum + record.completed - record.rejected,
    0,
  );
  const filter = (record: object) =>
    JSON.stringify(record).toLowerCase().includes(search.toLowerCase());
  async function submit(payload: FactoryPayload) {
    try {
      await save(payload).unwrap();
      setFormOpen(false);
      setEditing(null);
      toast.success("Factory record saved.");
    } catch (err) {
      toast.error(payrollError(err));
    }
  }
  const edit = (payload: FactoryPayload) => {
    setEditing(payload);
    setFormOpen(true);
  };
  function setupDetails(record: FactorySetup): string {
    return Object.entries(record.details)
      .map(([key, value]) => `${label(key)}: ${value}`)
      .join(" · ");
  }
  return (
    <div className="factory-workspace space-y-6">
      <PageHeader
        title="Factory operations"
        subtitle="A daily view of your factory floor, people and production."
        badge={
          <Badge
            variant="outline"
            className="!border-teal-200 !bg-teal-50 !text-teal-800"
          >
            GARMENT OPERATIONS
          </Badge>
        }
        action={
          canManage && (
            <Button
              className="!bg-teal-700"
              leftIcon={<Plus className="size-4" />}
              onClick={() => {
                setEditing(null);
                setFormOpen(!formOpen);
              }}
            >
              {formOpen
                ? "Close form"
                : `Add ${tab === "safety" ? "action" : tab === "factory" ? "factory unit" : tab}`}
            </Button>
          )
        }
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            title: "Factory units",
            value:
              records?.setups.filter(
                (record) => record.kind === "factory" && record.active,
              ).length || 0,
            detail: "Active locations",
            icon: Factory,
          },
          {
            title: "Accepted output today",
            value: accepted.toLocaleString(),
            detail: `${target.toLocaleString()} pieces targeted`,
            icon: ClipboardCheck,
          },
          {
            title: "Target achievement",
            value: target ? `${Math.round((accepted / target) * 100)}%` : "—",
            detail: "Accepted pieces / daily target",
            icon: Gauge,
          },
          {
            title: "Open floor actions",
            value:
              records?.safety.filter((record) => record.status !== "completed")
                .length || 0,
            detail: "Safety, training & maintenance",
            icon: ShieldCheck,
          },
        ].map((item) => (
          <CardWrapper key={item.title} className="!border-slate-200">
            <div className="flex justify-between">
              <Text variant="caption" className="!font-normal !text-slate-500">
                {item.title}
              </Text>
              <item.icon className="size-4 text-teal-700" />
            </div>
            <Text className="!text-2xl !font-semibold mt-4">{item.value}</Text>
            <Text
              variant="caption"
              className="mt-2 !font-normal !text-slate-500"
            >
              {item.detail}
            </Text>
          </CardWrapper>
        ))}
      </div>
      <div
        role="tablist"
        aria-label="Factory operations"
        className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3"
      >
        {tabs.map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            onClick={() => {
              setTab(value);
              setSearch("");
              setFormOpen(false);
              setEditing(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${value === tab ? "bg-teal-700 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {value === "factory"
              ? "Factory units"
              : value === "safety"
                ? "Safety & training"
                : label(value)}
          </button>
        ))}
      </div>
      {error && (
        <CardWrapper className="!bg-rose-50 !border-rose-200">
          <Text role="alert">{payrollError(error)}</Text>
          <Button variant="outline" onClick={() => refetch()} className="mt-3">
            Retry connection
          </Button>
        </CardWrapper>
      )}
      {formOpen && canManage && (
        <FactoryRecordForm
          key={`${tab}-${editing?.id || "new"}`}
          tab={tab}
          editing={editing}
          setups={records?.setups || []}
          onSubmit={submit}
          busy={saveState.isLoading}
        />
      )}
      {isLoading ? (
        <Text role="status">Loading factory operations…</Text>
      ) : (
        !error && (
          <CardWrapper
            title={
              tab === "production"
                ? "Daily production register"
                : tab === "safety"
                  ? "Factory action register"
                  : `${label(tab)} setup`
            }
            description={
              tab === "production"
                ? "Track order and style output by factory and line. Rejected pieces are excluded from achievement."
                : tab === "grade"
                  ? "Store company-approved basic salary and overtime rates. These settings do not overwrite employee salaries."
                  : tab === "shift"
                    ? "Define shift times and breaks, including shifts crossing midnight."
                    : tab === "safety"
                      ? "Record follow-up actions, training sessions and maintenance work with an accountable owner."
                      : "Maintain active factory units and production line capacity."
            }
            className="!border-slate-200"
            headerAction={
              <SearchInput
                aria-label="Search factory records"
                placeholder="Search records…"
                value={search}
                onChange={setSearch}
              />
            }
          >
            {tab === "production" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[850px]">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      {[
                        "Date / order",
                        "Factory / line",
                        "Style",
                        "Target",
                        "Completed",
                        "Rejected",
                        "Achievement",
                        "",
                      ].map((title) => (
                        <th className="p-3 font-medium" key={title}>
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records?.production
                      .filter(filter)
                      .map((record: ProductionRecord) => (
                        <tr key={record.id}>
                          <td className="p-3">
                            {record.date}
                            <Text
                              variant="caption"
                              className="mt-1 !font-normal !text-slate-500"
                            >
                              {record.order_ref}
                            </Text>
                          </td>
                          <td className="p-3">
                            {record.factory_code} / {record.line_code}
                          </td>
                          <td className="p-3">{record.style}</td>
                          <td className="p-3">
                            {record.target.toLocaleString()}
                          </td>
                          <td className="p-3">
                            {record.completed.toLocaleString()}
                          </td>
                          <td className="p-3 text-rose-600">
                            {record.rejected.toLocaleString()}
                          </td>
                          <td className="p-3 text-teal-800 font-semibold">
                            {Math.round(
                              ((record.completed - record.rejected) /
                                record.target) *
                                100,
                            )}
                            %
                          </td>
                          <td className="p-3">
                            {canManage && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  edit({ ...record, type: "production" })
                                }
                              >
                                Edit
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {!records?.production.filter(filter).length && (
                  <EmptyState
                    title="No production records"
                    description="Add factory units and lines, then record daily order targets and output."
                  />
                )}
              </div>
            ) : tab === "safety" ? (
              <div className="space-y-3">
                {records?.safety.filter(filter).map((record: SafetyRecord) => (
                  <div
                    key={record.id}
                    className="border border-slate-200 rounded-xl p-4 flex gap-4 items-start justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2 items-center">
                        <Text className="!text-sm !font-semibold">
                          {record.title}
                        </Text>
                        <Badge
                          variant={
                            record.status === "completed"
                              ? "success"
                              : "outline"
                          }
                        >
                          {label(record.status)}
                        </Badge>
                      </div>
                      <Text
                        variant="caption"
                        className="mt-2 !font-normal !text-slate-500"
                      >
                        {record.date} · {record.factory_code} ·{" "}
                        {label(record.category)} · Owner: {record.owner}
                      </Text>
                      <Text className="!text-sm !font-normal mt-2 whitespace-pre-wrap break-words">
                        {record.notes}
                      </Text>
                    </div>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => edit({ ...record, type: "safety" })}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                ))}
                {!records?.safety.filter(filter).length && (
                  <EmptyState
                    title="No floor actions recorded"
                    description="Log safety follow-ups, staff training and maintenance tasks here."
                  />
                )}
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-3">
                {records?.setups
                  .filter((record) => record.kind === tab)
                  .filter(filter)
                  .map((record) => (
                    <div
                      key={record.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex justify-between gap-3">
                        <Text className="!text-base !font-semibold">
                          {record.name}
                        </Text>
                        <Badge variant={record.active ? "success" : "outline"}>
                          {record.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <Text
                        variant="caption"
                        className="!font-normal !text-slate-500 mt-2"
                      >
                        {record.code}
                      </Text>
                      <Text className="!text-sm !font-normal mt-3 break-words">
                        {setupDetails(record)}
                      </Text>
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-3"
                          onClick={() => edit({ ...record, type: "setup" })}
                        >
                          Edit setup
                        </Button>
                      )}
                    </div>
                  ))}
                {!records?.setups
                  .filter((record) => record.kind === tab)
                  .filter(filter).length && (
                  <div className="lg:col-span-2">
                    <EmptyState
                      title={`No ${tab} setup yet`}
                      description="Create the company-approved factory configuration to get started."
                    />
                  </div>
                )}
              </div>
            )}
          </CardWrapper>
        )
      )}
    </div>
  );
}
