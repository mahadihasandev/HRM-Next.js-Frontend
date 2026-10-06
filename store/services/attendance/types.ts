export interface MobilePunchRequest {
  latitude: number;
  longitude: number;
  note?: string;
  punch_type?: "in" | "out" | string;
}

export interface TodayAttendanceData {
  date: string;
  total_employees: number;
  present: number;
  late: number;
  absent: number;
  on_leave: number;
  attendance_rate?: string;
}

export interface PunchResponse {
  success: boolean;
  message: string;
  punch_time?: string;
  is_in?: boolean;
}

export interface EmployeeTodayAttendanceItem {
  id: number;
  employee_full_id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  company: string;
  status: "Present" | "Late" | "Leave" | "Absent" | string;
  in_time: string | null;
  out_time: string | null;
  working_hours: string | null;
  overtime_hours: string | null;
  late_minutes: number;
  punch_source: string;
  location: string;
  shift: string;
}

export interface AllEmployeesTodayAttendanceResponse {
  date: string;
  summary: {
    total: number;
    present: number;
    late: number;
    leave: number;
    absent: number;
    attendance_rate: string;
  };
  data: EmployeeTodayAttendanceItem[];
  total: number;
}

