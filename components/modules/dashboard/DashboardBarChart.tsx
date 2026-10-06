"use client";

import React, { useState, useMemo } from "react";
import { BarChart3, TrendingUp, Clock, Calendar, CheckCircle2 } from "lucide-react";

export interface WeeklyAttendanceItem {
  day: string;
  present: number;
  late: number;
  leave?: number;
  absent?: number;
  rate?: string;
  otHours?: string;
}

interface MonthlyTrendItem {
  month: string;
  shortMonth: string;
  presentAvg: number;
  lateAvg: number;
  rate: string;
  otTotal: string;
}

const DEFAULT_WEEKLY_ATTENDANCE: WeeklyAttendanceItem[] = [
  { day: "Sun", present: 64, late: 2, leave: 1, absent: 1, rate: "94.1%", otHours: "38h" },
  { day: "Mon", present: 66, late: 1, leave: 1, absent: 0, rate: "97.1%", otHours: "42h" },
  { day: "Tue", present: 63, late: 3, leave: 1, absent: 1, rate: "92.6%", otHours: "35h" },
  { day: "Wed", present: 65, late: 2, leave: 0, absent: 1, rate: "95.6%", otHours: "40h" },
  { day: "Thu", present: 62, late: 3, leave: 1, absent: 2, rate: "91.2%", otHours: "32h" },
];

const MONTHLY_TRENDS: MonthlyTrendItem[] = [
  { month: "May 2026", shortMonth: "May", presentAvg: 61, lateAvg: 4, rate: "92.4%", otTotal: "192h" },
  { month: "Jun 2026", shortMonth: "Jun", presentAvg: 63, lateAvg: 3, rate: "94.0%", otTotal: "215h" },
  { month: "Jul 2026", shortMonth: "Jul", presentAvg: 64, lateAvg: 2, rate: "95.5%", otTotal: "208h" },
  { month: "Aug 2026", shortMonth: "Aug", presentAvg: 65, lateAvg: 2, rate: "97.0%", otTotal: "230h" },
  { month: "Sep 2026", shortMonth: "Sep", presentAvg: 64, lateAvg: 3, rate: "95.6%", otTotal: "220h" },
  { month: "Oct 2026", shortMonth: "Oct", presentAvg: 66, lateAvg: 1, rate: "97.8%", otTotal: "245h" },
];

interface DashboardBarChartProps {
  weeklyData?: WeeklyAttendanceItem[];
  totalEmployees?: number;
  onOpenAllAttendance?: () => void;
}

export function DashboardBarChart({
  weeklyData,
  totalEmployees = 68,
  onOpenAllAttendance,
}: DashboardBarChartProps) {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeWeekly = useMemo(() => {
    if (weeklyData && weeklyData.length > 0) {
      return weeklyData.map((d, i) => {
        const fallback = DEFAULT_WEEKLY_ATTENDANCE[i] || DEFAULT_WEEKLY_ATTENDANCE[0];
        const calcRate = d.rate || (totalEmployees > 0 ? `${((d.present / totalEmployees) * 100).toFixed(1)}%` : "95.0%");
        return {
          day: d.day,
          present: d.present,
          late: d.late,
          leave: d.leave ?? fallback.leave ?? 1,
          absent: d.absent ?? fallback.absent ?? 1,
          rate: calcRate,
          otHours: d.otHours || fallback.otHours || "35h",
        };
      });
    }
    return DEFAULT_WEEKLY_ATTENDANCE;
  }, [weeklyData, totalEmployees]);

  // Max value for scaling
  const maxCapacity = totalEmployees > 0 ? totalEmployees : 70;

  // Average weekly turn-out rate
  const averageRate = useMemo(() => {
    const sum = activeWeekly.reduce((acc, curr) => {
      const parsed = parseFloat(curr.rate || "95");
      return acc + (isNaN(parsed) ? 95 : parsed);
    }, 0);
    return (sum / activeWeekly.length).toFixed(1);
  }, [activeWeekly]);

  const activeHoveredItem = useMemo(() => {
    if (hoveredIdx === null) return null;
    if (viewMode === "weekly") {
      return activeWeekly[hoveredIdx] || null;
    }
    return MONTHLY_TRENDS[hoveredIdx] || null;
  }, [hoveredIdx, viewMode, activeWeekly]);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white shadow-xs">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Attendance Headcount & Turnout Trends
            </h3>
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            {viewMode === "weekly"
              ? "Daily enterprise staff check-ins across corporate operating shifts (Sun - Thu)"
              : "6-Month historical attendance rate & overtime volume progression"}
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setViewMode("weekly");
                setHoveredIdx(null);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "weekly"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-3 w-3 text-emerald-600" />
              Weekly Roster
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("monthly");
                setHoveredIdx(null);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "monthly"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-3 w-3 text-purple-600" />
              6-Month Trend
            </button>
          </div>
        </div>
      </div>

      {/* Chart Legend & Floating Tooltip Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs min-h-[32px]">
        {/* Color tokens legend */}
        <div className="flex items-center gap-3 font-semibold text-slate-700 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-slate-900 shrink-0" />
            <span className="text-[11px] text-slate-800 font-bold">Present Staff</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-amber-500 shrink-0" />
            <span className="text-[11px] text-slate-800 font-bold">Late (IOM)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 border-t-2 border-dashed border-emerald-500 shrink-0" />
            <span className="text-[11px] text-emerald-700 font-bold">Target (68)</span>
          </div>
        </div>

        {/* Dynamic Tooltip Pill - Fixed container height and no wrapping */}
        <div className="h-7 min-h-[28px] flex items-center self-start sm:self-auto overflow-hidden">
          {activeHoveredItem && viewMode === "weekly" && "day" in activeHoveredItem ? (
            <div className="bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-emerald-300 font-black">{activeHoveredItem.day}:</span>
              <span>{activeHoveredItem.present} Present ({activeHoveredItem.rate})</span>
              <span className="text-amber-300">&bull; {activeHoveredItem.late} Late</span>
              <span className="text-blue-300">&bull; OT: {activeHoveredItem.otHours}</span>
            </div>
          ) : activeHoveredItem && viewMode === "monthly" && "month" in activeHoveredItem ? (
            <div className="bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-purple-300 font-black">{activeHoveredItem.month}:</span>
              <span>Avg {activeHoveredItem.presentAvg} Staff ({activeHoveredItem.rate})</span>
              <span className="text-blue-300">&bull; Total OT: {activeHoveredItem.otTotal}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
              Hover columns for shift stats
            </span>
          )}
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        {/* Subtle Horizontal Grid Lines & Scale */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[10px] font-mono text-slate-400">
          <div className="border-b border-dashed border-slate-200 flex items-center justify-between pb-0.5">
            <span className="bg-white/80 px-1 font-semibold text-slate-500">100% (68)</span>
          </div>
          <div className="border-b border-dashed border-slate-200 flex items-center justify-between pb-0.5">
            <span className="bg-white/80 px-1 font-semibold text-slate-500">75% (51)</span>
          </div>
          <div className="border-b border-dashed border-slate-200 flex items-center justify-between pb-0.5">
            <span className="bg-white/80 px-1 font-semibold text-slate-500">50% (34)</span>
          </div>
          <div className="border-b border-dashed border-slate-200 flex items-center justify-between pb-0.5">
            <span className="bg-white/80 px-1 font-semibold text-slate-500">25% (17)</span>
          </div>
          <div className="border-b border-slate-300 flex items-center justify-between pb-0.5" />
        </div>

        {/* Weekly Mode Columns */}
        {viewMode === "weekly" && (
          <div className="grid grid-cols-5 gap-3 sm:gap-6 relative h-[180px] items-end px-2">
            {activeWeekly.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              const presentHeightPct = Math.min(100, Math.round((item.present / maxCapacity) * 100));
              const lateHeightPct = Math.min(30, Math.round((item.late / maxCapacity) * 100 * 2.5));

              return (
                <div
                  key={item.day}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="h-full flex flex-col items-center justify-end group cursor-pointer relative select-none"
                >
                  {/* Top Rate Badge */}
                  <span
                    className={`pointer-events-none text-[10px] font-extrabold px-1.5 py-0.5 rounded mb-1 transition-colors font-mono ${
                      isHovered
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {item.rate}
                  </span>

                  {/* Bar Capsule Track */}
                  <div
                    className={`pointer-events-none w-full max-w-[42px] h-[135px] rounded-t-xl bg-slate-100/90 border border-slate-200/80 flex items-end justify-center p-1 relative overflow-hidden transition-colors ${
                      isHovered ? "bg-slate-200/90 border-slate-400 shadow-sm" : ""
                    }`}
                  >
                    {/* Secondary Late Bar Indicator at bottom */}
                    {item.late > 0 && (
                      <div
                        className="w-full bg-amber-500/90 absolute bottom-0 rounded-t-sm transition-all duration-300"
                        style={{ height: `${lateHeightPct}%` }}
                        title={`${item.late} Late Arrivals`}
                      />
                    )}

                    {/* Main Present Bar */}
                    <div
                      className={`w-full rounded-t-lg transition-colors duration-150 flex flex-col justify-between items-center py-1 relative z-10 ${
                        isHovered
                          ? "bg-slate-800 shadow-md"
                          : "bg-slate-900 hover:bg-slate-800"
                      }`}
                      style={{ height: `${presentHeightPct}%` }}
                    >
                      <span className="text-[10px] font-mono font-black text-white leading-none">
                        {item.present}
                      </span>
                    </div>
                  </div>

                  {/* X-Axis Label */}
                  <div className="pointer-events-none mt-2 text-center">
                    <p
                      className={`text-xs font-black transition-colors ${
                        isHovered ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {item.day}
                    </p>
                    <p className="text-[9px] text-slate-500 font-semibold font-mono">
                      {item.late} late
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Monthly Mode Columns */}
        {viewMode === "monthly" && (
          <div className="grid grid-cols-6 gap-2 sm:gap-4 relative h-[180px] items-end px-2">
            {MONTHLY_TRENDS.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              const presentHeightPct = Math.min(100, Math.round((item.presentAvg / maxCapacity) * 100));

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="h-full flex flex-col items-center justify-end group cursor-pointer relative select-none"
                >
                  {/* Top Rate Badge */}
                  <span
                    className={`pointer-events-none text-[9px] font-extrabold px-1.5 py-0.5 rounded mb-1 transition-colors font-mono ${
                      isHovered
                        ? "bg-purple-900 text-white shadow-xs"
                        : "bg-purple-50 text-purple-900 border border-purple-200"
                    }`}
                  >
                    {item.rate}
                  </span>

                  {/* Bar Capsule Track */}
                  <div
                    className={`pointer-events-none w-full max-w-[38px] h-[135px] rounded-t-xl bg-slate-100/90 border border-slate-200/80 flex items-end justify-center p-1 relative overflow-hidden transition-colors ${
                      isHovered ? "bg-purple-50 border-purple-400 shadow-sm" : ""
                    }`}
                  >
                    {/* Main Bar */}
                    <div
                      className={`w-full rounded-t-lg transition-colors duration-150 flex flex-col justify-between items-center py-1 relative z-10 ${
                        isHovered
                          ? "bg-purple-700 shadow-md"
                          : "bg-slate-900 hover:bg-slate-800"
                      }`}
                      style={{ height: `${presentHeightPct}%` }}
                    >
                      <span className="text-[9px] font-mono font-black text-white leading-none">
                        {item.presentAvg}
                      </span>
                    </div>
                  </div>

                  {/* X-Axis Label */}
                  <div className="pointer-events-none mt-2 text-center">
                    <p
                      className={`text-xs font-black transition-colors ${
                        isHovered ? "text-purple-900" : "text-slate-700"
                      }`}
                    >
                      {item.shortMonth}
                    </p>
                    <p className="text-[9px] text-slate-500 font-semibold font-mono">
                      {item.otTotal}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom KPI Highlights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                Average Turnout
              </p>
              <p className="text-sm font-black text-slate-900 font-mono">
                {averageRate}% Turnout
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
            +1.4%
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                Punctuality Index
              </p>
              <p className="text-sm font-black text-slate-900 font-mono">
                96.8% On-Time
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
            2.2% Late
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                Weekly Overtime (OT)
              </p>
              <p className="text-sm font-black text-slate-900 font-mono">
                187 Hours Logged
              </p>
            </div>
          </div>
          {onOpenAllAttendance && (
            <button
              type="button"
              onClick={onOpenAllAttendance}
              className="text-[10px] font-bold text-blue-700 hover:text-blue-800 underline cursor-pointer"
            >
              Roster &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
