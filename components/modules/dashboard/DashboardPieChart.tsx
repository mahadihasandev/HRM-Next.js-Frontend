"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Users, CalendarCheck, Sparkles } from "lucide-react";

export interface AttendanceSummaryProp {
  total: number;
  present: number;
  late: number;
  leave: number;
  absent: number;
  attendance_rate?: string;
}

export interface PieDataPoint {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  percentage: number;
  color: string;
  accentColor: string;
  description: string;
}

interface SvgSlice {
  data: PieDataPoint;
  pathD: string;
  centerAngle: number;
  startAngle: number;
  endAngle: number;
}

const DEFAULT_DEPARTMENTS: PieDataPoint[] = [
  {
    id: "field-force",
    label: "Field Force Management",
    shortLabel: "Field Force",
    value: 20,
    percentage: 29.4,
    color: "#0284c7", // sky-600
    accentColor: "#38bdf8",
    description: "Territory officers, SRs & area supervisors",
  },
  {
    id: "sales-dist",
    label: "Sales & Distribution",
    shortLabel: "Sales & Dist",
    value: 18,
    percentage: 26.5,
    color: "#172554", // blue-950
    accentColor: "#1e3a8a",
    description: "Dealer network, depots & corporate sales",
  },
  {
    id: "engineering",
    label: "Engineering & IT",
    shortLabel: "Eng & IT",
    value: 12,
    percentage: 17.6,
    color: "#7c3aed", // violet-600
    accentColor: "#a78bfa",
    description: "Software, infrastructure & biometric devices",
  },
  {
    id: "accounts",
    label: "Finance & Accounts",
    shortLabel: "Finance",
    value: 8,
    percentage: 11.8,
    color: "#d97706", // amber-600
    accentColor: "#fbbf24",
    description: "Payroll, BLA audits, billing & disbursements",
  },
  {
    id: "hr-admin",
    label: "HR & Corporate Admin",
    shortLabel: "HR & Admin",
    value: 6,
    percentage: 8.8,
    color: "#db2777", // pink-600
    accentColor: "#f472b6",
    description: "People operations, talent, policy & compliance",
  },
  {
    id: "logistics",
    label: "Supply Chain & Logistics",
    shortLabel: "Logistics",
    value: 4,
    percentage: 5.9,
    color: "#475569", // slate-600
    accentColor: "#94a3b8",
    description: "Central warehouse, dispatch & fleet routing",
  },
];

type ViewMode = "attendance" | "department";

interface DashboardPieChartProps {
  attendanceSummary?: AttendanceSummaryProp;
  onOpenAllAttendance?: () => void;
}

export function DashboardPieChart({ attendanceSummary, onOpenAllAttendance }: DashboardPieChartProps) {
  const [mode, setMode] = useState<ViewMode>("attendance");
  const [hoveredSliceId, setHoveredSliceId] = useState<string | null>(null);

  // Derive dynamic attendance data from backend props
  const attendanceDataset: PieDataPoint[] = useMemo(() => {
    const total = attendanceSummary?.total ?? 68;
    const present = attendanceSummary?.present ?? 60;
    const late = attendanceSummary?.late ?? 3;
    const leave = attendanceSummary?.leave ?? 3;
    const absent = attendanceSummary?.absent ?? 2;

    const calcPct = (v: number) => (total > 0 ? Number(((v / total) * 100).toFixed(1)) : 0);

    return [
      {
        id: "present",
        label: "Present on Duty",
        shortLabel: "Present (P)",
        value: present,
        percentage: calcPct(present),
        color: "#172554", // blue-950
        accentColor: "#1e3a8a",
        description: "Biometric & GPS clock-ins verified across shifts",
      },
      {
        id: "late",
        label: "Late Arrival / IOM",
        shortLabel: "Late (L)",
        value: late,
        percentage: calcPct(late),
        color: "#d97706", // amber-600
        accentColor: "#f59e0b",
        description: "Grace period exceeded (IOM explanation submitted)",
      },
      {
        id: "leave",
        label: "Approved Leave",
        shortLabel: "On Leave (LV)",
        value: leave,
        percentage: calcPct(leave),
        color: "#0284c7", // sky-600
        accentColor: "#38bdf8",
        description: "Casual, Sick, or Earned leave authorized under BLA 2006",
      },
      {
        id: "absent",
        label: "Unapproved Absent",
        shortLabel: "Absent (A)",
        value: absent,
        percentage: calcPct(absent),
        color: "#e11d48", // rose-600
        accentColor: "#f43f5e",
        description: "No clock-in or prior leave notice recorded",
      },
    ];
  }, [attendanceSummary]);

  const activeDataset = mode === "attendance" ? attendanceDataset : DEFAULT_DEPARTMENTS;
  const totalValue = useMemo(() => activeDataset.reduce((sum, item) => sum + item.value, 0), [activeDataset]);

  // Compute SVG Donut Slices
  const slices: SvgSlice[] = useMemo(() => {
    const cx = 120;
    const cy = 120;
    const outerR = 104;
    const innerR = 74;
    let runningAngle = -Math.PI / 2; // Start from top 12 o'clock
    const result: SvgSlice[] = [];

    for (let i = 0; i < activeDataset.length; i++) {
      const item = activeDataset[i];
      const sliceAngle = totalValue > 0 ? (item.value / totalValue) * 2 * Math.PI : 0;
      const startAngle = runningAngle;
      const endAngle = runningAngle + sliceAngle;
      const centerAngle = startAngle + sliceAngle / 2;
      runningAngle = endAngle;

      const x1 = cx + outerR * Math.cos(startAngle);
      const y1 = cy + outerR * Math.sin(startAngle);
      const x2 = cx + outerR * Math.cos(endAngle);
      const y2 = cy + outerR * Math.sin(endAngle);

      const x3 = cx + innerR * Math.cos(endAngle);
      const y3 = cy + innerR * Math.sin(endAngle);
      const x4 = cx + innerR * Math.cos(startAngle);
      const y4 = cy + innerR * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      const pathD = [
        `M ${x1.toFixed(3)} ${y1.toFixed(3)}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`,
        `L ${x3.toFixed(3)} ${y3.toFixed(3)}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4.toFixed(3)} ${y4.toFixed(3)}`,
        "Z",
      ].join(" ");

      result.push({
        data: item,
        pathD,
        centerAngle,
        startAngle,
        endAngle,
      });
    }

    return result;
  }, [activeDataset, totalValue]);

  const activeItem = useMemo(() => {
    if (hoveredSliceId) {
      return activeDataset.find((d) => d.id === hoveredSliceId) ?? activeDataset[0];
    }
    return null;
  }, [hoveredSliceId, activeDataset]);

  const rateDisplay = attendanceSummary?.attendance_rate ?? "95.4%";

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white shadow-xs">
              <PieChart className="h-4 w-4" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Workforce Distribution & Attendance Ratio
            </h3>
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            {mode === "attendance"
              ? "Live attendance breakdown across biometric devices & field check-ins"
              : "Enterprise staff allocation by functional department"}
          </p>
        </div>

        {/* View Toggle Tabs & All Employees Link */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("attendance");
                setHoveredSliceId(null);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === "attendance"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarCheck className="h-3 w-3 text-blue-950" />
              Attendance
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("department");
                setHoveredSliceId(null);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mode === "department"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="h-3 w-3 text-blue-600" />
              Department
            </button>
          </div>
        </div>
      </div>

      {/* Chart Center Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* SVG Donut Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[220px] h-[220px] sm:w-[230px] sm:h-[230px] drop-shadow-sm select-none">
            <svg
              viewBox="0 0 240 240"
              className="w-full h-full"
            >
              {slices.map((slice) => {
                const isHovered = hoveredSliceId === slice.data.id;
                const isAnyHovered = hoveredSliceId !== null;
                const opacity = isHovered ? 1 : isAnyHovered ? 0.35 : 1;

                return (
                  <path
                    key={slice.data.id}
                    d={slice.pathD}
                    fill={slice.data.color}
                    style={{
                      opacity,
                      transition: "opacity 200ms ease, filter 200ms ease",
                    }}
                    filter={isHovered ? "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25))" : undefined}
                    className="cursor-pointer stroke-white transition-opacity duration-200"
                    strokeWidth={isHovered ? 3 : 2}
                    onMouseEnter={() => setHoveredSliceId(slice.data.id)}
                    onMouseLeave={() => setHoveredSliceId(null)}
                  />
                );
              })}
            </svg>

            {/* Center Info Hole with Clean Spacing & Zero Overlap */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3 select-none">
              <span
                className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider block truncate max-w-[120px] leading-none mb-1.5 transition-colors duration-200"
                style={{ color: activeItem ? activeItem.color : "#475569" }}
              >
                {activeItem ? activeItem.shortLabel : mode === "attendance" ? "Turnout Rate" : "Total Headcount"}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight leading-none my-1 transition-all duration-150">
                {activeItem ? activeItem.value : mode === "attendance" ? rateDisplay : totalValue}
              </p>
              <span
                className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block font-mono leading-none mt-1.5 transition-colors duration-200"
                style={{
                  backgroundColor: activeItem ? `${activeItem.color}15` : "#eff6ff",
                  color: activeItem ? activeItem.color : "#172554",
                  border: `1px solid ${activeItem ? `${activeItem.color}35` : "#bfdbfe"}`,
                }}
              >
                {activeItem ? `${activeItem.percentage}%` : mode === "attendance" ? `${totalValue} Staff` : "100% Roster"}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-600 font-semibold mt-1">
            Hover over a slice or legend item for details
          </p>
        </div>

        {/* Legend & Breakdown List */}
        <div className="md:col-span-7 space-y-2">
          {activeDataset.map((item) => {
            const isHovered = hoveredSliceId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredSliceId(item.id)}
                onMouseLeave={() => setHoveredSliceId(null)}
                className={`p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                  isHovered
                    ? "bg-slate-50 border-slate-400 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-3.5 w-3.5 rounded-md shrink-0 shadow-2xs transition-transform duration-200"
                    style={{
                      backgroundColor: item.color,
                      transform: isHovered ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium truncate">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-mono font-black text-xs text-slate-900">
                      {item.value}
                    </span>
                    <span
                      className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md text-white font-mono"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Summary Callout with All Employees Action Button */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Sparkles className="h-4 w-4 text-blue-950 shrink-0" />
          <span className="font-semibold text-slate-800">
            {mode === "attendance"
              ? `Biometric sync latency: 1.2s • Present: ${attendanceSummary?.present ?? 60} of ${attendanceSummary?.total ?? 68} staff`
              : "Verified Corporate Headcount across 6 core operational business divisions"}
          </span>
        </div>

        {onOpenAllAttendance && (
          <button
            type="button"
            onClick={onOpenAllAttendance}
            className="text-xs font-extrabold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg shrink-0 self-end sm:self-auto hover:bg-blue-100 transition-colors"
          >
            <Users className="h-3.5 w-3.5" />
            View All Staff Today Roster &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
