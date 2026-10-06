export interface DashboardMetrics {
  total_employees: number;
  present_today: number;
  late_today: number;
  on_leave_today: number;
  absent_today: number;
  attendance_rate: string;
  pending_leave_requests: number;
  pending_claims_count: number;
  weekly_attendance: Array<{ day: string; present: number; late: number; leave: number }>;
  pending_tasks?: {
    leave_recommendations?: number;
    leave_approvals?: number;
    late_requests?: number;
    short_leaves?: number;
    outworks?: number;
    loan_applications?: number;
  };
}
