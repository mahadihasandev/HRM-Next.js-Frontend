export interface Employee {
  id: number | string;
  employee_id: number | string;
  employee_full_id: string;
  name: string;
  email: string;
  phone_number?: string;
  personal_phone_number?: string;
  designation: string;
  department: string;
  company: string;
  avatar?: string;
  date_of_birth?: string;
  joining_date?: string;
  status: "Active" | "Inactive" | "On Leave";
  blood_group?: string;
  gender?: string;
  marital_status?: string;
  religion?: string;
  present_address?: string;
  permanent_address?: string;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  bank_name?: string;
  bank_account_no?: string;
  branch_name?: string;
  routing_name?: string;
  salary?: {
    basic: number;
    house_rent: number;
    medical_allowance: number;
    conveyance: number;
    gross: number;
    pf_deduction: number;
    tax_deduction: number;
    net_payable: number;
  };
}

export interface AttendanceRecord {
  id: string | number;
  date: string;
  in_time: string;
  out_time?: string;
  status: "Present" | "Late" | "Absent" | "Leave" | "Holiday";
  working_hours?: string;
  overtime_hours?: string;
  location?: string;
  punch_source?: "Web" | "Mobile App" | "Biometric";
}

export interface LeaveApplication {
  id: number | string;
  employee_id: number | string;
  employee_name: string;
  employee_full_id: string;
  leave_type: string;
  leave_type_id: number;
  from_date: string;
  to_date: string;
  days_count: number;
  reason: string;
  emergency_phone?: string;
  status: "Pending Recommend" | "Pending 2nd Recommend" | "Pending Approve" | "Approved" | "Rejected" | "Cancelled";
  applied_at: string;
  recommended_by?: string;
  approved_by?: string;
  recommend_note?: string;
  approve_note?: string;
}

export interface ShortLeaveApplication {
  id: number | string;
  employee_name: string;
  leave_day: string;
  leave_type: "early" | "delay";
  early_out_time?: string;
  delay_in_time?: string;
  reason: string;
  emergency_phone?: string;
  status: "Pending Recommend" | "Pending 2nd Recommend" | "Pending Approve" | "Approved" | "Rejected" | string;
}

export interface LateRequest {
  id: number | string;
  iom_type: string;
  iom_type_name?: string;
  employee_name?: string;
  date: string;
  in_time: string;
  out_time: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected" | string;
}

export interface ShiftExchangeApplication {
  id: number | string;
  employee_name: string;
  current_shift: string;
  target_shift: string;
  exchange_date: string;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface OutworkApplication {
  id: number | string;
  date: string;
  start_time: string;
  return_time: string;
  not_return: boolean;
  note: string;
  status: "Pending Recommend" | "Pending 2nd Recommend" | "Pending Approve" | "Approved" | "Rejected";
}

export interface PayslipRecord {
  id: number | string;
  month: string;
  employee_name: string;
  employee_full_id: string;
  designation: string;
  department: string;
  basic_salary: number;
  house_rent: number;
  medical_allowance: number;
  conveyance: number;
  special_allowance: number;
  overtime_hours?: number;
  overtime_rate?: number;
  overtime_amount?: number;
  overtime_formatted?: string;
  total_earnings: number;
  pf_deduction: number;
  tax_deduction: number;
  loan_deduction: number;
  other_deductions: number;
  total_deductions: number;
  net_payable: number;
  payment_method: "Bank Transfer" | "Cash" | "Cheque";
  payment_date: string;
  status: "Paid" | "Pending" | "Processing";
}

export interface HRLoanRecord {
  id: number | string;
  amount: number;
  installment_count: number;
  monthly_installment: number;
  applicable_month: string;
  purpose: string;
  cash_value: number;
  bank_value: number;
  status: "Pending" | "Approved" | "Active" | "Repaid" | "Rejected";
  applied_at: string;
}

export interface NoticeItem {
  id: number | string;
  title: string;
  description: string;
  publish_at: string;
  expire_at: string;
  department: string;
  company: string;
  priority: "High" | "Normal" | "Urgent";
}

/** Generic API Response wrapper */
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  total?: number;
  message?: string;
}

/** Database/API Raw representation of an Employee */
export interface EmployeeApiRecord {
  id: number;
  employee_id?: number | string;
  employee_full_id: string;
  name: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  personal_phone?: string;
  personal_phone_number?: string;
  designation: string;
  department: string;
  company: string;
  company_id?: number;
  status?: "Active" | "Inactive" | "On Leave" | string;
  blood_group?: string;
  gender?: string;
  marital_status?: string;
  religion?: string;
  date_of_birth?: string;
  joining_date?: string;
  present_address?: string;
  permanent_address?: string;
  father_name?: string;
  mother_name?: string;
  bank_name?: string;
  bank_account_no?: string;
  branch_name?: string;
  routing_name?: string;
  basic_salary?: number | string;
  house_rent?: number | string;
  medical_allowance?: number | string;
  conveyance?: number | string;
  gross_salary?: number | string;
  pf_deduction?: number | string;
  tax_deduction?: number | string;
  net_payable?: number | string;
}

/** Payload used to register a new Employee */
export interface CreateEmployeePayload {
  name: string;
  designation: string;
  department: string;
  email?: string;
  phone?: string;
  blood_group?: string;
  gender?: "Male" | "Female" | "Other";
  marital_status?: "Single" | "Married" | "Other";
  basic_salary?: number;
  joining_date?: string;
  present_address?: string;
  bank_name?: string;
  bank_account_no?: string;
  password?: string;
  verification_code?: string;
  is_verified?: boolean;
}

/** Payload used to update an existing Employee */
export interface UpdateEmployeePayload {
  name?: string;
  designation?: string;
  department?: string;
  email?: string;
  phone?: string;
  personal_phone?: string;
  status?: "Active" | "Inactive" | "On Leave";
  blood_group?: string;
  gender?: "Male" | "Female" | "Other";
  marital_status?: "Single" | "Married" | "Other";
  religion?: string;
  basic_salary?: number;
  date_of_birth?: string;
  joining_date?: string;
  present_address?: string;
  permanent_address?: string;
  father_name?: string;
  mother_name?: string;
  bank_name?: string;
  bank_account_no?: string;
}

/** Field Force Sales Representative (SR) */
export interface SalesRepresentative {
  id: number;
  code: string;
  name: string;
  designation: string;
  territory: string;
  phone: string;
  monthly_target: number;
  achievement: number;
  active: boolean;
}

/** Payload to assign/create an SR */
export interface CreateSrPayload {
  name: string;
  code: string;
  designation: string;
  territory: string;
  phone: string;
  monthly_target: number;
}

/** Database/API representation of Notice Announcement */
export interface NoticeApiRecord {
  id: number;
  title: string;
  description: string;
  publish_at: string;
  expire_at?: string;
  department?: string;
  company?: string;
  priority?: "High" | "Normal" | "Urgent";
  created_at?: string;
}

/** Database/API representation of Payslip Record */
export interface PayslipApiRecord {
  id: number;
  month?: string;
  employee_name?: string;
  employee_full_id?: string;
  designation?: string;
  department?: string;
  basic_salary?: number;
  house_rent?: number;
  medical_allowance?: number;
  conveyance?: number;
  overtime_hours?: number;
  overtime_rate?: number;
  overtime_amount?: number;
  overtime_formatted?: string;
  total_earnings?: number;
  pf_deduction?: number;
  tax_deduction?: number;
  loan_deduction?: number;
  total_deductions?: number;
  net_payable?: number;
  payment_date?: string;
  payment_method?: "Bank Transfer" | "Cash" | "Cheque";
  bank_name?: string;
  account_number?: string;
  status?: "Paid" | "Pending" | "Processing";
}

/** Database/API representation of Leave Application */
export interface LeaveApiRecord {
  id: number;
  employee_id?: number;
  employee_name?: string;
  employee_full_id?: string;
  leave_type?: string;
  leave_type_id?: number;
  from_date: string;
  to_date: string;
  days_count?: number;
  reason?: string;
  emergency_phone?: string;
  status?: "Pending Recommend" | "Pending 2nd Recommend" | "Pending Approve" | "Approved" | "Rejected" | "Cancelled";
  applied_at?: string;
  recommended_by?: string;
  approved_by?: string;
}

/** Database/API representation of Attendance Log */
export interface AttendanceApiRecord {
  id?: number;
  employee_id?: number;
  employee_full_id?: string;
  date: string;
  in_time?: string;
  out_time?: string;
  status?: "Present" | "Late" | "Absent" | "Leave" | "Holiday";
  location?: string;
  punch_source?: "Web" | "Mobile App" | "Biometric";
  working_hours?: string;
  overtime_hours?: string;
}

/** Definition of a system permission */
export interface PermissionItem {
  id: number;
  key: string;
  name: string;
  module: string;
  category: "navigation" | "action";
  description?: string;
}

/** Full permission profile for an employee */
export interface EmployeePermissionProfile {
  employee: {
    id: number | string;
    employee_full_id: string;
    name: string;
    designation: string;
    department: string;
    company: string;
    status: string;
  };
  department_defaults: Record<string, boolean>;
  custom_overrides: Record<string, boolean>;
  effective_permissions: Record<string, boolean>;
}

/** Payload used to update employee permissions */
export interface UpdatePermissionsPayload {
  permissions?: Record<string, boolean>;
  permission_key?: string;
  is_granted?: boolean;
  granted_by?: string;
  operator_id?: string;
}

/** Overtime System Types */
export interface OvertimeEmployeeItem {
  id: number;
  employee_id: number;
  employee_full_id: string;
  name: string;
  designation: string;
  department: string;
  basic_salary: number;
  gross_salary: number;
  overtime_rate: number;
  active_effective_rate: number;
  bla_standard_rate: number;
  is_custom_rate: boolean;
  overtime_eligible: boolean;
  month: string;
  overtime_minutes: number;
  overtime_hours: number;
  overtime_formatted: string;
  overtime_earnings: number;
}

export interface OvertimeRatesSummary {
  total_employees: number;
  total_overtime_hours: number;
  total_overtime_formatted: string;
  total_overtime_cost: number;
  average_hourly_rate: number;
}

export interface OvertimeRatesData {
  month: string;
  summary: OvertimeRatesSummary;
  employees: OvertimeEmployeeItem[];
}

export interface SetOvertimeRatePayload {
  employee_full_id: string;
  overtime_rate: number;
  reason?: string;
  operator_id?: string;
}

export interface OvertimeRateLogItem {
  id: number;
  employee_full_id: string;
  employee_name: string;
  previous_rate: number;
  new_rate: number;
  changed_by_id: string;
  changed_by_name: string;
  changed_by_role: string;
  reason?: string;
  created_at: string;
}

/** Accounting & Finance Module Types */
export type AccountCategory = "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";

export interface AccountHead {
  code: string;
  name: string;
  banglaName?: string;
  category: AccountCategory;
  balance: number;
  parentCode?: string;
  status: "Active" | "Inactive";
}

export type VoucherType = "JV" | "CPV" | "BPV" | "CRV" | "BRV";

export interface VoucherItem {
  id: string;
  voucherNo: string;
  date: string;
  type: VoucherType;
  accountCode: string;
  accountName: string;
  narration: string;
  debit: number;
  credit: number;
  status: "Posted" | "Approved" | "Pending";
  taxTdsDeduction?: number;
  vatVdsDeduction?: number;
  createdBy: string;
  approvedBy?: string;
  attachmentUrl?: string;
}

export interface PayrollTaxReconciliation {
  month: string;
  totalGrossSalary: number;
  totalBasicSalary: number;
  totalPfDeduction: number;
  totalTaxTds: number;
  totalNetDisbursed: number;
  bankName: string;
  bankAccountNo: string;
  challanNo?: string;
  paymentStatus: "Disbursed" | "Pending" | "Processing";
}

export interface AccountingSummary {
  totalRevenue: number;
  operatingExpenses: number;
  netProfit: number;
  accountsReceivable: number;
  accountsPayable: number;
  totalTdsVdsPayable: number;
  cashAndBankBalance: number;
}

/** Daily Work & Employee Appointment Types */
export interface DailyWorkItem {
  id: number;
  date: string;
  description: string;
  tasks: Array<{
    description: string;
    startTime: string;
    finishTime: string;
    status: "Pending" | "Waiting" | "Finish";
  }>;
  communications: Array<{
    organization: string;
    contactPerson: string;
    phone: string;
    purpose: string;
    status: "Pending" | "Waiting" | "Finish";
  }>;
  appointments: Array<{
    organization: string;
    contactPerson: string;
    phone: string;
    purpose: string;
    status: "Pending" | "Waiting" | "Finish";
  }>;
}

/** Training & HR Development Types */
export interface TrainingProgramItem {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  venue: string;
  duration: string;
  trainer: string;
  status: "Active" | "Completed" | "Upcoming";
  enrolledCount: number;
  message?: string;
}


