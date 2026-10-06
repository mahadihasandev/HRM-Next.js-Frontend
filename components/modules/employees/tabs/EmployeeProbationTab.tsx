"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, AlertCircle, FileCheck, ArrowUpRight } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import toast from "react-hot-toast";

interface ProbationItem {
  id: number;
  name: string;
  employeeFullId: string;
  department: string;
  designation: string;
  joiningDate: string;
  confirmationDueDate: string;
  remainingDays: number;
  evalScore: number;
  evalStatus: "Pending Scorecard" | "Recommended for Confirmation" | "Review Required";
}

const INITIAL_PROBATION: ProbationItem[] = [
  {
    id: 1,
    name: "Tariqul Islam",
    employeeFullId: "SMT-0071",
    department: "Sales & Distribution",
    designation: "Territory Sales Officer",
    joiningDate: "2026-05-01",
    confirmationDueDate: "2026-11-01",
    remainingDays: 27,
    evalScore: 88,
    evalStatus: "Recommended for Confirmation",
  },
  {
    id: 2,
    name: "Shahidul Alam",
    employeeFullId: "SMT-0072",
    department: "Field Force Management",
    designation: "Sales Representative",
    joiningDate: "2026-06-15",
    confirmationDueDate: "2026-12-15",
    remainingDays: 71,
    evalScore: 82,
    evalStatus: "Pending Scorecard",
  },
  {
    id: 3,
    name: "Farhana Yasmin",
    employeeFullId: "SMT-0073",
    department: "Administration & HR",
    designation: "Junior HR Officer",
    joiningDate: "2026-04-10",
    confirmationDueDate: "2026-10-10",
    remainingDays: 5,
    evalScore: 92,
    evalStatus: "Recommended for Confirmation",
  },
  {
    id: 4,
    name: "Mahmud Hasan",
    employeeFullId: "SMT-0074",
    department: "Finance & Accounts",
    designation: "Accounts Executive",
    joiningDate: "2026-07-01",
    confirmationDueDate: "2027-01-01",
    remainingDays: 88,
    evalScore: 74,
    evalStatus: "Review Required",
  },
];

export function EmployeeProbationTab() {
  const [list, setList] = useState<ProbationItem[]>(INITIAL_PROBATION);

  const handleConfirmPermanent = (id: number, name: string) => {
    setList(list.filter((item) => item.id !== id));
    toast.success(`Employee ${name} successfully confirmed as Permanent Staff!`);
  };

  const handleExtendProbation = (id: number, name: string) => {
    setList(
      list.map((item) =>
        item.id === id ? { ...item, remainingDays: item.remainingDays + 90 } : item
      )
    );
    toast.success(`Probation for ${name} extended by 3 months per BLA Section 4(4).`);
  };

  return (
    <div className="space-y-4">
      {/* Banner info */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Clock className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <span className="font-extrabold text-blue-900 block">
              Probation Confirmation & Statutory Review (BLA 2006)
            </span>
            <span className="text-blue-800">
              Employees nearing completion of statutory 6-month probation cycle. Reviews must be concluded before the due date.
            </span>
          </div>
        </div>
        <Badge variant="default" className="shrink-0 font-bold">
          {list.length} Under Review
        </Badge>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3">Employee</th>
              <th className="py-3 px-3">Role & Dept</th>
              <th className="py-3 px-3">Joining Date</th>
              <th className="py-3 px-3">Confirmation Due</th>
              <th className="py-3 px-3 text-center">Remaining</th>
              <th className="py-3 px-3 text-center">Score</th>
              <th className="py-3 px-3">HOD Status</th>
              <th className="py-3 px-3 text-center">Statutory Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{item.employeeFullId}</p>
                </td>
                <td className="py-2.5 px-3">
                  <p className="font-semibold text-slate-800">{item.designation}</p>
                  <p className="text-[10px] text-blue-700 font-medium">{item.department}</p>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-700">{item.joiningDate}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                  {item.confirmationDueDate}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded font-extrabold font-mono text-[11px] ${
                      item.remainingDays <= 15
                        ? "bg-rose-100 text-rose-800 animate-pulse"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.remainingDays} Days
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-extrabold text-blue-700">
                  {item.evalScore}%
                </td>
                <td className="py-2.5 px-3">
                  <Badge
                    variant={
                      item.evalStatus === "Recommended for Confirmation"
                        ? "success"
                        : item.evalStatus === "Review Required"
                        ? "warning"
                        : "outline"
                    }
                  >
                    {item.evalStatus}
                  </Badge>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => handleConfirmPermanent(item.id, item.name)}
                      className="text-[10px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExtendProbation(item.id, item.name)}
                      className="text-[10px] py-1 px-2 text-slate-700 font-bold border-slate-300"
                    >
                      Extend
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
