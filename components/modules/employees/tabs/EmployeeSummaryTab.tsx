"use client";

import React from "react";
import { Users, UserCheck, Clock, Briefcase, PieChart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/shared";

interface DeptSummary {
  department: string;
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  avgBasic: number;
  totalMonthlyPayroll: number;
  percentOfWorkforce: number;
}

const DEPT_SUMMARIES: DeptSummary[] = [
  { department: "Sales & Distribution", totalCount: 38, maleCount: 32, femaleCount: 6, avgBasic: 42000, totalMonthlyPayroll: 2850000, percentOfWorkforce: 27.1 },
  { department: "Field Force Management", totalCount: 42, maleCount: 40, femaleCount: 2, avgBasic: 28000, totalMonthlyPayroll: 1980000, percentOfWorkforce: 30.0 },
  { department: "Engineering & IT", totalCount: 22, maleCount: 17, femaleCount: 5, avgBasic: 65000, totalMonthlyPayroll: 2420000, percentOfWorkforce: 15.7 },
  { department: "Finance & Accounts", totalCount: 16, maleCount: 12, femaleCount: 4, avgBasic: 48000, totalMonthlyPayroll: 1300000, percentOfWorkforce: 11.4 },
  { department: "Administration & HR", totalCount: 14, maleCount: 8, femaleCount: 6, avgBasic: 45000, totalMonthlyPayroll: 1050000, percentOfWorkforce: 10.0 },
  { department: "Supply Chain & Logistics", totalCount: 8, maleCount: 7, femaleCount: 1, avgBasic: 32000, totalMonthlyPayroll: 420000, percentOfWorkforce: 5.8 },
];

export function EmployeeSummaryTab() {
  const totalEmployees = DEPT_SUMMARIES.reduce((sum, d) => sum + d.totalCount, 0);
  const totalPayroll = DEPT_SUMMARIES.reduce((sum, d) => sum + d.totalMonthlyPayroll, 0);

  return (
    <div className="space-y-6">
      {/* Top Headcount Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Total Enterprise Workforce</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalEmployees}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
            100% Verified Profiles
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Confirmed Permanent</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">122</p>
          <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">
            87.1% Retention
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Probationary Staff</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">14</p>
          <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">
            Under 6-Month Review
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Monthly Gross Payroll</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-slate-900 font-mono">
            ৳{(totalPayroll / 100000).toFixed(1)} Lakh
          </p>
          <span className="text-[10px] text-purple-600 font-bold mt-1 inline-block">
            Total Salary Exposure
          </span>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Workforce Distribution & Cost by Department
          </h4>
        </div>
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3 text-center">Headcount</th>
              <th className="py-3 px-3 text-center">Male</th>
              <th className="py-3 px-3 text-center">Female</th>
              <th className="py-3 px-3 text-right">Avg Basic (৳)</th>
              <th className="py-3 px-3 text-right">Monthly Payroll (৳)</th>
              <th className="py-3 px-3 text-center">% Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEPT_SUMMARIES.map((d) => (
              <tr key={d.department} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">{d.department}</td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">
                  {d.totalCount}
                </td>
                <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                  {d.maleCount}
                </td>
                <td className="py-2.5 px-3 text-center font-semibold text-purple-700">
                  {d.femaleCount}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                  ৳{d.avgBasic.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                  ৳{d.totalMonthlyPayroll.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-slate-100 text-slate-800">
                    {d.percentOfWorkforce}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
