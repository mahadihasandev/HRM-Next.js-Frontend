export interface TourPlanItem {
  id: number;
  month: string;
  employee_id: number;
  employee_name: string;
  status: string;
  total_working_days: number;
  tour_days: number;
  base_station: string;
  created_at: string;
}

export interface TourClaimItem {
  id: number;
  claim_no: string;
  month: string;
  date: string;
  employee_name: string;
  da_amount: number;
  ta_amount: number;
  total_amount: number;
  status: string;
}

export interface WorkTypeItem {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export interface TransportTypeItem {
  id: number;
  name: string;
  rate_per_km?: number;
  description?: string;
}

export interface StoreTourPlanPayload {
  month: string;
  employee_id: number;
  base_station: string;
  days?: Array<{
    date: string;
    work_type_id: number;
    transport_type_id: number;
    station: string;
    objectives?: string;
  }>;
}

export interface PunchPlanPayload {
  plan_id: number;
  punch_date: string;
  latitude: number;
  longitude: number;
  note?: string;
}

export interface StoreTourClaimPayload {
  tour_plan_id: number;
  month: string;
  claim_date: string;
  da_amount: number;
  ta_amount: number;
  hotel_fare?: number;
  miscellaneous?: number;
  remarks?: string;
}

export interface TourPlanActionResponse {
  success: boolean;
  message: string;
  id?: number;
}
