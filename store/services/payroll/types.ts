export interface PayslipQueryParams {
  month?: string;
  employee_id?: number;
}

export interface PayslipData {
  id: number;
  month: string;
  employee_name: string;
  employee_full_id: string;
  designation: string;
  department: string;
  basic_salary: number;
  house_rent: number;
  medical_allowance: number;
  conveyance: number;
  total_earnings: number;
  pf_deduction: number;
  tax_deduction: number;
  loan_deduction: number;
  total_deductions: number;
  net_payable: number;
  payment_method: string;
  payment_date: string;
  status: string;
}
