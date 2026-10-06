import { baseApi } from "../baseApi";
import { ApiResponse } from "../types";
import {
  SndDashboardData,
  CustomerItem,
  SalesOrderItem,
  DepotItem,
  CustomerTypeItem,
  SndProductItem,
  PunchSndSalesPayload,
  StoreSndSalesOrderPayload,
  SalesOrderActionResponse,
  SrOutletVisitReportItem,
  SrMarketOrderReportItem,
} from "./types";

export const sndApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSndDashboard: builder.query<ApiResponse<SndDashboardData>, void>({
      query: () => "/snd/dashboard",
      providesTags: ["SndDashboard"],
    }),

    getSndDepots: builder.query<ApiResponse<DepotItem[]>, { search?: string } | void>({
      query: (params) => ({
        url: "/snd/setups/depots",
        params: params || {},
      }),
    }),

    getSndCustomerTypes: builder.query<ApiResponse<CustomerTypeItem[]>, void>({
      query: () => "/snd/setups/customer-types",
    }),

    getSndCustomers: builder.query<ApiResponse<CustomerItem[]>, { thana_id?: number } | void>({
      query: (params) => ({
        url: "/snd/customers",
        params: params || {},
      }),
      providesTags: ["SndCustomers"],
    }),

    storeSndCustomer: builder.mutation<ApiResponse<CustomerItem>, Partial<CustomerItem>>({
      query: (body) => ({
        url: "/snd/customers/store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SndCustomers", "SndDashboard"],
    }),

    punchSndSales: builder.mutation<ApiResponse<SalesOrderActionResponse>, PunchSndSalesPayload>({
      query: (body) => ({
        url: "/snd/sales/punch",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SndDashboard", "SfmVisits"],
    }),

    getSndSalesOrders: builder.query<ApiResponse<SalesOrderItem[]>, { search?: string } | void>({
      query: (params) => ({
        url: "/snd/sales-orders",
        params: params || {},
      }),
      providesTags: ["SndOrders"],
    }),

    storeSndSalesOrder: builder.mutation<ApiResponse<SalesOrderActionResponse>, StoreSndSalesOrderPayload>({
      query: (body) => ({
        url: "/snd/sales-orders/store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SndOrders", "SndDashboard"],
    }),

    approveSndSalesOrder: builder.mutation<ApiResponse<SalesOrderActionResponse>, number>({
      query: (id) => ({
        url: `/snd/sales-orders/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["SndOrders", "SndDashboard"],
    }),

    rejectSndSalesOrder: builder.mutation<ApiResponse<SalesOrderActionResponse>, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/snd/sales-orders/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["SndOrders", "SndDashboard"],
    }),

    getSndProducts: builder.query<ApiResponse<SndProductItem[]>, void>({
      query: () => "/snd/sales-orders/products",
    }),

    getSrOutletVisitReport: builder.query<ApiResponse<SrOutletVisitReportItem[]>, { to_date?: string } | void>({
      query: (params) => ({
        url: "/snd/sr-outlet-visit-report",
        params: params || {},
      }),
    }),

    getSrMarketOrderReport: builder.query<ApiResponse<SrMarketOrderReportItem[]>, { to_date?: string } | void>({
      query: (params) => ({
        url: "/snd/sr-market-order-report",
        params: params || {},
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSndDashboardQuery,
  useGetSndDepotsQuery,
  useGetSndCustomerTypesQuery,
  useGetSndCustomersQuery,
  useStoreSndCustomerMutation,
  usePunchSndSalesMutation,
  useGetSndSalesOrdersQuery,
  useStoreSndSalesOrderMutation,
  useApproveSndSalesOrderMutation,
  useRejectSndSalesOrderMutation,
  useGetSndProductsQuery,
  useGetSrOutletVisitReportQuery,
  useGetSrMarketOrderReportQuery,
} = sndApi;
