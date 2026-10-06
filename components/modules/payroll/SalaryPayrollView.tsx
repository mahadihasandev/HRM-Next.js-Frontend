"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Banknote,
  Download,
  Printer,
  CreditCard,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Eye,
  X,
  PieChart,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  Title,
  Subtitle,
  CardWrapper,
  Button,
  Badge,
  PageHeader,
  StatCard,
  EmptyState,
} from "@/components/shared";
import { MOCK_PAYSLIPS, MOCK_EMPLOYEES } from "@/lib/api/hrmClient";
import { PayslipRecord, PayslipApiRecord, ApiResponse } from "@/types/hrm";
import { ManageOvertimeModal } from "./ManageOvertimeModal";
import { CompensationDonutChart } from "./CompensationDonutChart";

interface SalaryPayrollViewProps {
  currentOperator?: {
    id: number | string;
    fullId: string;
    name: string;
    department: string;
  };
  isAdmin?: boolean;
}

export function SalaryPayrollView({
  currentOperator = {
    id: 100,
    fullId: "SMT-0001",
    name: "System Administrator",
    department: "Administration",
  },
  isAdmin: _isAdmin = true,
}: SalaryPayrollViewProps) {
  const [payslips, setPayslips] = useState<PayslipRecord[]>(MOCK_PAYSLIPS);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const employee = MOCK_EMPLOYEES[0];

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/hrm/payslips");
      if (!res.ok) return;
      const json: ApiResponse<PayslipApiRecord[]> = await res.json();
      if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: PayslipRecord[] = json.data.map((item: PayslipApiRecord) => ({
          id: item.id,
          month: item.month || "2026-10",
          employee_name: item.employee_name || "Abdul Halim",
          employee_full_id: item.employee_full_id || "SMT-0051",
          designation: item.designation || "Officer",
          department: item.department || "Sales",
          basic_salary: item.basic_salary || 55000,
          house_rent: item.house_rent || 27500,
          medical_allowance: item.medical_allowance || 5500,
          conveyance: item.conveyance || 4000,
          special_allowance: 0,
          overtime_hours: item.overtime_hours ?? 0,
          overtime_rate: item.overtime_rate ?? 528.85,
          overtime_amount: item.overtime_amount ?? 0,
          overtime_formatted: item.overtime_formatted,
          other_deductions: 0,
          total_earnings: item.total_earnings || 92000,
          pf_deduction: item.pf_deduction || 5500,
          tax_deduction: item.tax_deduction || 4200,
          loan_deduction: item.loan_deduction || 0,
          total_deductions: item.total_deductions || 9700,
          net_payable: item.net_payable || 82300,
          payment_date: item.payment_date || "2026-10-01",
          payment_method: item.payment_method || "Bank Transfer",
          status: item.status || "Paid",
        }));
        setPayslips(mapped);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const init = async () => {
      if (!ignore) {
        await fetchPayslips();
      }
    };
    void init();
    return () => {
      ignore = true;
    };
  }, [fetchPayslips]);


  const totalPages = Math.ceil(payslips.length / pageSize) || 1;
  const paginatedPayslips = payslips.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary & Payroll Management"
        subtitle="Comprehensive employee compensation, monthly payslips, and tax deduction statements"
        badge={
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> Up to Date
          </Badge>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsOvertimeModalOpen(true)}
              leftIcon={<Clock className="h-4 w-4 text-amber-600" />}
              className="border-slate-300 font-extrabold text-slate-900 bg-white hover:bg-amber-50 hover:border-amber-400 shadow-2xs"
            >
              Overtime Rates
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedPayslip(payslips[0])}
              leftIcon={<Receipt className="h-4 w-4" />}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-2xs"
            >
              Latest Payslip Voucher
            </Button>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Basic Salary"
          value={`৳${employee.salary?.basic.toLocaleString()}`}
          subtitle="Base salary rate per month"
          variant="blue"
          icon={<Banknote className="h-5 w-5" />}
        />

        <StatCard
          title="Gross Package"
          value={`৳${employee.salary?.gross.toLocaleString()}`}
          subtitle="Includes HRA, Medical & Conveyance"
          variant="emerald"
          icon={<PieChart className="h-5 w-5" />}
        />

        <StatCard
          title="Net Take-Home Pay"
          value={`৳${employee.salary?.net_payable.toLocaleString()}`}
          subtitle="After PF (৳5,500) & Tax (৳4,200)"
          variant="indigo"
          icon={<Receipt className="h-5 w-5" />}
        />

        <StatCard
          title="Disbursement Bank"
          value={employee.bank_name || "Eastern Bank PLC"}
          subtitle={`A/C: ${employee.bank_account_no || "1081250987621"}`}
          variant="amber"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      {/* Salary Structure Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detailed Earnings Breakdown */}
        <div className="lg:col-span-2">
          <CardWrapper
            title="Monthly Compensation Structure"
            description="Official breakdown as per the company remuneration policy"
            headerAction={
              <Badge variant="default" className="font-bold">
                BLA 2006 Structure
              </Badge>
            }
          >
            <CompensationDonutChart salary={employee.salary} />
          </CardWrapper>
        </div>

        {/* Right: Bank & Disbursement Profile */}
        <div>
          <CardWrapper
            title="Disbursement Account"
            description="Primary bank account for salary credits"
            headerAction={<Building2 className="h-5 w-5 text-blue-500" />}
          >
            <div className="space-y-3.5 pt-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bank Name</span>
                <span className="font-medium text-slate-800">{employee.bank_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Branch</span>
                <span className="font-medium text-slate-800">{employee.branch_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Account No</span>
                <span className="font-mono font-medium text-slate-900">
                  {employee.bank_account_no}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Routing No</span>
                <span className="font-mono font-medium text-slate-800">
                  {employee.routing_name}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Verification</span>
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified by HR
                </Badge>
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>

      {/* Payslip History Table */}
      <CardWrapper
        title="Payslip Statement History"
        description="Official salary statements available for download & viewing"
      >
        {payslips.length === 0 ? (
          <EmptyState
            title="No payslips available"
            description="Your monthly payslips will be generated and listed here following payroll disbursement."
            icon={<Receipt className="h-6 w-6 text-slate-400" />}
            className="my-4"
          />
        ) : (
          <>
            <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                <tr>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4 text-center">Overtime (OT)</th>
                  <th className="py-3 px-4">Gross Earnings</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Paid</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedPayslips.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-100/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-900" />
                        <span>{p.month}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-black text-slate-950">{p.employee_name}</p>
                      <p className="font-mono text-slate-600 font-bold text-[11px]">{p.employee_full_id}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <p className="font-bold text-slate-900 font-mono">
                        ৳{(p.overtime_amount ?? 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold font-mono">
                        {p.overtime_hours ?? 0} hrs @ ৳{(p.overtime_rate ?? 528.85).toFixed(0)}/hr
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ৳{p.total_earnings.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-rose-700 font-bold">
                      -৳{p.total_deductions.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                      ৳{p.net_payable.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{p.payment_date}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">Paid</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayslip(p)}
                        leftIcon={<Eye className="h-3.5 w-3.5" />}
                        className="border-slate-300 font-bold text-slate-900 hover:bg-slate-100"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 mt-2">
              <span className="text-xs font-bold text-slate-700">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, payslips.length)} of {payslips.length} payslips
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2.5 text-xs font-bold border-slate-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <span className="text-xs font-mono font-bold text-slate-900 px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2.5 text-xs font-bold border-slate-300"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
        )}
      </CardWrapper>

      {/* Payslip Voucher Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedPayslip(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Voucher Header */}
            <div className="text-center pb-6 border-b border-slate-200">
              <Title level={2} className="text-xl font-bold text-gray-700">
                Smart ERP Solutions Ltd.
              </Title>
              <Subtitle className="text-xs text-slate-700 font-medium mt-0.5">
                Corporate Headquarters, Banani Commercial Zone, Dhaka - 1213
              </Subtitle>
              <div className="mt-3 inline-block bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold text-blue-800">
                Payslip Voucher for {selectedPayslip.month}
              </div>
            </div>

            {/* Employee Metadata */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-700 font-bold">Employee Name:</span>
                <p className="font-extrabold text-slate-950 text-sm">
                  {selectedPayslip.employee_name}
                </p>
              </div>
              <div>
                <span className="text-slate-700 font-bold">Employee ID:</span>
                <p className="font-extrabold text-slate-950 text-sm font-mono">
                  {selectedPayslip.employee_full_id}
                </p>
              </div>
              <div>
                <span className="text-slate-700 font-bold">Designation:</span>
                <p className="font-semibold text-slate-900">
                  {selectedPayslip.designation}
                </p>
              </div>
              <div>
                <span className="text-slate-700 font-bold">Department:</span>
                <p className="font-semibold text-slate-900">
                  {selectedPayslip.department}
                </p>
              </div>
            </div>

            {/* Earnings & Deductions Tables */}
            <div className="grid grid-cols-2 gap-6 py-4 text-xs">
              {/* Earnings */}
              <div className="space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                  Earnings
                </p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-800">
                    ৳{selectedPayslip.basic_salary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">House Rent (HRA)</span>
                  <span className="font-semibold text-slate-800">
                    ৳{selectedPayslip.house_rent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Medical Allowance</span>
                  <span className="font-semibold text-slate-800">
                    ৳{selectedPayslip.medical_allowance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Conveyance</span>
                  <span className="font-semibold text-slate-800">
                    ৳{selectedPayslip.conveyance.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <div>
                    <span className="text-emerald-950 font-bold block text-[11px]">
                      Overtime Compensation
                    </span>
                    <span className="text-[10px] text-emerald-800 font-mono">
                      {selectedPayslip.overtime_hours ?? 0} hrs @ ৳{(selectedPayslip.overtime_rate ?? 528.85).toLocaleString()}/hr
                    </span>
                  </div>
                  <span className="font-mono font-black text-emerald-950 text-xs">
                    ৳{(selectedPayslip.overtime_amount ?? 0).toLocaleString()}
                  </span>
                </div>
                {selectedPayslip.special_allowance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Special Allowance</span>
                    <span className="font-semibold text-slate-800">
                      ৳{selectedPayslip.special_allowance.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                  <span>Gross Earnings</span>
                  <span className="text-blue-600">
                    ৳{selectedPayslip.total_earnings.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                  Deductions
                </p>
                <div className="flex justify-between">
                  <span className="text-slate-600">Provident Fund (PF)</span>
                  <span className="font-semibold text-red-600">
                    ৳{selectedPayslip.pf_deduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Income Tax TDS</span>
                  <span className="font-semibold text-red-600">
                    ৳{selectedPayslip.tax_deduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-slate-900">
                  <span>Total Deductions</span>
                  <span className="text-red-600">
                    ৳{selectedPayslip.total_deductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Amount Banner */}
            <div className="bg-white border-2 border-slate-900 rounded-xl p-4 flex items-center justify-between my-2">
              <div>
                <span className="text-xs text-slate-800 font-bold">
                  Net Payable Disbursed Amount
                </span>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Paid via Bank Transfer ({selectedPayslip.payment_date})
                </p>
              </div>
              <span className="text-2xl font-black text-emerald-700">
                ৳{selectedPayslip.net_payable.toLocaleString()}
              </span>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200 text-center text-xs text-slate-700 font-semibold">
              <div className="border-t border-dashed border-slate-400 pt-2">
                Authorized Signature / Accounts
              </div>
              <div className="border-t border-dashed border-slate-400 pt-2">
                Employee Signature / Recipient
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="h-4 w-4" />}
              >
                Print Voucher
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedPayslip(null)}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overtime Rate Configuration Modal */}
      <ManageOvertimeModal
        isOpen={isOvertimeModalOpen}
        onClose={() => setIsOvertimeModalOpen(false)}
        operator={currentOperator}
        onRateUpdated={() => fetchPayslips()}
      />
    </div>
  );
}
