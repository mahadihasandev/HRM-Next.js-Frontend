"use client";

import React from "react";
import { MapPin, Navigation, Plus } from "lucide-react";
import { Badge, Button, EmptyState } from "@/components/shared";
import { SndVisit } from "./types";

interface SndVisitTableProps {
  visits: SndVisit[];
  onOpenPunchModal: () => void;
}

export function SndVisitTable({ visits, onOpenPunchModal }: SndVisitTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Real-time field SR location checkpoints & geo-attendance visits
        </p>
        <Button
          size="sm"
          onClick={onOpenPunchModal}
          leftIcon={<Navigation className="h-4 w-4" />}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
        >
          Punch GPS Check-in
        </Button>
      </div>

      {visits.length === 0 ? (
        <EmptyState
          title="No field visits recorded today"
          description="GPS punches logged by Sales Representatives will appear here in real-time."
          icon={<MapPin className="h-6 w-6 text-slate-900" />}
          action={
            <Button
              size="sm"
              onClick={onOpenPunchModal}
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-slate-900 text-white font-bold"
            >
              Record First Punch
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase font-extrabold tracking-wider border-b border-slate-900">
              <tr>
                <th className="py-3 px-4">Visit ID</th>
                <th className="py-3 px-4">Customer Outlet</th>
                <th className="py-3 px-4">Thana Territory</th>
                <th className="py-3 px-4">Punch Timestamp</th>
                <th className="py-3 px-4">GPS Accuracy & Device</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-100/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-slate-950">{v.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-950">{v.customer_name}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1 font-medium text-slate-800">
                      <MapPin className="h-3 w-3 text-emerald-500" />
                      {v.thana}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{v.time}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <p className="font-medium text-slate-800">{v.gps_accuracy}</p>
                    <p className="text-[11px] text-slate-400">Battery: {v.battery}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{v.remarks}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{v.status}</Badge>
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
