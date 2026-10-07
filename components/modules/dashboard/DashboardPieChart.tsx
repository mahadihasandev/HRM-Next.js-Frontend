"use client";

import { CardWrapper, Button, Text, EmptyState } from "@/components/shared";
import { ArrowUpRight, Users } from "lucide-react";

export interface AttendanceSummaryProp {
  total: number;
  present: number;
  late: number;
  leave: number;
  absent: number;
  attendance_rate?: string;
}
interface DashboardPieChartProps {
  attendanceSummary?: AttendanceSummaryProp;
  onOpenAllAttendance?: () => void;
}
export function DashboardPieChart({
  attendanceSummary: summary,
  onOpenAllAttendance,
}: DashboardPieChartProps) {
  const items = [
    { label: "Present", value: summary?.present ?? 0, color: "#0f766e" },
    { label: "Late", value: summary?.late ?? 0, color: "#f5b84a" },
    { label: "On leave", value: summary?.leave ?? 0, color: "#93c5fd" },
    { label: "Absent", value: summary?.absent ?? 0, color: "#e2e8f0" },
  ];
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const circumference = 2 * Math.PI * 72;
  return (
    <CardWrapper
      title="Today's attendance"
      description="Workforce status at a glance"
      className="h-full"
      headerClassName="!flex-row"
      headerAction={
        <Button
          variant="ghost"
          size="icon"
          className="!size-8"
          aria-label="Open attendance register"
          onClick={onOpenAllAttendance}
        >
          <ArrowUpRight className="size-4" />
        </Button>
      }
    >
      {!summary ? (
        <EmptyState
          title="Attendance unavailable"
          description="Your attendance summary will appear here."
          icon={<Users className="size-6" />}
        />
      ) : (
        <>
          <div className="relative mx-auto my-2 size-[200px]">
            <svg
              viewBox="0 0 200 200"
              className="size-full"
              role="img"
              aria-label={items
                .map((item) => `${item.label}: ${item.value}`)
                .join(", ")}
            >
              <circle
                cx="100"
                cy="100"
                r="72"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="20"
              />
              {items.map((item, index) => {
                const length = total ? (item.value / total) * circumference : 0;
                const before = items
                  .slice(0, index)
                  .reduce((sum, previous) => sum + previous.value, 0);
                return (
                  <circle
                    key={item.label}
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={`${Math.max(0, length - (length > 0 && length < circumference ? 3 : 0))} ${circumference}`}
                    strokeDashoffset={
                      total ? (-before / total) * circumference : 0
                    }
                    transform="rotate(-90 100 100)"
                  >
                    <title>
                      {item.label}: {item.value}
                    </title>
                  </circle>
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <Text className="!text-[32px] !font-semibold !tracking-tight !text-slate-900">
                {summary.attendance_rate || "—"}
              </Text>
              <Text variant="caption" className="!text-[11px]">
                Attendance rate
              </Text>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-100 pt-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-slate-500">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.label}
                </span>
                <span className="font-medium tabular-nums text-slate-800">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </CardWrapper>
  );
}
