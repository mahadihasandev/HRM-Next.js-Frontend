"use client";

import { CardWrapper, Text, EmptyState } from "@/components/shared";
import { BarChart3 } from "lucide-react";

interface DashboardBarChartProps {
  weeklyData?: Array<{
    day: string;
    present: number;
    late: number;
    leave: number;
  }>;
  totalEmployees?: number;
  onOpenAllAttendance?: () => void;
}
export function DashboardBarChart({
  weeklyData = [],
  totalEmployees = 0,
}: DashboardBarChartProps) {
  const max = Math.max(
    totalEmployees,
    ...weeklyData.map((item) => item.present + item.late),
    1,
  );
  return (
    <CardWrapper
      title="Attendance overview"
      description="Present and late arrivals across the week"
      className="h-full"
      headerClassName="!flex-row"
      headerAction={
        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500">
          Weekly
        </span>
      }
    >
      {!weeklyData.length ? (
        <EmptyState
          title="No attendance history"
          description="Weekly attendance will appear when available."
          icon={<BarChart3 className="size-6" />}
        />
      ) : (
        <>
          <div className="mb-5 flex items-center gap-5 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-teal-700" />
              Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-400" />
              Late
            </span>
          </div>
          <div className="relative h-[216px] pl-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between text-[10px] text-slate-400"
            >
              {[1, 0.75, 0.5, 0.25, 0].map((fraction) => (
                <div key={fraction} className="flex items-center gap-2">
                  <span className="w-6 text-right tabular-nums">
                    {Math.round(max * fraction)}
                  </span>
                  <span className="flex-1 border-t border-dashed border-slate-100" />
                </div>
              ))}
            </div>
            <div
              className="relative flex h-full justify-around gap-2"
              role="img"
              aria-label={weeklyData
                .map(
                  (item) =>
                    `${item.day}: ${item.present} present, ${item.late} late`,
                )
                .join(". ")}
            >
              {weeklyData.map((item, index) => (
                <div
                  key={`${item.day}-${index}`}
                  className="flex h-full min-w-0 flex-1 flex-col items-center"
                >
                  <div className="flex h-[calc(100%-28px)] w-full max-w-16 items-end justify-center gap-1.5 pb-px">
                    <div
                      className="group relative w-5 rounded-t-md bg-teal-700 transition-colors hover:bg-teal-600 sm:w-7"
                      style={{
                        height: `${(item.present / max) * 100}%`,
                        minHeight: item.present ? 3 : 0,
                      }}
                      title={`${item.day}: ${item.present} present`}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-teal-800">
                        {item.present}
                      </span>
                    </div>
                    <div
                      className="w-2.5 rounded-t-sm bg-amber-400 sm:w-3.5"
                      style={{
                        height: `${(item.late / max) * 100}%`,
                        minHeight: item.late ? 3 : 0,
                      }}
                      title={`${item.day}: ${item.late} late`}
                    />
                  </div>
                  <Text
                    variant="caption"
                    className="flex h-7 items-end !text-[11px]"
                  >
                    {item.day}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          <Text
            variant="caption"
            className="mt-4 border-t border-slate-100 pt-3 !text-[11px]"
          >
            Use the daily register to review individual attendance records.
          </Text>
        </>
      )}
    </CardWrapper>
  );
}
