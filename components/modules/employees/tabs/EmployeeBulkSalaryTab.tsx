"use client";

import React, { useState } from "react";
import { Banknote, TrendingUp, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import toast from "react-hot-toast";

interface BulkPreviewEmp {
  id: number;
  name: string;
  employeeFullId: string;
  department: string;
  designation: string;
  currentGross: number;
  incrementAmount: number;
  newGross: number;
  newBasic: number;
}

const PREVIEW_SAMPLE: BulkPreviewEmp[] = [
  { id: 1, name: "Mahbubur Rahman", employeeFullId: "SMT-0051", department: "Sales & Distribution", designation: "Territory Sales Officer", currentGross: 55000, incrementAmount: 4400, newGross: 59400, newBasic: 29700 },
  { id: 2, name: "Tanvir Hasan", employeeFullId: "SMT-0053", department: "Sales & Distribution", designation: "Area Sales Manager", currentGross: 85000, incrementAmount: 6800, newGross: 91800, newBasic: 45900 },
  { id: 3, name: "Kazi Farhan Ahmed", employeeFullId: "SMT-0001", department: "Sales & Distribution", designation: "General Manager", currentGross: 145000, incrementAmount: 11600, newGross: 156600, newBasic: 78300 },
];

export function EmployeeBulkSalaryTab() {
  const [selectedDept, setSelectedDept] = useState("Sales & Distribution");
  const [incrementPercent, setIncrementPercent] = useState(8);
  const [effectiveMonth, setEffectiveMonth] = useState("2026-10");
  const [isPreviewing, setIsPreviewing] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyBulk = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      toast.success(
        `Bulk increment of ${incrementPercent}% successfully applied to ${selectedDept} effective ${effectiveMonth}!`
      );
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Bulk Salary Increment & Grade Revision Setup
            </h4>
            <p className="text-xs text-slate-500">
              Execute mass annual increments across entire departments with automated BLA 2006 statutory recalculation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Target Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
            >
              <option value="Sales & Distribution">Sales & Distribution</option>
              <option value="Field Force Management">Field Force Management</option>
              <option value="Engineering & IT">Engineering & IT</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
              <option value="Administration & HR">Administration & HR</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Increment Percentage (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={50}
                value={incrementPercent}
                onChange={(e) => setIncrementPercent(Number(e.target.value))}
                className="w-24 bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-center focus:outline-none"
              />
              <span className="text-xs font-bold text-slate-700">% of Gross</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Effective Billing Month
            </label>
            <input
              type="month"
              value={effectiveMonth}
              onChange={(e) => setEffectiveMonth(e.target.value)}
              className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <Button
              size="sm"
              disabled={isApplying}
              onClick={handleApplyBulk}
              leftIcon={<ShieldCheck className="h-4 w-4" />}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              {isApplying ? "Processing..." : "Commit Bulk Increment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-800">
            Previewing Impact for {selectedDept} ({PREVIEW_SAMPLE.length} Staff Sample)
          </p>
          <Badge variant="success">Auto Re-computed (Basic 50% + House Rent 25%)</Badge>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3">Employee</th>
              <th className="py-3 px-3">Designation</th>
              <th className="py-3 px-3 text-right">Current Gross (৳)</th>
              <th className="py-3 px-3 text-center">+{incrementPercent}% Raise</th>
              <th className="py-3 px-3 text-right">New Gross (৳)</th>
              <th className="py-3 px-3 text-right">New Basic (50%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PREVIEW_SAMPLE.map((p) => {
              const inc = Math.round((p.currentGross * incrementPercent) / 100);
              const nGross = p.currentGross + inc;
              const nBasic = Math.round(nGross * 0.5);

              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{p.employeeFullId}</p>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{p.designation}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-700">
                    ৳{p.currentGross.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">
                    +৳{inc.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-blue-700">
                    ৳{nGross.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    ৳{nBasic.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
