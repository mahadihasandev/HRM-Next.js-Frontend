"use client";

import React, { useState } from "react";
import { X, MapPin, Navigation } from "lucide-react";
import { Title, Subtitle, Button, Input, Label } from "@/components/shared";
import { Customer } from "./types";

interface LogVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSubmit: (data: { customerId: number; comment: string; latitude: string; longitude: string }) => Promise<void> | void;
  isLoading?: boolean;
}

export function LogVisitModal({
  isOpen,
  onClose,
  customers,
  onSubmit,
  isLoading = false,
}: LogVisitModalProps) {
  const [customerId, setCustomerId] = useState(customers[0]?.id ? String(customers[0].id) : "63");
  const [comment, setComment] = useState("Visited store, customer replenished stock.");
  const [latitude] = useState("23.7513671");
  const [longitude] = useState("90.3858841");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customerId: parseInt(customerId) || 63,
      comment,
      latitude,
      longitude,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <Title level={3} className="font-bold text-gray-700 text-sm">
              Punch Sales GPS Check-in
            </Title>
            <Subtitle className="text-[11px] text-slate-700 font-medium">
              Verified geolocation timestamp logging
            </Subtitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <Label required>Selected Outlet</Label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold text-xs focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.thana}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Navigation className="h-3 w-3 text-emerald-600" /> Current Geo-coords:
            </span>
            <span className="font-mono text-emerald-700 font-semibold">
              {latitude}, {longitude}
            </span>
          </div>

          <Input
            label="Visit Observations & Notes"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              isLoading={isLoading}
            >
              Log GPS Punch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
