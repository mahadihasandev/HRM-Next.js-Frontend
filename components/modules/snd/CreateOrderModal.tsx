"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Calculator } from "lucide-react";
import { Title, Subtitle, Button, Input, Label } from "@/components/shared";
import { Customer, SND_PRODUCTS, SndProductItem } from "./types";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSubmit: (data: {
    customer: Customer;
    product: SndProductItem;
    quantity: number;
    subtotal: number;
    discount: number;
    payable: number;
    remarks: string;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  customers,
  onSubmit,
  isLoading = false,
}: CreateOrderModalProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id ? String(customers[0].id) : "63"
  );
  const [selectedProductId, setSelectedProductId] = useState(SND_PRODUCTS[0].id);
  const [quantity, setQuantity] = useState("10");
  const [remarks, setRemarks] = useState("Direct field dispatch");

  if (!isOpen) return null;

  const currentCustomer =
    customers.find((c) => String(c.id) === selectedCustomerId) || customers[0];

  const currentProduct =
    SND_PRODUCTS.find((p) => p.id === selectedProductId) || SND_PRODUCTS[0];

  const qty = Math.max(1, parseInt(quantity) || 1);
  const subtotal = qty * currentProduct.price;
  const discount = Math.round(subtotal * 0.05);
  const payable = subtotal - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    onSubmit({
      customer: currentCustomer,
      product: currentProduct,
      quantity: qty,
      subtotal,
      discount,
      payable,
      remarks,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <Title level={2} className="text-xl font-bold text-gray-700">
              Create Sales Order
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium">
              Submit order to regional depot with dynamic pricing and discount
            </Subtitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <div>
            <Label required>Selected Retail Customer</Label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code}) - {c.thana}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label required>Product SKU & Pack Size</Label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            >
              {SND_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.packSize}) &bull; ৳{p.price.toLocaleString()} / unit
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Order Quantity (Units)"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <div>
              <Label>Unit Price</Label>
              <div className="h-10 px-3 bg-slate-100/70 border border-slate-200 rounded-lg flex items-center font-semibold text-slate-800 text-sm">
                ৳{currentProduct.price.toLocaleString()}
              </div>
            </div>
          </div>

          <Input
            label="Field Remarks / Notes"
            placeholder="Delivery timing, transport instructions..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          {/* Pricing Calculation Summary Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5 text-blue-600" />
                Subtotal ({qty} &times; ৳{currentProduct.price.toLocaleString()}):
              </span>
              <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-700">
              <span>Standard Trade Discount (5%):</span>
              <span className="font-semibold">-৳{discount.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Estimated Payable:</span>
              <span className="font-bold text-blue-700 text-base">৳{payable.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              isLoading={isLoading}
            >
              Submit to Depot
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
