"use client";
import { useState } from "react";
import { Button, Text } from "@/components/shared";
import { PayrollItem } from "@/store/services/payroll/runTypes";
import { money } from "@/lib/payroll/documents";
export function PayrollRegister({
  rows,
  search = "",
  onPayslip,
}: {
  rows: PayrollItem[];
  search?: string;
  onPayslip?: (item: PayrollItem) => void;
}) {
  const [page, setPage] = useState(1);
  const filtered = rows.filter((row) =>
    [
      row.employee_name,
      row.employee_full_id,
      row.factory,
      row.section,
      row.line,
      row.grade,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 20));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * 20, current * 20);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide border-y border-slate-100">
            <tr>
              {[
                "Employee",
                "Factory / section / line",
                "Grade",
                "Overtime",
                "Earnings",
                "Deductions",
                "Net payable",
                "Method",
                ...(onPayslip ? ["Payslip"] : []),
              ].map((heading) => (
                <th key={heading} className="p-3 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((item, index) => (
              <tr
                key={`${item.employee_full_id}-${index}`}
                className="hover:bg-teal-50/40"
              >
                <td className="p-3">
                  <Text className="!text-sm !font-medium">
                    {item.employee_name}
                  </Text>
                  <Text
                    variant="caption"
                    className="!text-slate-500 !font-normal mt-1"
                  >
                    {item.employee_full_id}
                  </Text>
                </td>
                <td className="p-3 text-xs text-slate-600">
                  {[item.factory, item.section, item.line]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </td>
                <td className="p-3">{item.grade || "—"}</td>
                <td className="p-3 tabular-nums">
                  {item.overtime_hours}h
                  <Text
                    variant="caption"
                    className="!text-slate-500 !font-normal mt-1"
                  >
                    {money(item.overtime_amount)}
                  </Text>
                </td>
                <td className="p-3 tabular-nums">
                  {money(item.total_earnings)}
                </td>
                <td className="p-3 tabular-nums text-rose-600">
                  {money(item.total_deductions)}
                </td>
                <td className="p-3 tabular-nums font-semibold text-teal-800">
                  {money(item.net_payable)}
                </td>
                <td className="p-3 capitalize">{item.payment_method}</td>
                {onPayslip && (
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onPayslip(item)}
                    >
                      Print / PDF
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!visible.length && (
        <Text className="py-6 text-center">
          No employees match this search.
        </Text>
      )}
      <div className="flex justify-between items-center pt-4">
        <Text variant="caption" className="!font-normal">
          {filtered.length} employees · Page {current} of {pages}
        </Text>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
