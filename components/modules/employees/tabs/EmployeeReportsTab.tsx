"use client";

import React, { useState } from "react";
import { UserPlus, UserMinus, Calendar, FileSpreadsheet } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import toast from "react-hot-toast";

interface JoinerRecord {
  id: number;
  name: string;
  employeeFullId: string;
  department: string;
  designation: string;
  joiningDate: string;
  grossSalary: number;
  recruitmentSource: string;
}

interface SeparationRecord {
  id: number;
  name: string;
  employeeFullId: string;
  department: string;
  designation: string;
  separationType: "Resignation" | "Contract Expiry" | "Mutual Separation" | "Retirement";
  lastWorkingDay: string;
  settlementStatus: "Cleared & Paid" | "Clearance in Progress" | "Pending Handover";
}

const JOINERS: JoinerRecord[] = [
  { id: 1, name: "Mahmudur Rahman", employeeFullId: "SMT-0081", department: "Sales & Distribution", designation: "Territory Sales Officer", joiningDate: "2026-10-01", grossSalary: 65000, recruitmentSource: "Headhunting" },
  { id: 2, name: "Nafisa Tabassum", employeeFullId: "SMT-0082", department: "Engineering & IT", designation: "Software Engineer", joiningDate: "2026-10-02", grossSalary: 72000, recruitmentSource: "Direct Referral" },
  { id: 3, name: "Md. Al-Amin", employeeFullId: "SMT-0083", department: "Field Force Management", designation: "Sales Representative", joiningDate: "2026-09-15", grossSalary: 32000, recruitmentSource: "Job Portal (Bdjobs)" },
  { id: 4, name: "Tanvir Ahmed", employeeFullId: "SMT-0084", department: "Finance & Accounts", designation: "Junior Accounts Officer", joiningDate: "2026-09-01", grossSalary: 38000, recruitmentSource: "Campus Recruitment" },
];

const SEPARATIONS: SeparationRecord[] = [
  { id: 1, name: "Imran Hossain", employeeFullId: "SMT-0034", department: "Sales & Distribution", designation: "Area Sales Manager", separationType: "Resignation", lastWorkingDay: "2026-09-30", settlementStatus: "Cleared & Paid" },
  { id: 2, name: "Sultana Razia", employeeFullId: "SMT-0041", department: "Administration & HR", designation: "HR Executive", separationType: "Resignation", lastWorkingDay: "2026-09-15", settlementStatus: "Cleared & Paid" },
  { id: 3, name: "Belal Uddin", employeeFullId: "SMT-0029", department: "Supply Chain & Logistics", designation: "Depot Supervisor", separationType: "Mutual Separation", lastWorkingDay: "2026-10-04", settlementStatus: "Clearance in Progress" },
];

export function EmployeeReportsTab() {
  const [reportType, setReportType] = useState<"recruitment" | "termination">("recruitment");

  return (
    <div className="space-y-4">
      {/* Sub-selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportType("recruitment")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === "recruitment"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Monthly Recruitment Joiners ({JOINERS.length})
          </button>
          <button
            onClick={() => setReportType("termination")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              reportType === "termination"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
            }`}
          >
            <UserMinus className="h-4 w-4" />
            Monthly Terminations / Separations ({SEPARATIONS.length})
          </button>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.success("Exporting report to Excel...")}
          leftIcon={<FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />}
          className="text-xs font-bold border-slate-300"
        >
          Export Report
        </Button>
      </div>

      {reportType === "recruitment" ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">SL</th>
                <th className="py-3 px-3">New Joiner</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Designation</th>
                <th className="py-3 px-3">Joining Date</th>
                <th className="py-3 px-3 text-right">Gross Salary (৳)</th>
                <th className="py-3 px-3">Recruitment Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {JOINERS.map((j, idx) => (
                <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-900">{j.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{j.employeeFullId}</p>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-blue-700">{j.department}</td>
                  <td className="py-2.5 px-3 text-slate-800">{j.designation}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{j.joiningDate}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    ৳{j.grossSalary.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{j.recruitmentSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">SL</th>
                <th className="py-3 px-3">Separated Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Designation</th>
                <th className="py-3 px-3">Separation Reason</th>
                <th className="py-3 px-3">Last Working Day</th>
                <th className="py-3 px-3 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SEPARATIONS.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{s.employeeFullId}</p>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-blue-700">{s.department}</td>
                  <td className="py-2.5 px-3 text-slate-800">{s.designation}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{s.separationType}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{s.lastWorkingDay}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant={
                        s.settlementStatus === "Cleared & Paid" ? "success" : "warning"
                      }
                    >
                      {s.settlementStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
