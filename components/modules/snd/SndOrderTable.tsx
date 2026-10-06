"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Check, X } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/shared";
import { SalesOrder } from "./types";

interface SndOrderTableProps {
  orders: SalesOrder[];
  onOpenCreateOrderModal: () => void;
  onApproveOrder: (id: number) => void;
  onRejectOrder: (id: number) => void;
}

export function SndOrderTable({
  orders,
  onOpenCreateOrderModal,
  onApproveOrder,
  onRejectOrder,
}: SndOrderTableProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filtered = orders.filter((o) => {
    if (filter === "pending") return o.status.includes("Pending");
    if (filter === "approved") return o.status === "Approved";
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-white border-2 border-slate-300 p-1 rounded-xl text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === "all" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === "pending" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
            }`}
          >
            Pending Approval ({orders.filter((o) => o.status.includes("Pending")).length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === "approved" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
            }`}
          >
            Approved ({orders.filter((o) => o.status === "Approved").length})
          </button>
        </div>

        <Button
          size="sm"
          onClick={onOpenCreateOrderModal}
          leftIcon={<Plus className="h-4 w-4" />}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
        >
          New Sales Order
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No sales orders found"
          description={
            filter !== "all"
              ? `There are no sales orders in '${filter}' status.`
              : "No sales orders have been placed yet."
          }
          icon={<ShoppingCart className="h-6 w-6 text-slate-900" />}
          action={
            <Button
              size="sm"
              onClick={onOpenCreateOrderModal}
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-slate-900 text-white font-bold"
            >
              Create First Order
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase font-extrabold tracking-wider border-b border-slate-900">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Outlet</th>
                <th className="py-3 px-4">Depot</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Net Payable</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-100/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <p className="font-black text-slate-950">{order.order_no}</p>
                    <p className="text-slate-600 font-medium text-[11px]">{order.date}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-950">{order.customer_name}</p>
                    <p className="text-slate-600 font-medium text-[11px]">{order.sr_name}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{order.depot_name}</td>
                  <td className="py-3.5 px-4 text-slate-700">৳{order.subtotal.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-emerald-600">
                    -৳{order.discount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-700 text-sm">
                    ৳{order.payable_amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        order.status === "Approved"
                          ? "success"
                          : order.status.includes("Pending")
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {order.status.includes("Pending") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          onClick={() => onApproveOrder(order.id)}
                          leftIcon={<Check className="h-3 w-3" />}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-rose-300 text-rose-700 hover:bg-rose-50"
                          onClick={() => onRejectOrder(order.id)}
                          leftIcon={<X className="h-3 w-3" />}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
