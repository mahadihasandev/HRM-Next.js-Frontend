"use client";

import React, { useState } from "react";
import { Search, MapPin, Store, Plus } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/shared";
import { Customer } from "./types";

interface SndCustomerTableProps {
  customers: Customer[];
  onOpenRegisterModal: () => void;
}

export function SndCustomerTable({
  customers,
  onOpenRegisterModal,
}: SndCustomerTableProps) {
  const [search, setSearch] = useState("");
  const [selectedThana, setSelectedThana] = useState("All");

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesThana = selectedThana === "All" || c.thana === selectedThana;
    return matchesSearch && matchesThana;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-300 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-900" />
          <input
            type="text"
            placeholder="Search outlet name, code, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-slate-300 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
            Filter Thana:
          </span>
          <select
            value={selectedThana}
            onChange={(e) => setSelectedThana(e.target.value)}
            className="px-3 py-1.5 bg-white border-2 border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
          >
            <option value="All">All Thanas</option>
            <option value="Mirpur">Mirpur</option>
            <option value="Uttara">Uttara</option>
            <option value="Dhanmondi">Dhanmondi</option>
            <option value="Gulshan">Gulshan</option>
            <option value="Mohammadpur">Mohammadpur</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={
            search || selectedThana !== "All"
              ? "No customer outlets match your search and filter criteria."
              : "No customer outlets have been registered yet."
          }
          icon={<Store className="h-6 w-6 text-slate-900" />}
          action={
            <Button
              size="sm"
              onClick={onOpenRegisterModal}
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-slate-900 text-white font-bold"
            >
              Register Customer
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase font-extrabold tracking-wider border-b border-slate-900">
              <tr>
                <th className="py-3 px-4">Outlet Code & Name</th>
                <th className="py-3 px-4">Proprietor</th>
                <th className="py-3 px-4">Thana & Location</th>
                <th className="py-3 px-4">Depot</th>
                <th className="py-3 px-4">Channel Type</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-100/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-black text-slate-950">{c.name}</p>
                    <p className="font-mono text-slate-700 font-bold text-[11px]">
                      {c.code} &bull; {c.phone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {c.owner_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1 font-medium text-slate-800">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      {c.thana}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                      {c.address}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.depot_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                      {c.customer_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={c.status === "Active" ? "success" : "default"}>
                      {c.status}
                    </Badge>
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
