"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  CardWrapper,
  EmptyState,
  SearchInput,
  Text,
} from "@/components/shared";
import { usePayrollHistoryQuery } from "@/store/services/payroll/payrollRunApi";
import { money, printLegacyPayslip } from "@/lib/payroll/documents";
import { payrollError } from "./PayrollWorkspace";
export function PreviousPayslips() {
  const { data, isLoading, error, refetch } = usePayrollHistoryQuery();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rows = (data?.data || []).filter((item) =>
    `${item.employee_name} ${item.employee_full_id} ${item.month}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(rows.length / 20));
  const current = Math.min(page, pages);
  return (
    <CardWrapper
      title="Previous payslip history"
      description="Existing salary records are preserved exactly as stored, without recalculating overtime or changing paid totals."
      headerAction={
        <SearchInput
          aria-label="Search previous payslips"
          value={search}
          onChange={setSearch}
          placeholder="Employee or month…"
        />
      }
    >
      {error && (
        <>
          <Text role="alert">{payrollError(error)}</Text>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </>
      )}
      {isLoading ? (
        <Text role="status">Loading previous payslips…</Text>
      ) : (
        !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50">
                  <tr>
                    {[
                      "Month",
                      "Employee",
                      "Earnings",
                      "Deductions",
                      "Net salary",
                      "Status",
                      "Payment date",
                      "",
                    ].map((title) => (
                      <th className="p-3 font-medium" key={title}>
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.slice((current - 1) * 20, current * 20).map((item) => (
                    <tr key={item.id}>
                      <td className="p-3">{item.month}</td>
                      <td className="p-3">
                        {item.employee_name}
                        <Text
                          variant="caption"
                          className="!text-slate-500 !font-normal mt-1"
                        >
                          {item.employee_full_id}
                        </Text>
                      </td>
                      <td className="p-3">{money(item.total_earnings)}</td>
                      <td className="p-3">{money(item.total_deductions)}</td>
                      <td className="p-3 font-semibold text-teal-800">
                        {money(item.net_payable)}
                      </td>
                      <td className="p-3">{item.status}</td>
                      <td className="p-3">{item.payment_date || "Pending"}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            try {
                              printLegacyPayslip(item);
                            } catch (err) {
                              toast.error(payrollError(err));
                            }
                          }}
                        >
                          Print / PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!rows.length && (
              <EmptyState
                title="No previous payslips"
                description="Previously stored salary records will appear here."
              />
            )}
            <div className="flex justify-between mt-4">
              <Text variant="caption">
                {rows.length} records · {current} / {pages}
              </Text>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={current <= 1}
                  onClick={() => setPage(current - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={current >= pages}
                  onClick={() => setPage(current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )
      )}
    </CardWrapper>
  );
}
