"use client";

import React, { useState } from "react";
import { X, Target, Calculator } from "lucide-react";
import { Title, Subtitle, Button, Input } from "@/components/shared";
import { TargetCommitment } from "./types";

interface SfmUpdateModalProps {
  commitment: TargetCommitment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: number;
    commitmentValue: number;
    pcmoValue: number;
    hddoValue: number;
    details: { detail_id: number; commitment_value: number }[];
  }) => Promise<void> | void;
  isLoading?: boolean;
}

export function SfmUpdateModal({
  commitment,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: SfmUpdateModalProps) {
  if (!isOpen || !commitment) return null;

  return (
    <SfmUpdateModalForm
      key={commitment.id}
      commitment={commitment}
      onClose={onClose}
      onSave={onSave}
      isLoading={isLoading}
    />
  );
}

function SfmUpdateModalForm({
  commitment,
  onClose,
  onSave,
  isLoading,
}: {
  commitment: TargetCommitment;
  onClose: () => void;
  onSave: SfmUpdateModalProps["onSave"];
  isLoading: boolean;
}) {
  const [commitmentVal, setCommitmentVal] = useState(String(commitment.commitment_value));
  const [pcmoVal, setPcmoVal] = useState(String(commitment.pcmo_commitment));
  const [hddoVal, setHddoVal] = useState(String(commitment.hddo_commitment));

  const numCommitment = parseInt(commitmentVal) || 0;
  const numPcmo = parseInt(pcmoVal) || 0;
  const numHddo = parseInt(hddoVal) || 0;
  const sumCategories = numPcmo + numHddo;

  // Retrieve dynamic detail IDs safely from commitment or fallback
  const pcmoDetailId = commitment.details?.[0]?.detail_id ?? 14;
  const hddoDetailId = commitment.details?.[1]?.detail_id ?? 15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: commitment.id,
      commitmentValue: numCommitment,
      pcmoValue: numPcmo,
      hddoValue: numHddo,
      details: [
        { detail_id: pcmoDetailId, commitment_value: numPcmo },
        { detail_id: hddoDetailId, commitment_value: numHddo },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <Title level={3} className="font-bold text-gray-700 text-sm">
              Update Commitment Target
            </Title>
            <Subtitle className="text-[11px] text-slate-700 font-medium">
              {commitment.employee_name} ({commitment.code}) &bull; {commitment.territory}
            </Subtitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <Input
            label="Total Monthly Commitment (৳)"
            type="number"
            value={commitmentVal}
            onChange={(e) => setCommitmentVal(e.target.value)}
            required
            helperText={`Assigned Target: ৳${commitment.target_value.toLocaleString()}`}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="PCMO Commitment (৳)"
              type="number"
              value={pcmoVal}
              onChange={(e) => setPcmoVal(e.target.value)}
              required
              helperText={`Detail ID: ${pcmoDetailId}`}
            />
            <Input
              label="HDDO Commitment (৳)"
              type="number"
              value={hddoVal}
              onChange={(e) => setHddoVal(e.target.value)}
              required
              helperText={`Detail ID: ${hddoDetailId}`}
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <Calculator className="h-3.5 w-3.5 text-indigo-600" />
                Category Subtotal (PCMO + HDDO):
              </span>
              <span className="font-semibold text-slate-900">
                ৳{sumCategories.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Commitment to Assigned Target Ratio:</span>
              <span className="font-bold text-indigo-700">
                {commitment.target_value > 0
                  ? `${Math.round((numCommitment / commitment.target_value) * 100)}%`
                  : "0%"}
              </span>
            </div>
          </div>

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
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              isLoading={isLoading}
            >
              Save Commitment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
