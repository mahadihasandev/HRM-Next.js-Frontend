"use client";
import { useState } from "react";
import { Button } from "@/components/shared";
import { PayrollWorkspace } from "./PayrollWorkspace";
import { PreviousPayslips } from "./PreviousPayslips";
import { ManageOvertimeModal } from "./ManageOvertimeModal";
interface SalaryPayrollViewProps {
  currentOperator?: {
    id: number | string;
    fullId: string;
    name: string;
    department: string;
  };
  isAdmin?: boolean;
  canManagePayroll?: boolean;
}
export function SalaryPayrollView({
  isAdmin = false,
  canManagePayroll = false,
  currentOperator,
}: SalaryPayrollViewProps) {
  const [history, setHistory] = useState(false);
  const [overtime, setOvertime] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!history ? "secondary" : "ghost"}
          onClick={() => setHistory(false)}
        >
          Payroll batches
        </Button>
        <Button
          variant={history ? "secondary" : "ghost"}
          onClick={() => setHistory(true)}
        >
          Previous payslips
        </Button>
        {currentOperator && (
          <Button variant="ghost" onClick={() => setOvertime(true)}>
            Overtime rates
          </Button>
        )}
      </div>
      {history ? (
        <PreviousPayslips />
      ) : (
        <PayrollWorkspace canManage={isAdmin || canManagePayroll} />
      )}
      {currentOperator && (
        <ManageOvertimeModal
          isOpen={overtime}
          onClose={() => setOvertime(false)}
          operator={currentOperator}
        />
      )}
    </div>
  );
}
