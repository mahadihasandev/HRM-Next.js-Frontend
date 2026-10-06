export interface SndDashboardData {
  total_customers: number;
  active_depots: number;
  today_orders_count: number;
  today_order_value: number;
  monthly_sales_target: number;
  monthly_achievement: number;
  outlet_coverage_rate: string;
  top_products: Array<{ id: number; name: string; units: number; sales: number }>;
}

export interface CustomerItem {
  id: number;
  code: string;
  name: string;
  phone: string;
  email?: string;
  depot_id?: number;
  depot_name: string;
  customer_type_id?: number;
  customer_type: string;
  owner_name: string;
  owner_phone?: string;
  shop_size?: string;
  thana_id?: number;
  thana: string;
  address: string;
  lat: string;
  long: string;
  status: string;
}

export interface SalesOrderItem {
  id: number;
  order_no: string;
  date: string;
  customer_name: string;
  depot_name: string;
  subtotal: number;
  discount: number;
  payable_amount: number;
  status: "Pending Approval" | "Approved" | "Rejected";
  sr_name: string;
  items_count?: number;
}

export interface DepotItem {
  id: number;
  name: string;
  code: string;
  location?: string;
  division?: string;
  is_active?: boolean;
}

export interface CustomerTypeItem {
  id: number;
  name: string;
  description?: string;
  discount_rate?: number;
}

export interface SndProductItem {
  id: number;
  code: string;
  name: string;
  category: string;
  pack_size?: string;
  unit_price: number;
  stock_qty?: number;
}

export interface PunchSndSalesPayload {
  customer_id: number;
  amount?: number;
  payment_mode?: "Cash" | "Credit" | "Cheque" | "MFS" | string;
  latitude?: number | string;
  longitude?: number | string;
  comment?: string;
  items?: Array<{
    product_id: number;
    qty: number;
    unit_price: number;
  }>;
}

export interface StoreSndSalesOrderPayload {
  customer_id: number;
  depot_id?: number;
  payable_amount?: number;
  subtotal?: number;
  discount?: number;
  date?: string;
  remarks?: string;
  notes?: string;
  items?: Array<{
    product_id: number;
    quantity: number;
    unit_price: number;
  }>;
}

export interface SalesOrderActionResponse {
  success: boolean;
  message: string;
  order_id?: number;
}

export interface SrOutletVisitReportItem {
  id: number;
  sr_name: string;
  customer_name: string;
  visit_time: string;
  outcome: string;
  notes?: string;
}

export interface SrMarketOrderReportItem {
  id: number;
  order_no: string;
  sr_name: string;
  customer_name: string;
  amount: number;
  date: string;
  status: string;
}
