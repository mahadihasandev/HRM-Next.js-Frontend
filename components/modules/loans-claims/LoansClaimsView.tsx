"use client";

import React, { useState } from "react";
import {
  PiggyBank,
  Plus,
  MapPin,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CardWrapper,
  Button,
  Badge,
  PageHeader,
  Banner,
  EmptyState,
} from "@/components/shared";
import { MOCK_LOANS } from "@/lib/api/hrmClient";
import { HRLoanRecord } from "@/types/hrm";
import {
  useGetHrLoansQuery,
  useApplyHrLoanMutation,
} from "@/store/services/loans";
import {
  useGetTourPlanClaimsQuery,
} from "@/store/services/tour-plans";
import { LoanRequestModal } from "./LoanRequestModal";
import { LoansClaimsStats } from "./LoansClaimsStats";

interface FeedbackState {
  variant: "success" | "danger" | "warning";
  title: string;
  message: string;
}

const MOCK_CLAIMS = [
  {
    id: "CLM-247",
    route: "Dhaka ➔ Chittagong Regional Depot",
    date: "2026-09-15",
    food: 800,
    rent: 2500,
    total: 4800,
    status: "Approved",
  },
  {
    id: "CLM-248",
    route: "Dhaka ➔ Sylhet Distribution Center",
    date: "2026-09-28",
    food: 750,
    rent: 2200,
    total: 4150,
    status: "Approved",
  },
];

export function LoansClaimsView() {
  const { data: apiLoansResp } = useGetHrLoansQuery();
  const { data: apiClaimsResp } = useGetTourPlanClaimsQuery();
  const [applyLoanApi, { isLoading: isApplying }] = useApplyHrLoanMutation();

  const [localLoans, setLocalLoans] = useState<HRLoanRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Derive loans list: prepend optimistic/local submissions to server records or fallback mock
  const loans: HRLoanRecord[] = React.useMemo(() => {
    const serverLoans =
      apiLoansResp?.data && Array.isArray(apiLoansResp.data) && apiLoansResp.data.length > 0
        ? (apiLoansResp.data as unknown as HRLoanRecord[])
        : MOCK_LOANS;
    return [...localLoans, ...serverLoans];
  }, [localLoans, apiLoansResp]);

  const totalPages = Math.ceil(loans.length / pageSize) || 1;
  const paginatedLoans = loans.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Derive claims list from API response or fallback mock
  const claims = React.useMemo(() => {
    if (apiClaimsResp?.data && Array.isArray(apiClaimsResp.data) && apiClaimsResp.data.length > 0) {
      return apiClaimsResp.data.map((c) => ({
        id: c.claim_no || `CLM-${c.id}`,
        route: "Dhaka ➔ Regional Route",
        date: c.date || new Date().toISOString().split("T")[0],
        food: Number(c.da_amount || 0),
        rent: Number(c.ta_amount || 0),
        total: Number(c.total_amount || 0),
        status: c.status || "Approved",
      }));
    }
    return MOCK_CLAIMS;
  }, [apiClaimsResp]);

  const handleApplyLoan = async (data: {
    amount: number;
    installments: number;
    purpose: string;
    monthlyInstallment: number;
  }) => {
    const newLoan: HRLoanRecord = {
      id: Math.floor(100 + Math.random() * 900),
      amount: data.amount,
      installment_count: data.installments,
      monthly_installment: data.monthlyInstallment,
      applicable_month: "2026-11",
      purpose: data.purpose,
      cash_value: Math.round(data.amount / 2),
      bank_value: Math.round(data.amount / 2),
      status: "Pending",
      applied_at: new Date().toISOString().split("T")[0],
    };

    // Optimistic update
    setLocalLoans((prev) => [newLoan, ...prev]);
    setIsModalOpen(false);

    try {
      await applyLoanApi({
        amount: data.amount,
        installment_count: data.installments,
        purpose: data.purpose,
      }).unwrap();

      setFeedback({
        variant: "success",
        title: "Application Submitted",
        message: `HR Loan application for ৳${data.amount.toLocaleString()} submitted via RTK Query for finance committee approval.`,
      });
    } catch (err: unknown) {
      // ROLLBACK on API failure!
      setLocalLoans((prev) => prev.filter((l) => l.id !== newLoan.id));
      const errMsg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : err instanceof Error
          ? err.message
          : "Server connection failed or returned an error";

      setFeedback({
        variant: "danger",
        title: "Submission Failed (Changes Rolled Back)",
        message: `Could not complete loan application: ${errMsg}. Local state has been restored.`,
      });
    }

    setTimeout(() => setFeedback(null), 6000);
  };

  const activeLoan = loans[0];
  const totalPrincipal = activeLoan ? activeLoan.amount : 0;
  const monthlyEMI = activeLoan ? activeLoan.monthly_installment : 0;
  const totalInstallments = activeLoan ? activeLoan.installment_count : 10;
  const remainingInstallments = Math.max(1, totalInstallments - 2);

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR Loans & Tour Plan Expense Claims"
        subtitle="Manage company staff loans, festival advance deductions, and official tour DA/TA reimbursements"
        badge={
          <Badge variant="default" className="gap-1.5 font-bold">
            <PiggyBank className="h-3.5 w-3.5 text-blue-700" /> BLA Loan Facility Active
          </Badge>
        }
        action={
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm shadow-blue-600/30"
          >
            Apply for HR Loan
          </Button>
        }
      />

      {feedback && (
        <Banner
          variant={feedback.variant}
          title={feedback.title}
          description={feedback.message}
          isDismissible
          onClose={() => setFeedback(null)}
        />
      )}

      {/* KPI Stats Overview */}
      <LoansClaimsStats
        totalLoanPrincipal={totalPrincipal}
        monthlyEMI={monthlyEMI}
        remainingInstallments={remainingInstallments}
        totalInstallments={totalInstallments}
      />

      {/* Active Loans Table */}
      <CardWrapper
        title="HR Loan & Advance Applications"
        description="Records of applied, approved and active company payroll deduction loans"
      >
        {loans.length === 0 ? (
          <EmptyState
            title="No loan applications found"
            description="You do not have any active or past HR loans on record."
            icon={<PiggyBank className="h-6 w-6 text-slate-400" />}
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Apply for Loan
              </Button>
            }
            className="my-4"
          />
        ) : (
          <>
            <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                <tr>
                  <th className="py-3.5 px-4">Application ID</th>
                  <th className="py-3.5 px-4">Loan Principal</th>
                  <th className="py-3.5 px-4">Tenure</th>
                  <th className="py-3.5 px-4">Monthly EMI</th>
                  <th className="py-3.5 px-4">Disbursement Mode</th>
                  <th className="py-3.5 px-4">Purpose</th>
                  <th className="py-3.5 px-4">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {paginatedLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-100/70 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-950 font-mono">
                      #LOAN-0{loan.id}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-950 font-mono text-sm">
                      ৳{loan.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {loan.installment_count} Months
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-950 font-mono text-sm">
                      ৳{loan.monthly_installment.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      Bank: ৳{loan.bank_value.toLocaleString()} | Cash: ৳{loan.cash_value.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium max-w-xs truncate">
                      {loan.purpose}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold shadow-2xs",
                          loan.status === "Active" || loan.status === "Approved"
                            ? "bg-emerald-700 text-white"
                            : loan.status === "Pending"
                            ? "bg-amber-600 text-white"
                            : "bg-rose-700 text-white"
                        )}
                      >
                        {loan.status}
                      </span>
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
                {Math.min(currentPage * pageSize, loans.length)} of {loans.length} applications
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

      {/* Tour Plan Expense Claims */}
      <CardWrapper
        title="Tour Plan & Travel Expense Reimbursements"
        description="Daily allowances (DA), transportation, and lodging vouchers"
      >
        {claims.length === 0 ? (
          <EmptyState
            title="No expense claims found"
            description="You have not submitted any travel or tour plan expense vouchers."
            icon={<Receipt className="h-6 w-6 text-slate-900" />}
            className="my-4"
          />
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                <tr>
                  <th className="py-3 px-4">Voucher No</th>
                  <th className="py-3 px-4">Tour Route</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Food & DA</th>
                  <th className="py-3 px-4">Hotel / Lodging</th>
                  <th className="py-3 px-4">Total Claim</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {claims.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-100/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-950">{c.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-slate-900" />
                      {c.route}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{c.date}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">৳{c.food.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">৳{c.rent.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      ৳{c.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">Approved</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardWrapper>

      {/* Loan Request Modal */}
      <LoanRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplyLoan}
        isLoading={isApplying}
      />
    </div>
  );
}
