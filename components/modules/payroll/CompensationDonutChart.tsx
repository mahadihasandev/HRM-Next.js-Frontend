"use client";

import React, { useState, useMemo } from "react";
import { Info } from "lucide-react";

export interface SalaryBreakdownProp {
  basic: number;
  house_rent: number;
  medical_allowance: number;
  conveyance: number;
  gross: number;
  pf_deduction?: number;
  tax_deduction?: number;
  net_payable?: number;
}

interface SliceItem {
  id: string;
  label: string;
  shortLabel: string;
  sublabel: string;
  value: number;
  percentage: number;
  color: string;
}

interface SvgSlice {
  data: SliceItem;
  pathD: string;
  centerAngle: number;
}

interface CompensationDonutChartProps {
  salary?: SalaryBreakdownProp;
}

export function CompensationDonutChart({ salary }: CompensationDonutChartProps) {
  const [hoveredSliceId, setHoveredSliceId] = useState<string | null>(null);

  const basic = salary?.basic ?? 55000;
  const houseRent = salary?.house_rent ?? 27500;
  const medical = salary?.medical_allowance ?? 5500;
  const conveyance = salary?.conveyance ?? 4000;
  const gross = salary?.gross ?? (basic + houseRent + medical + conveyance);
  const pf = salary?.pf_deduction ?? 5500;
  const tax = salary?.tax_deduction ?? 4200;
  const totalDeductions = pf + tax;
  const netPayable = salary?.net_payable ?? (gross - totalDeductions);

  const dataset: SliceItem[] = useMemo(() => {
    const calcPct = (v: number) => (gross > 0 ? Number(((v / gross) * 100).toFixed(1)) : 0);

    return [
      {
        id: "basic",
        label: "Basic Pay",
        shortLabel: "Basic",
        sublabel: "Core salary standard (BLA 2006)",
        value: basic,
        percentage: calcPct(basic),
        color: "#172554", // blue-950
      },
      {
        id: "house_rent",
        label: "House Rent Allowance (HRA)",
        shortLabel: "House Rent",
        sublabel: "50% of Basic Pay",
        value: houseRent,
        percentage: calcPct(houseRent),
        color: "#2563eb", // blue-600
      },
      {
        id: "medical",
        label: "Medical Allowance",
        shortLabel: "Medical",
        sublabel: "10% of Basic Pay statutory",
        value: medical,
        percentage: calcPct(medical),
        color: "#7c3aed", // violet-600
      },
      {
        id: "conveyance",
        label: "Conveyance Allowance",
        shortLabel: "Conveyance",
        sublabel: "Fixed travel commute support",
        value: conveyance,
        percentage: calcPct(conveyance),
        color: "#d97706", // amber-600
      },
    ];
  }, [basic, houseRent, medical, conveyance, gross]);

  const totalValue = gross > 0 ? gross : 92000;

  // Compute SVG Donut Slices
  const slices: SvgSlice[] = useMemo(() => {
    const cx = 120;
    const cy = 120;
    const outerR = 104;
    const innerR = 74;
    let runningAngle = -Math.PI / 2; // 12 o'clock start
    const result: SvgSlice[] = [];

    for (let i = 0; i < dataset.length; i++) {
      const item = dataset[i];
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
      });
    }

    return result;
  }, [dataset, totalValue]);

  const activeSlice = useMemo(() => {
    if (hoveredSliceId) {
      return dataset.find((d) => d.id === hoveredSliceId) ?? null;
    }
    return null;
  }, [hoveredSliceId, dataset]);

  return (
    <div className="space-y-4 pt-1">
      {/* Donut and Legend Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: SVG Donut Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-[210px] h-[210px] sm:w-[220px] sm:h-[220px] select-none">
            <svg viewBox="0 0 240 240" className="w-full h-full">
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

            {/* Center Info Hole with Spacious Typography */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-3 select-none">
              <span
                className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider block truncate max-w-[120px] leading-none mb-1.5 transition-colors duration-200"
                style={{ color: activeSlice ? activeSlice.color : "#475569" }}
              >
                {activeSlice ? activeSlice.shortLabel : "Monthly Gross"}
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight leading-none my-1 transition-all duration-150">
                ৳{(activeSlice ? activeSlice.value : gross).toLocaleString()}
              </p>
              <span
                className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block font-mono leading-none mt-1.5 transition-colors duration-200"
                style={{
                  backgroundColor: activeSlice ? `${activeSlice.color}15` : "#eff6ff",
                  color: activeSlice ? activeSlice.color : "#172554",
                  border: `1px solid ${activeSlice ? `${activeSlice.color}35` : "#bfdbfe"}`,
                }}
              >
                {activeSlice ? `${activeSlice.percentage}% Gross` : "100% Package"}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-semibold mt-1.5 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Hover slice or card for component share
          </p>
        </div>

        {/* Right: Detailed Component Breakdown Cards */}
        <div className="md:col-span-7 space-y-2">
          {dataset.map((item) => {
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
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      {item.sublabel}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-mono font-black text-xs text-slate-900">
                      ৳{item.value.toLocaleString()}
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

      {/* Statutory Deductions & Net Take-Home Row */}
      <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 block">
              Statutory Deductions (BLA 2006)
            </span>
            <p className="text-xs text-rose-700 font-medium mt-0.5">
              PF (৳{pf.toLocaleString()}) + Tax TDS (৳{tax.toLocaleString()})
            </p>
          </div>
          <span className="font-mono font-black text-rose-900 text-sm">
            -৳{totalDeductions.toLocaleString()}
          </span>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
              Net Take-Home Remittance
            </span>
            <p className="text-xs text-emerald-700 font-medium mt-0.5">
              Disbursed to verified bank account
            </p>
          </div>
          <span className="font-mono font-black text-emerald-900 text-sm">
            ৳{netPayable.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
