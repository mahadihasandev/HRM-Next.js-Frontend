export interface ApplyLoanRequest {
  amount: number | string;
  installment_count: number | string;
  applicable_month?: string;
  purpose: string;
  cash_value?: number;
  bank_value?: number;
}

export interface HrLoanApiItem {
  id: number;
  amount: number;
  installment_count: number;
  monthly_installment: number;
  applicable_month: string;
  purpose: string;
  cash_value: number;
  bank_value: number;
  status: "Pending" | "Approved" | "Active" | "Repaid" | "Rejected" | string;
  applied_at: string;
}

export interface LoanActionResponse {
  success: boolean;
  message: string;
  loan_id?: number;
}
