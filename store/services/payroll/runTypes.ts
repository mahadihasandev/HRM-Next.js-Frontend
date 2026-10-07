export const earningFields = [
  "basic_salary",
  "house_rent",
  "medical_allowance",
  "conveyance",
  "food_allowance",
  "attendance_bonus",
  "production_bonus",
  "festival_bonus",
] as const;
export const deductionFields = [
  "absence_deduction",
  "loan_deduction",
  "pf_deduction",
  "tax_deduction",
  "other_deductions",
] as const;
export const numberFields = [
  ...earningFields,
  ...deductionFields,
  "overtime_hours",
  "overtime_rate",
] as const;
export const textFields = [
  "employee_full_id",
  "factory",
  "section",
  "line",
  "grade",
  "bank_name",
  "bank_account_no",
  "routing_no",
  "payment_method",
] as const;
export const importFields = [
  ...textFields,
  ...numberFields,
  "net_payable",
] as const;
export type ImportField = (typeof importFields)[number];
export type ImportRow = Partial<Record<ImportField, string | number>>;
export type PayrollItem = Record<(typeof numberFields)[number], number> & {
  id?: number;
  employee_full_id: string;
  employee_name: string;
  department: string;
  designation: string;
  factory: string;
  section: string;
  line: string;
  grade: string;
  bank_name: string;
  bank_account_no: string;
  routing_no: string;
  payment_method: "bank" | "cash";
  overtime_amount: number;
  total_earnings: number;
  total_deductions: number;
  net_payable: number;
};
export interface PayrollSummary {
  employees: number;
  total_earnings: number;
  total_deductions: number;
  net_payable: number;
  overtime_amount: number;
  bank_total: number;
  cash_total: number;
}
export interface PayrollImport {
  month: string;
  title: string;
  source_name?: string;
  rows: ImportRow[];
  company_address: string;
  bank_name: string;
  bank_branch: string;
  debit_account: string;
  signatory: string;
  signatory_title: string;
}
export interface PayrollPreview {
  rows: PayrollItem[];
  valid: boolean;
  summary: PayrollSummary;
  errors: { row: number; employee_full_id: string; messages: string[] }[];
}
export interface PayrollRun extends Omit<PayrollImport, "rows"> {
  id: number;
  company_name: string;
  status: "draft" | "approved" | "paid";
  items: PayrollItem[];
  summary: PayrollSummary;
  created_at: string;
  created_by: number;
  approved_by: number | null;
  approved_at: string | null;
  payment_date: string | null;
  payment_reference: string | null;
  attachments: { id: number; name: string; size: number; created_at: string }[];
}

export interface LegacyPayslip {
  id: number;
  month: string;
  employee_full_id: string;
  employee_name: string;
  department: string;
  designation: string;
  company: string;
  basic_salary: number;
  house_rent: number;
  medical_allowance: number;
  conveyance: number;
  special_allowance: number;
  overtime_amount: number;
  pf_deduction: number;
  tax_deduction: number;
  loan_deduction: number;
  other_deductions: number;
  total_earnings: number;
  total_deductions: number;
  net_payable: number;
  payment_method: string;
  payment_date: string | null;
  status: string;
}
