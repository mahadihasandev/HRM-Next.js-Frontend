import React from "react";
import { PiggyBank, CreditCard, CalendarCheck } from "lucide-react";
import { StatCard } from "@/components/shared";

interface LoansClaimsStatsProps {
  totalLoanPrincipal: number;
  monthlyEMI: number;
  remainingInstallments: number;
  totalInstallments: number;
}

export function LoansClaimsStats({
  totalLoanPrincipal,
  monthlyEMI,
  remainingInstallments,
  totalInstallments,
}: LoansClaimsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard
        title="Active Loan Principal"
        value={`৳${totalLoanPrincipal.toLocaleString()}`}
        subtitle="Applied: Sep 10, 2026"
        variant="blue"
        icon={<PiggyBank className="h-5 w-5" />}
      />

      <StatCard
        title="Monthly Deduction (EMI)"
        value={`৳${monthlyEMI.toLocaleString()} / mo`}
        subtitle="Deducted from monthly payroll"
        variant="indigo"
        icon={<CreditCard className="h-5 w-5" />}
      />

      <StatCard
        title="Repayment Schedule"
        value={`${remainingInstallments} of ${totalInstallments} Remaining`}
        subtitle={`${Math.round(((totalInstallments - remainingInstallments) / totalInstallments) * 100)}% repaid`}
        variant="emerald"
        icon={<CalendarCheck className="h-5 w-5" />}
      />
    </div>
  );
}
