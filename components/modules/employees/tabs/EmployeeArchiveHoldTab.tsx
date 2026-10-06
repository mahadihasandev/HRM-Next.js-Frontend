"use client";

import React, { useState } from "react";
import { UserX, PauseCircle, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import toast from "react-hot-toast";

interface DeactiveEmployee {
  id: number;
  name: string;
  employeeFullId: string;
  department: string;
  designation: string;
  deactivationDate: string;
  reason: string;
}

interface HoldEmployee {
  id: number;
  name: string;
  employeeFullId: string;
  department: string;
  holdSince: string;
  holdType: "Salary Disbursement" | "Administrative Suspension" | "Document Pending";
  remarks: string;
}

const INITIAL_DEACTIVE: DeactiveEmployee[] = [
  { id: 1, name: "Anisur Rahman", employeeFullId: "SMT-0012", department: "Sales & Distribution", designation: "Officer", deactivationDate: "2026-06-30", reason: "Resignation due to overseas migration" },
  { id: 2, name: "Shahina Akter", employeeFullId: "SMT-0018", department: "Finance & Accounts", designation: "Accountant", deactivationDate: "2026-04-15", reason: "Personal family relocation" },
];

const INITIAL_HOLD: HoldEmployee[] = [
  { id: 1, name: "Sharif Ahmed", employeeFullId: "SMT-0044", department: "Field Force Management", holdSince: "2026-09-20", holdType: "Salary Disbursement", remarks: "Pending retail cash collection reconciliation" },
  { id: 2, name: "Faruk Hossain", employeeFullId: "SMT-0062", department: "Supply Chain & Logistics", holdSince: "2026-09-28", holdType: "Document Pending", remarks: "Police verification certificate renewal outstanding" },
];

export function EmployeeArchiveHoldTab() {
  const [deactiveList, setDeactiveList] = useState<DeactiveEmployee[]>(INITIAL_DEACTIVE);
  const [holdList, setHoldList] = useState<HoldEmployee[]>(INITIAL_HOLD);
  const [viewSection, setViewSection] = useState<"deactive" | "hold">("deactive");

  const handleReactivate = (id: number, name: string) => {
    setDeactiveList(deactiveList.filter((d) => d.id !== id));
    toast.success(`Employee ${name} reactivated and restored to Active Workforce!`);
  };

  const handleReleaseHold = (id: number, name: string) => {
    setHoldList(holdList.filter((h) => h.id !== id));
    toast.success(`Administrative hold on ${name} successfully cleared.`);
  };

  return (
    <div className="space-y-4">
      {/* Selector */}
      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <button
          onClick={() => setViewSection("deactive")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewSection === "deactive"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          }`}
        >
          <UserX className="h-4 w-4 text-rose-400" />
          Deactivated Staff Archive ({deactiveList.length})
        </button>
        <button
          onClick={() => setViewSection("hold")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            viewSection === "hold"
              ? "bg-amber-700 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          }`}
        >
          <PauseCircle className="h-4 w-4 text-amber-300" />
          Hold Employees ({holdList.length})
        </button>
      </div>

      {viewSection === "deactive" ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">SL</th>
                <th className="py-3 px-3">Former Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Designation</th>
                <th className="py-3 px-3">Deactivation Date</th>
                <th className="py-3 px-3">Separation Note</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deactiveList.map((d, idx) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-900">{d.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{d.employeeFullId}</p>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{d.department}</td>
                  <td className="py-2.5 px-3 text-slate-700">{d.designation}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{d.deactivationDate}</td>
                  <td className="py-2.5 px-3 text-slate-600">{d.reason}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Button
                      size="sm"
                      onClick={() => handleReactivate(d.id, d.name)}
                      leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                      className="text-[10px] py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Re-Activate
                    </Button>
                  </td>
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
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Hold Since</th>
                <th className="py-3 px-3">Hold Type</th>
                <th className="py-3 px-3">Auditor Remarks</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holdList.map((h, idx) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-900">{h.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{h.employeeFullId}</p>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{h.department}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{h.holdSince}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="warning">{h.holdType}</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">{h.remarks}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Button
                      size="sm"
                      onClick={() => handleReleaseHold(h.id, h.name)}
                      className="text-[10px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Release Hold
                    </Button>
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
