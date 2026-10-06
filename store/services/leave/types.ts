export interface ApplyLeaveRequest {
  leave_type_id: number | string;
  from_date: string;
  to_date: string;
  reason: string;
  emergency_phone?: string;
}

export interface LeaveTypeItem {
  id: number;
  name: string;
  days_allowed: number;
  code?: string;
  description?: string;
}

export interface LeaveApplicationItem {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_full_id: string;
  leave_type: string;
  leave_type_id: number;
  from_date: string;
  to_date: string;
  days_count: number;
  reason: string;
  emergency_phone?: string;
  status: string;
  applied_at: string;
  recommended_by?: string;
  approved_by?: string;
}

export interface LeaveApplicationResponse {
  success: boolean;
  message: string;
  id?: number;
}
