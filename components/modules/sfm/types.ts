export interface TargetCommitmentDetail {
  detail_id: number;
  commitment_value: number;
  product_category?: string;
  target_qty?: number;
  achieved_qty?: number;
}

export interface TargetCommitment {
  id: number;
  employee_id: number;
  employee_name: string;
  code: string;
  territory: string;
  month: string;
  target_value: number;
  commitment_value: number;
  actual_sales: number;
  pcmo_commitment: number;
  hddo_commitment: number;
  details?: TargetCommitmentDetail[];
}

export interface SfmShopVisit {
  id: number;
  sr_name: string;
  shop_name: string;
  thana: string;
  check_in_time: string;
  order_booked: boolean;
  order_value: number;
  non_order_reason?: string;
}

export interface SfmReasonItem {
  id: number;
  reason: string;
  count: number;
  percentage: number;
}

export interface SfmAttendanceRecord {
  id: number;
  date: string;
  sr_name: string;
  territory: string;
  in_time: string;
  out_time: string;
  status: string;
}
