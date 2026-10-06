"use client";

import React, { useState } from "react";
import { Edit3, Target } from "lucide-react";
import { Button, EmptyState, SearchInput } from "@/components/shared";
import { TargetCommitment } from "./types";

interface SfmCommitmentTableProps {
  commitments: TargetCommitment[];
  onEdit: (c: TargetCommitment) => void;
}

export function SfmCommitmentTable({ commitments, onEdit }: SfmCommitmentTableProps) {
  const [search, setSearch] = useState("");

  const filtered = commitments.filter(
    (c) =>
      c.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.territory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-300 shadow-xs">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search SR name, code, territory..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <div className="text-xs text-slate-700 font-semibold">
          Showing <span className="font-black text-slate-950">{filtered.length}</span> Territory Officers
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No target commitments found"
          description={
            search
              ? "No territory officers match your search query."
              : "No target commitments have been configured for this month."
          }
          icon={<Target className="h-6 w-6 text-slate-900" />}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase font-extrabold tracking-wider border-b border-slate-900">
              <tr>
                <th className="py-3 px-4">Sales Officer</th>
                <th className="py-3 px-4">Territory Zone</th>
                <th className="py-3 px-4">Assigned Target</th>
                <th className="py-3 px-4">Commitment</th>
                <th className="py-3 px-4">Actual Sales</th>
                <th className="py-3 px-4">Achievement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c) => {
                const achievementPct =
                  c.commitment_value > 0
                    ? Math.round((c.actual_sales / c.commitment_value) * 100)
                    : 0;

                return (
                  <tr key={c.id} className="hover:bg-slate-100/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-black text-slate-950">{c.employee_name}</p>
                      <p className="font-mono text-slate-600 font-bold text-[11px]">{c.code}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {c.territory}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      ৳{c.target_value.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ৳{c.commitment_value.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      ৳{c.actual_sales.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              achievementPct >= 80
                                ? "bg-emerald-500"
                                : achievementPct >= 60
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(achievementPct, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono font-semibold text-[11px] text-slate-700">
                          {achievementPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => onEdit(c)}
                        leftIcon={<Edit3 className="h-3 w-3" />}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
