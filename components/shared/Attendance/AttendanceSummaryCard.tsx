"use client";

import { ArrowRight, Clock3, LogIn, LogOut, RefreshCw } from "lucide-react";
import { Badge, Button, CardWrapper, Text, Title } from "@/components/shared";
import { FingerprintPunchButton } from "./FingerprintPunchButton";

interface AttendanceSummaryCardProps {
  employeeName: string;
  employeeFullId: string;
  hasPunchedIn: boolean;
  inTime?: string | null;
  outTime?: string | null;
  workingHours?: string | null;
  overtimeHours?: string | null;
  isLoading?: boolean;
  hasError?: boolean;
  onPunch: () => Promise<boolean>;
  onRefresh: () => Promise<void>;
  onViewAttendance: () => void;
}

export function AttendanceSummaryCard({
  employeeName, employeeFullId, hasPunchedIn, inTime, outTime,
  workingHours, overtimeHours, isLoading = false, hasError = false,
  onPunch, onRefresh, onViewAttendance,
}: AttendanceSummaryCardProps) {
  const unavailable = isLoading || hasError;
  const status = isLoading ? "Loading attendance" : hasError ? "Attendance unavailable"
    : outTime ? "Punched out" : hasPunchedIn ? "Punched in" : "Not punched in";
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
  });

  return (
    <CardWrapper
      role="region"
      aria-label="My attendance today"
      aria-busy={isLoading}
      className="overflow-hidden !border-teal-200 !border-t-2 !border-t-teal-700 [&>div:last-child]:!px-4 [&>div:last-child]:!pb-4"
      headerClassName="!p-4 !pb-3"
      title={<span className="text-slate-900">My attendance today</span>}
      description={`${employeeName}${employeeFullId ? ` · ${employeeFullId}` : ""}`}
      headerAction={
        <div className="flex flex-wrap items-center gap-3">
          <Text variant="caption">{today} · UTC</Text>
          <Badge role="status" variant={hasError ? "warning" : hasPunchedIn && !outTime && !isLoading ? "success" : "secondary"}>
            <span aria-hidden="true" className="mr-1.5 size-1.5 rounded-full bg-current" />
            {status}
          </Badge>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3" aria-live="polite">
        {[
          { label: "Punch in", value: inTime, icon: LogIn, tone: "bg-teal-50 text-teal-700" },
          { label: "Punch out", value: outTime, icon: LogOut, tone: "bg-indigo-50 text-indigo-600" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center gap-2">
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon aria-hidden="true" className="size-3.5" /></span>
              <Text className="!text-xs !font-medium !text-slate-600">{label}</Text>
            </div>
            <Text className="mt-2 !text-xl !font-semibold !leading-none !tracking-tight !text-slate-900 tabular-nums sm:!text-2xl">
              {unavailable ? "—" : value || "—"}
            </Text>
          </div>
        ))}
        <div className="col-span-2 flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 lg:col-span-1 lg:block lg:p-3">
          <div className="flex items-center gap-2"><Clock3 aria-hidden="true" className="size-4 text-slate-400" /><Text className="!text-xs !font-medium !text-slate-600">Recorded hours</Text></div>
          <div className="text-right lg:text-left">
            <Title level={3} className="!text-base !text-slate-900 lg:mt-2 lg:!text-xl">{unavailable ? "—" : workingHours || "—"}</Title>
            <Text variant="caption">{unavailable ? "Awaiting attendance" : overtimeHours ? `Overtime: ${overtimeHours}` : outTime ? "First in to latest out" : "After punch out"}</Text>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {hasError ? (
          <div role="alert" className="flex flex-wrap items-center gap-2">
            <Text className="!text-amber-800">Your attendance could not load.</Text>
            <Button variant="outline" size="sm" onClick={() => void onRefresh()} leftIcon={<RefreshCw className="size-3.5" />}>Try again</Button>
          </div>
        ) : (
          <Text variant="caption">{isLoading ? "Loading your punch record…" : outTime ? "Latest punch out saved" : hasPunchedIn ? "Arrival recorded" : "Record your arrival to start"}</Text>
        )}
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <Button variant="ghost" size="sm" onClick={onViewAttendance} rightIcon={<ArrowRight className="size-3.5" />}>View my attendance</Button>
          <FingerprintPunchButton
            label={outTime ? "Update punch out" : hasPunchedIn ? "Punch out" : "Punch in"}
            onPunch={onPunch}
            disabled={unavailable}
          />
        </div>
      </div>
    </CardWrapper>
  );
}
