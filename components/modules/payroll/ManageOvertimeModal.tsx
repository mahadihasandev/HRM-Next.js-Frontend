"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  X,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Search,
  History,
} from "lucide-react";
import {
  Title,
  Subtitle,
  Button,
  Badge,
  Banner,
} from "@/components/shared";
import { OvertimeEmployeeItem } from "@/types/hrm";

import {
  useOvertimeRatesQuery,
  useOvertimeLogsQuery,
  useSetOvertimeRateMutation,
  useBulkOvertimeRatesMutation,
} from "@/store/services/payroll/overtimeApi";

interface ManageOvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: {
    id: number | string;
    fullId: string;
    name: string;
    department: string;
  };
  onRateUpdated?: () => void;
}

export function ManageOvertimeModal({
  isOpen,
  onClose,
  operator,
  onRateUpdated,
}: ManageOvertimeModalProps) {
  const ratesQuery = useOvertimeRatesQuery(undefined, { skip: !isOpen });
  const logsQuery = useOvertimeLogsQuery(undefined, { skip: !isOpen });
  const [setRate] = useSetOvertimeRateMutation();
  const [bulkSet] = useBulkOvertimeRatesMutation();
  const data = ratesQuery.data?.data;
  const logs = logsQuery.data?.data || [];
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [activeTab, setActiveTab] = useState<"rates" | "logs">("rates");
  const [rateInputs, setRateInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isBulkApplying, setIsBulkApplying] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: "success" | "danger" | "warning";
    title: string;
    message: string;
  } | null>(null);

  // Check if current operator has authority: Admin, HR, or High Official
  const isAuthorizedManager =
    operator.department === "Administration" ||
    operator.department === "Human Resources" ||
    operator.fullId === "SMT-0001";

  const fetchRates = () => ratesQuery.refetch();
  const fetchLogs = () => logsQuery.refetch();

  if (!isOpen) return null;

  // Handle saving an individual employee's rate
  const handleSaveRate = async (emp: OvertimeEmployeeItem) => {
    if (!isAuthorizedManager) {
      setFeedback({
        variant: "danger",
        title: "Access Denied",
        message:
          "Only Admin, HR, and High Officials can configure employee overtime rates.",
      });
      return;
    }

    const rateVal = parseFloat(
      rateInputs[emp.employee_full_id] ?? String(emp.active_effective_rate),
    );
    if (isNaN(rateVal) || rateVal < 0) {
      setFeedback({
        variant: "warning",
        title: "Invalid Rate",
        message:
          "Please enter a valid non-negative hourly overtime rate (৳/hr).",
      });
      return;
    }

    setSavingId(emp.employee_full_id);
    try {
      const json = await setRate({
        employee_full_id: emp.employee_full_id,
        overtime_rate: rateVal,
        reason: `Rate updated to ৳${rateVal}/hr by ${operator.name} (${operator.department})`,
        operator_id: operator.fullId,
      }).unwrap();

      if (json.status === true) {
        setFeedback({
          variant: "success",
          title: "Overtime Rate Updated",
          message: `Overtime rate for ${emp.name} is now ৳${rateVal}/hr. Existing approved payroll snapshots remain unchanged.`,
        });
        await fetchRates();
        await fetchLogs();
        onRateUpdated?.();
      } else {
        setFeedback({
          variant: "danger",
          title: "Update Failed",
          message: json.message || "Failed to update overtime rate.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setFeedback({
        variant: "danger",
        title: "Network Error",
        message: "Could not connect to server: " + msg,
      });
    } finally {
      setSavingId(null);
    }
  };

  // Quick fill BLA standard rate into input
  const handleApplyBlaStandard = (emp: OvertimeEmployeeItem) => {
    setRateInputs((prev) => ({
      ...prev,
      [emp.employee_full_id]: String(emp.bla_standard_rate),
    }));
  };

  // Bulk Apply BLA Standard to all employees in the view
  const handleBulkApplyBla = async () => {
    if (!isAuthorizedManager) {
      toast.error(
        "Access Denied: Only Admin, HR, and High Officials can configure employee overtime rates.",
      );
      return;
    }

    if (
      !confirm(
        "Are you sure you want to apply the Bangladesh Labor Act (BLA 2006) 2x Basic/208 statutory rate to all active employees?",
      )
    ) {
      return;
    }

    setIsBulkApplying(true);
    try {
      const json = await bulkSet({
        mode: "bla_standard",
        operator_id: operator.fullId,
      }).unwrap();

      if (json.status === true) {
        setFeedback({
          variant: "success",
          title: "BLA Statutory Rates Applied",
          message: `Updated overtime rates for ${json.data?.updated_count ?? "all"} employees based on 2x ordinary hourly basic.`,
        });
        await fetchRates();
        await fetchLogs();
        onRateUpdated?.();
      }
    } catch (err) {
      console.error("Bulk apply failed", err);
    } finally {
      setIsBulkApplying(false);
    }
  };

  // Filter employees
  const filteredEmployees = (data?.employees || []).filter((emp) => {
    const matchesDept =
      selectedDept === "all" || emp.department === selectedDept;
    const matchesSearch =
      search === "" ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_full_id.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const departments = Array.from(
    new Set((data?.employees || []).map((e) => e.department)),
  ).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Title level={2} className="text-lg font-black text-white">
                  Overtime Rate & Compensation System
                </Title>
                <Badge
                  variant={isAuthorizedManager ? "success" : "warning"}
                  className="font-extrabold text-[10px]"
                >
                  {isAuthorizedManager
                    ? "Admin / HR Authority"
                    : "Read-Only Mode"}
                </Badge>
              </div>
              <Subtitle className="text-xs text-slate-300 font-medium mt-0.5">
                Bangladeshi Labor Act (BLA 2006) 2× (Basic / 208) formula &
                custom rate assignment
              </Subtitle>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security Policy Bar */}
        <div
          className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
            isAuthorizedManager
              ? "bg-emerald-50 border-emerald-200 text-emerald-950"
              : "bg-amber-50 border-amber-200 text-amber-950"
          }`}
        >
          <div className="flex items-center gap-2">
            {isAuthorizedManager ? (
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
            )}
            <span>
              <strong>Active Operator:</strong> {operator.name} (
              {operator.fullId}) &bull; {operator.department}
            </span>
          </div>

          <div>
            {isAuthorizedManager ? (
              <span className="font-extrabold text-emerald-800">
                ✓ Authorized: You can configure and apply overtime rates.
              </span>
            ) : (
              <span className="font-extrabold text-amber-900">
                🔒 Locked: Only Administration, HR, and High Officials can
                modify rates.
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f8fafc]">
          {/* Feedback Banner */}
          {feedback && (
            <Banner
              variant={feedback.variant}
              title={feedback.title}
              description={feedback.message}
              isDismissible
              onClose={() => setFeedback(null)}
            />
          )}

          {/* Quick Metrics KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Workforce
              </span>
              <span className="text-xl font-extrabold text-slate-900 font-mono mt-1 block">
                {data?.summary.total_employees ?? "—"} Staff
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                Overtime eligible pool
              </span>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Overtime Logged
              </span>
              <span className="text-xl font-extrabold text-blue-900 font-mono mt-1 block">
                {data?.summary.total_overtime_formatted ?? "0 hrs 00 mins"}
              </span>
              <span className="text-[10px] text-blue-700 font-bold">
                Accumulated from punches
              </span>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Overtime Salary
              </span>
              <span className="text-xl font-extrabold text-emerald-900 font-mono mt-1 block">
                ৳{(data?.summary.total_overtime_cost ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">
                Added to monthly earnings
              </span>
            </div>

            <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Statutory BLA Rule
              </span>
              <span className="text-xs font-black text-slate-900 mt-1 block">
                2 × (Basic / 208 hrs)
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                Bangladesh Labor Act standard
              </span>
            </div>
          </div>

          {/* Action Tabs & Bulk Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("rates")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                  activeTab === "rates"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                Employee Overtime Rates
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === "logs"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Audit Logs ({logs.length})
              </button>
            </div>

            {activeTab === "rates" && isAuthorizedManager && (
              <Button
                size="sm"
                variant="outline"
                disabled={isBulkApplying}
                onClick={handleBulkApplyBla}
                leftIcon={<Sparkles className="h-3.5 w-3.5 text-amber-600" />}
                className="border-slate-300 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-2xs"
                title="Reset all employees to the BLA 2006 2x Basic/208 statutory overtime formula"
              >
                {isBulkApplying
                  ? "Applying Formula..."
                  : "Apply BLA Formula to All (2× Basic/208)"}
              </Button>
            )}
          </div>

          {/* Active Tab: Overtime Rates Table */}
          {activeTab === "rates" && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by employee name, code (e.g. SMT-0051), or designation..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white text-xs font-bold text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900 shadow-2xs"
                  />
                </div>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-white text-xs font-bold text-slate-900 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-slate-900 shadow-2xs cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white font-black uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Employee</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4 text-right">Basic Salary</th>
                        <th className="py-3 px-4 text-right">
                          BLA Formula Rate
                        </th>
                        <th className="py-3 px-4 text-center">
                          Hourly OT Rate (৳/hr)
                        </th>
                        <th className="py-3 px-4 text-center">Month OT</th>
                        <th className="py-3 px-4 text-right">
                          Overtime Pay (৳)
                        </th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredEmployees.map((emp) => {
                        const currentInput =
                          rateInputs[emp.employee_full_id] ??
                          String(emp.active_effective_rate);
                        const isChanged =
                          parseFloat(currentInput) !==
                          emp.active_effective_rate;

                        return (
                          <tr
                            key={emp.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <p className="font-extrabold text-slate-900 text-xs">
                                {emp.name}
                              </p>
                              <p className="font-mono text-[10px] text-slate-500 font-bold">
                                {emp.employee_full_id} &bull; {emp.designation}
                              </p>
                            </td>

                            <td className="py-3 px-4 font-semibold text-slate-700">
                              {emp.department}
                            </td>

                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                              ৳{emp.basic_salary.toLocaleString()}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <span className="font-mono font-bold text-slate-700">
                                ৳{emp.bla_standard_rate.toFixed(2)}/hr
                              </span>
                              {isAuthorizedManager && (
                                <button
                                  type="button"
                                  onClick={() => handleApplyBlaStandard(emp)}
                                  className="block text-[10px] text-blue-700 font-extrabold hover:underline ml-auto cursor-pointer"
                                  title="Load BLA standard rate into input"
                                >
                                  Load BLA
                                </button>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1">
                                <span className="font-bold text-slate-700 text-xs">
                                  ৳
                                </span>
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  disabled={!isAuthorizedManager}
                                  value={currentInput}
                                  onChange={(e) =>
                                    setRateInputs({
                                      ...rateInputs,
                                      [emp.employee_full_id]: e.target.value,
                                    })
                                  }
                                  className={`w-20 px-2 py-1 text-center font-mono font-black text-xs rounded-lg border-2 ${
                                    isChanged
                                      ? "border-amber-500 bg-amber-50 text-amber-950"
                                      : "border-slate-300 bg-white text-slate-900"
                                  } focus:outline-none focus:border-slate-900 disabled:bg-slate-100 disabled:text-slate-500`}
                                />
                                <span className="text-[11px] text-slate-500 font-medium">
                                  /hr
                                </span>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                              {emp.overtime_formatted}
                            </td>

                            <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-950 text-xs">
                              ৳{emp.overtime_earnings.toLocaleString()}
                            </td>

                            <td className="py-3 px-4 text-right">
                              {isAuthorizedManager ? (
                                <Button
                                  size="sm"
                                  variant={isChanged ? "default" : "outline"}
                                  disabled={savingId === emp.employee_full_id}
                                  onClick={() => handleSaveRate(emp)}
                                  className={`h-7 px-2.5 text-xs font-bold ${
                                    isChanged
                                      ? "bg-slate-900 hover:bg-slate-800 text-white shadow-2xs"
                                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  {savingId === emp.employee_full_id
                                    ? "Saving..."
                                    : "Save Rate"}
                                </Button>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] font-bold"
                                >
                                  Locked
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Active Tab: Audit Logs */}
          {activeTab === "logs" && (
            <div className="space-y-3">
              <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                {logs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                    No overtime rate changes logged yet. Any updates made by
                    Admin/HR will appear here.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-white font-black uppercase text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Timestamp</th>
                          <th className="py-3 px-4">Employee</th>
                          <th className="py-3 px-4 text-right">
                            Previous Rate
                          </th>
                          <th className="py-3 px-4 text-right">New Rate</th>
                          <th className="py-3 px-4">Authorized Manager</th>
                          <th className="py-3 px-4">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {logs.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-mono text-slate-600">
                              {new Date(l.created_at).toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              {l.employee_name} ({l.employee_full_id})
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-500">
                              ৳{parseFloat(String(l.previous_rate)).toFixed(2)}
                              /hr
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono font-extrabold text-emerald-950">
                              ৳{parseFloat(String(l.new_rate)).toFixed(2)}/hr
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-slate-800">
                              {l.changed_by_name} ({l.changed_by_role})
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 italic text-[11px]">
                              {l.reason || "Direct Admin Configuration"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-600 font-medium">
            Overtime salary calculations automatically reflect on employee
            payslips upon saving.
          </p>
          <Button
            size="sm"
            variant="default"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Done & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
