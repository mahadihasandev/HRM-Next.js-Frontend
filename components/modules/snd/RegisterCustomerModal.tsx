"use client";

import React, { useState } from "react";
import { X, Store } from "lucide-react";
import { Title, Subtitle, Button, Input, Label } from "@/components/shared";
import { Customer } from "./types";

interface RegisterCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, "id" | "code" | "status">) => Promise<void> | void;
  isLoading?: boolean;
}

export function RegisterCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: RegisterCustomerModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [owner, setOwner] = useState("");
  const [thana, setThana] = useState("Mirpur");
  const [depot, setDepot] = useState("D-Mirpur Central Depot");
  const [customerType, setCustomerType] = useState("Retail Outlet / Workshop");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("23.8103");
  const [long, setLong] = useState("90.4125");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
      owner_name: owner.trim() || "Authorized Contact",
      thana,
      depot_name: depot,
      customer_type: customerType,
      address: address.trim() || "Dhaka Metropolitan Area",
      lat,
      long,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative my-4 sm:my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1 pr-8">
          <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <Title level={2} className="text-lg sm:text-xl font-bold text-gray-700">
              Register New Outlet / Customer
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium">
              Onboard new verified retailer, workshop, or dealer into territory
            </Subtitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-3 text-xs">
          <Input
            label="Shop / Outlet Name"
            placeholder="e.g. Al-Madina Auto Service"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Phone Number"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Proprietor / Owner Name"
              placeholder="e.g. Md. Rafiqul"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label required>Territory Thana</Label>
              <select
                value={thana}
                onChange={(e) => setThana(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="Mirpur">Mirpur</option>
                <option value="Uttara">Uttara</option>
                <option value="Dhanmondi">Dhanmondi</option>
                <option value="Gulshan">Gulshan</option>
                <option value="Mohammadpur">Mohammadpur</option>
              </select>
            </div>

            <div>
              <Label required>Assigned Depot</Label>
              <select
                value={depot}
                onChange={(e) => setDepot(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="D-Mirpur Central Depot">D-Mirpur Central Depot</option>
                <option value="D-Uttara Regional Depot">D-Uttara Regional Depot</option>
                <option value="D-Tejgaon Master Depot">D-Tejgaon Master Depot</option>
              </select>
            </div>
          </div>

          <div>
            <Label required>Customer Category</Label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            >
              <option value="Retail Outlet / Workshop">Retail Outlet / Workshop</option>
              <option value="Authorized Dealer / Wholesale">Authorized Dealer / Wholesale</option>
              <option value="Fleet Operator / Direct Corporate">Fleet Operator / Direct Corporate</option>
            </select>
          </div>

          <Input
            label="Street Address / Landmark"
            placeholder="Plot 12, Road 4, Section 6..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="GPS Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <Input
              label="GPS Longitude"
              value={long}
              onChange={(e) => setLong(e.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              isLoading={isLoading}
            >
              Register Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
