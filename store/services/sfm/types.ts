export interface SfmTargetDashboardData {
  current_month: string;
  total_assigned_target: number;
  total_commitment_value: number;
  achieved_value_to_date: number;
  achievement_rate: string;
  total_field_force: number;
  top_performers: Array<{ name: string; target: number; achieved: number; rate: string }>;
}

export interface TargetCommitmentItem {
  id: number;
  employee_id: number;
  employee_name: string;
  code: string;
  territory: string;
  month: string;
  target_value: number;
  commitment_value: number;
  actual_sales: number;
  details?: Array<{
    detail_id: number;
    product_category: string;
    target_qty: number;
    commitment_value: number;
    achieved_qty: number;
  }>;
}

export interface SfmDivisionItem {
  id: number;
  name: string;
  code?: string;
}

export interface SfmRegionItem {
  id: number;
  division_id: number;
  name: string;
  code?: string;
}

export interface SfmZoneItem {
  id: number;
  region_id: number;
  name: string;
  code?: string;
}

export interface SfmBaseItem {
  id: number;
  zone_id: number;
  name: string;
  code?: string;
}

export interface SfmThanaItem {
  id: number;
  base_id: number;
  name: string;
  code?: string;
}

export interface CommitmentDetailInput {
  detail_id?: number;
  product_category?: string;
  target_qty?: number;
  commitment_value: number;
  achieved_qty?: number;
}

export interface UpdateCommitmentPayload {
  id: number;
  details: CommitmentDetailInput[];
}

export interface ShopVisitingReportItem {
  id: number;
  shop_name: string;
  sr_name: string;
  date: string;
  checkin_time: string;
  checkout_time?: string;
  status: string;
  remarks?: string;
}

export interface ShopSummaryData {
  total_shops: number;
  visited_today: number;
  planned_visits: number;
  conversion_rate: string;
}

export interface SrSummaryItem {
  sr_id: number;
  sr_name: string;
  total_visits: number;
  productive_visits: number;
  order_value: number;
}

export interface ReasonBreakdownItem {
  reason: string;
  count: number;
  percentage: number;
}

export interface DateWiseAttendanceItem {
  date: string;
  present_count: number;
  absent_count: number;
  late_count: number;
}

export interface SfmEmployeeItem {
  id: number;
  name: string;
  code: string;
  designation: string;
  territory: string;
  phone?: string;
}

export interface SfmActionResponse {
  success: boolean;
  message: string;
}
