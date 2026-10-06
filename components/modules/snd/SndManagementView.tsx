"use client";

import React, { useState } from "react";
import {
  Store,
  ShoppingCart,
  MapPin,
  Plus,
  Navigation,
} from "lucide-react";
import {
  CardWrapper,
  Title,
  Subtitle,
  Badge,
  Button,
  Banner,
} from "@/components/shared";
import {
  useGetSndDashboardQuery,
  useGetSndCustomersQuery,
  useStoreSndCustomerMutation,
  useGetSndSalesOrdersQuery,
  useStoreSndSalesOrderMutation,
  useApproveSndSalesOrderMutation,
  useRejectSndSalesOrderMutation,
  usePunchSndSalesMutation,
} from "@/store/services/snd";

import { Customer, SalesOrder, SndVisit, SndProductItem } from "./types";
import { SndMetrics } from "./SndMetrics";
import { SndCustomerTable } from "./SndCustomerTable";
import { SndOrderTable } from "./SndOrderTable";
import { SndVisitTable } from "./SndVisitTable";
import { RegisterCustomerModal } from "./RegisterCustomerModal";
import { CreateOrderModal } from "./CreateOrderModal";
import { LogVisitModal } from "./LogVisitModal";

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 63,
    code: "CUS-09184",
    name: "CodeTap Distributors",
    phone: "01712345678",
    email: "support@codetap.org",
    depot_name: "D-Mirpur Central Depot",
    customer_type: "Authorized Distributor",
    owner_name: "Md. Kabirul Islam",
    thana: "Mirpur",
    address: "Plot 12, Road 4, Section 10, Mirpur, Dhaka",
    lat: "23.8067",
    long: "90.3687",
    status: "Active",
  },
  {
    id: 64,
    code: "CUS-09185",
    name: "Bengal Lubricants Hub",
    phone: "01819876543",
    email: "info@bengallube.com",
    depot_name: "D-Uttara Regional Depot",
    customer_type: "Wholesale Stockist",
    owner_name: "Sajjad Hossain",
    thana: "Uttara",
    address: "House 24, Sector 7, Uttara, Dhaka",
    lat: "23.8759",
    long: "90.3795",
    status: "Active",
  },
  {
    id: 65,
    code: "CUS-09186",
    name: "Shahjalal Auto Care",
    phone: "01912389123",
    email: "shahjalal.auto@gmail.com",
    depot_name: "D-Mirpur Central Depot",
    customer_type: "Retail Outlet / Workshop",
    owner_name: "Shahidul Alam",
    thana: "Mirpur",
    address: "Darussalam Road, Technical Mor, Mirpur",
    lat: "23.7808",
    long: "90.3516",
    status: "Active",
  },
];

const INITIAL_ORDERS: SalesOrder[] = [
  {
    id: 101,
    order_no: "SO-DPT-8472",
    date: "2026-10-02",
    customer_name: "CodeTap Distributors",
    depot_name: "D-Mirpur Central Depot",
    subtotal: 47500,
    discount: 2375,
    payable_amount: 45125,
    status: "Approved",
    sr_name: "Abdul Halim (SMT-0051)",
    items_count: 5,
  },
  {
    id: 102,
    order_no: "SO-DPT-8473",
    date: "2026-10-03",
    customer_name: "Bengal Lubricants Hub",
    depot_name: "D-Uttara Regional Depot",
    subtotal: 28500,
    discount: 1425,
    payable_amount: 27075,
    status: "Pending Approval",
    sr_name: "Abdul Halim (SMT-0051)",
    items_count: 3,
  },
];

const INITIAL_VISITS: SndVisit[] = [
  {
    id: "VST-9921",
    customer_name: "CodeTap Distributors",
    thana: "Mirpur",
    time: "10:14 AM",
    battery: "88%",
    gps_accuracy: "±4.2m",
    status: "Verified On-Site",
    statusColor: "emerald",
    remarks: "Quarterly stock inspection completed. Restocked synthetic range.",
  },
  {
    id: "VST-9922",
    customer_name: "Shahjalal Auto Care",
    thana: "Mirpur",
    time: "11:45 AM",
    battery: "82%",
    gps_accuracy: "±3.8m",
    status: "Verified On-Site",
    statusColor: "emerald",
    remarks: "Met owner regarding wholesale delivery schedule.",
  },
];

interface FeedbackBanner {
  variant: "success" | "danger" | "warning";
  title: string;
  message: string;
}

export function SndManagementView() {
  const [activeSubTab, setActiveSubTab] = useState<"customers" | "orders" | "visits">("customers");

  // RTK Query Hooks
  const { data: sndDashboardResp } = useGetSndDashboardQuery();
  const { data: apiCustomersResp } = useGetSndCustomersQuery();
  const { data: apiOrdersResp } = useGetSndSalesOrdersQuery();
  const [storeCustomerApi, { isLoading: isStoringCustomer }] = useStoreSndCustomerMutation();
  const [storeOrderApi, { isLoading: isStoringOrder }] = useStoreSndSalesOrderMutation();
  const [approveOrderApi] = useApproveSndSalesOrderMutation();
  const [rejectOrderApi] = useRejectSndSalesOrderMutation();
  const [punchSalesApi, { isLoading: isPunching }] = usePunchSndSalesMutation();

  // State
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [visits, setVisits] = useState<SndVisit[]>(INITIAL_VISITS);
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);

  // Sync API data if available
  React.useEffect(() => {
    if (apiCustomersResp?.data && apiCustomersResp.data.length > 0) {
      setCustomers(apiCustomersResp.data);
    }
  }, [apiCustomersResp]);

  React.useEffect(() => {
    if (apiOrdersResp?.data && apiOrdersResp.data.length > 0) {
      setOrders(apiOrdersResp.data);
    }
  }, [apiOrdersResp]);

  const dashboardData = sndDashboardResp?.data;

  // Optimistic handler with ROLLBACK on API failure
  const handleCreateCustomer = async (data: Omit<Customer, "id" | "code" | "status">) => {
    const newId = Math.floor(1000 + Math.random() * 9000);
    const newCust: Customer = {
      ...data,
      id: newId,
      code: `CUS-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "Active",
    };

    const previousCustomers = [...customers];
    setCustomers([newCust, ...customers]);
    setIsAddCustomerOpen(false);

    try {
      await storeCustomerApi(newCust).unwrap();
      setFeedback({
        variant: "success",
        title: "Customer Registered",
        message: `Outlet "${newCust.name}" has been registered and synced with the depot server.`,
      });
    } catch (err: unknown) {
      // ROLLBACK on failure
      setCustomers(previousCustomers);
      const errMsg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : err instanceof Error
          ? err.message
          : "Failed to persist customer on server";

      setFeedback({
        variant: "danger",
        title: "Registration Failed (Rolled Back)",
        message: `Could not register outlet: ${errMsg}. Local optimistic changes were reverted.`,
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  // Optimistic handler with ROLLBACK on API failure
  const handleCreateOrder = async (orderData: {
    customer: Customer;
    product: SndProductItem;
    quantity: number;
    subtotal: number;
    discount: number;
    payable: number;
    remarks: string;
  }) => {
    const newId = Math.floor(1000 + Math.random() * 9000);
    const newOrder: SalesOrder = {
      id: newId,
      order_no: `SO-DPT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      customer_name: orderData.customer.name,
      depot_name: orderData.customer.depot_name,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      payable_amount: orderData.payable,
      status: "Pending Approval",
      sr_name: "Abdul Halim (SMT-0051)",
      items_count: orderData.quantity,
    };

    const previousOrders = [...orders];
    setOrders([newOrder, ...orders]);
    setIsAddOrderOpen(false);

    try {
      await storeOrderApi({
        customer_id: orderData.customer.id,
        payable_amount: orderData.payable,
        remarks: orderData.remarks,
        date: newOrder.date,
      }).unwrap();

      setFeedback({
        variant: "success",
        title: "Order Placed Successfully",
        message: `Sales order for ${orderData.quantity} units of ${orderData.product.name} (৳${orderData.payable.toLocaleString()}) submitted.`,
      });
    } catch (err: unknown) {
      // ROLLBACK on failure
      setOrders(previousOrders);
      const errMsg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : err instanceof Error
          ? err.message
          : "Server rejected order submission";

      setFeedback({
        variant: "danger",
        title: "Order Failed (Rolled Back)",
        message: `Could not submit sales order: ${errMsg}. Local optimistic state was reverted.`,
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  const handleApproveOrder = async (id: number) => {
    const previousOrders = [...orders];
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Approved" } : o)));

    try {
      await approveOrderApi(id).unwrap();
      setFeedback({
        variant: "success",
        title: "Order Approved",
        message: `Sales order #${id} has been approved for depot dispatch.`,
      });
    } catch (err: unknown) {
      setOrders(previousOrders);
      setFeedback({
        variant: "danger",
        title: "Approval Failed (Rolled Back)",
        message: "Failed to approve order on the backend. Changes were restored.",
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  const handleRejectOrder = async (id: number) => {
    const previousOrders = [...orders];
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Rejected" } : o)));

    try {
      await rejectOrderApi({ id, reason: "Product inventory shortage" }).unwrap();
      setFeedback({
        variant: "warning",
        title: "Order Rejected",
        message: `Sales order #${id} marked as rejected.`,
      });
    } catch (err: unknown) {
      setOrders(previousOrders);
      setFeedback({
        variant: "danger",
        title: "Action Failed (Rolled Back)",
        message: "Failed to update order rejection status on the server.",
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  const handlePunchSales = async (data: {
    customerId: number;
    comment: string;
    latitude: string;
    longitude: string;
  }) => {
    const cust = customers.find((c) => c.id === data.customerId) || customers[0];
    const newVisit: SndVisit = {
      id: `VST-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: cust?.name || "Customer Outlet",
      thana: cust?.thana || "Mirpur",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      battery: "90%",
      gps_accuracy: "±3.5m",
      status: "Verified On-Site",
      statusColor: "emerald",
      remarks: data.comment,
    };

    const previousVisits = [...visits];
    setVisits([newVisit, ...visits]);
    setIsPunchModalOpen(false);

    try {
      await punchSalesApi({
        customer_id: data.customerId,
        comment: data.comment,
        latitude: data.latitude,
        longitude: data.longitude,
      }).unwrap();

      setFeedback({
        variant: "success",
        title: "GPS Check-in Logged",
        message: `Verified visit recorded at ${cust.name} (${data.latitude}, ${data.longitude}).`,
      });
    } catch (err: unknown) {
      setVisits(previousVisits);
      setFeedback({
        variant: "danger",
        title: "GPS Punch Failed (Rolled Back)",
        message: "Failed to record location check-in on the server.",
      });
    }

    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Store className="h-5 w-5" />
            </div>
            <Title className="text-xl font-bold text-gray-700">
              SND - Sales & Distribution
            </Title>
            <Badge variant="default" className="bg-blue-600 text-white font-medium">
              Live Field Ops
            </Badge>
          </div>
          <Subtitle className="text-slate-700 font-medium text-xs mt-1">
            Depot management, registered outlet directories, field punching & wholesale order execution
          </Subtitle>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPunchModalOpen(true)}
            className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Navigation className="h-4 w-4" />
            <span>Punch GPS Check-in</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddOrderOpen(true)}
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Create Sales Order</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Register Customer</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <Banner
          variant={feedback.variant}
          title={feedback.title}
          description={feedback.message}
          isDismissible
          onClose={() => setFeedback(null)}
        />
      )}

      {/* KPI Cards */}
      <SndMetrics
        totalCustomers={dashboardData?.total_customers}
        activeDepots={dashboardData?.active_depots}
        todayOrdersCount={dashboardData?.today_orders_count}
        todayOrderValue={dashboardData?.today_order_value}
      />

      {/* Main Content Workspace Card */}
      <CardWrapper
        title="Distribution Operations Directory"
        description="Browse registered dealer networks, approve depot orders, and monitor verified SR visits"
        headerAction={
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveSubTab("customers")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeSubTab === "customers"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Customers ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("orders")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeSubTab === "orders"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Sales Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("visits")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeSubTab === "visits"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Field Visits ({visits.length})</span>
            </button>
          </div>
        }
      >
        {activeSubTab === "customers" && (
          <SndCustomerTable
            customers={customers}
            onOpenRegisterModal={() => setIsAddCustomerOpen(true)}
          />
        )}

        {activeSubTab === "orders" && (
          <SndOrderTable
            orders={orders}
            onOpenCreateOrderModal={() => setIsAddOrderOpen(true)}
            onApproveOrder={handleApproveOrder}
            onRejectOrder={handleRejectOrder}
          />
        )}

        {activeSubTab === "visits" && (
          <SndVisitTable
            visits={visits}
            onOpenPunchModal={() => setIsPunchModalOpen(true)}
          />
        )}
      </CardWrapper>

      {/* Modals */}
      <RegisterCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSubmit={handleCreateCustomer}
        isLoading={isStoringCustomer}
      />

      <CreateOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        customers={customers}
        onSubmit={handleCreateOrder}
        isLoading={isStoringOrder}
      />

      <LogVisitModal
        isOpen={isPunchModalOpen}
        onClose={() => setIsPunchModalOpen(false)}
        customers={customers}
        onSubmit={handlePunchSales}
        isLoading={isPunching}
      />
    </div>
  );
}
