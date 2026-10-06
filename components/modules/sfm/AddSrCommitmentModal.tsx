"use client";

import React, { useState } from "react";
import { X, Target, UserPlus } from "lucide-react";
import { Title, Subtitle, Button, Input } from "@/components/shared";
import { TargetCommitment } from "./types";

interface AddSrCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCommitment: TargetCommitment) => void;
}

export function AddSrCommitmentModal({
  isOpen,
  onClose,
  onSubmit,
}: AddSrCommitmentModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("SMT-0060");
  const [territory, setTerritory] = useState("Dhaka North - Uttara Zone");
  const [targetValue, setTargetValue] = useState("2000000");
  const [pcmoValue, setPcmoValue] = useState("1000000");
  const [hddoValue, setHddoValue] = useState("1000000");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const targetNum = Number(targetValue) || 2000000;
    const pcmoNum = Number(pcmoValue) || targetNum / 2;
    const hddoNum = Number(hddoValue) || targetNum / 2;

    const newCommitment: TargetCommitment = {
      id: Math.floor(100 + Math.random() * 900),
      employee_id: Math.floor(500 + Math.random() * 500),
      employee_name: name.trim(),
      code: code.trim() || "SMT-0060",
      territory: territory.trim() || "Dhaka Zone",
      month: new Date().toISOString().slice(0, 7),
      target_value: targetNum,
      commitment_value: pcmoNum + hddoNum,
      actual_sales: 0,
      pcmo_commitment: pcmoNum,
      hddo_commitment: hddoNum,
      details: [
        {
          detail_id: Math.floor(100 + Math.random() * 900),
          product_category: "Passenger Car Motor Oil (PCMO)",
          target_qty: Math.round(pcmoNum / 850),
          commitment_value: pcmoNum,
          achieved_qty: 0,
        },
        {
          detail_id: Math.floor(100 + Math.random() * 900),
          product_category: "Heavy Duty Diesel Oil (HDDO)",
          target_qty: Math.round(hddoNum / 2300),
          commitment_value: hddoNum,
          achieved_qty: 0,
        },
      ],
    };

    onSubmit(newCommitment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative my-4 sm:my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 mb-2 pr-8">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <Title level={2} className="text-lg sm:text-xl font-black text-gray-700">
              Assign SR Target
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium">
              Assign sales territory, PCMO and HDDO monthly volume targets to field force
            </Subtitle>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
          <Input
            label="SR Officer Full Name"
            placeholder="e.g. Mahfuzur Rahman"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="SR Staff Code"
              placeholder="e.g. SMT-0062"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <Input
              label="Assigned Territory"
              placeholder="e.g. Dhaka North - Gazipur"
              value={territory}
              onChange={(e) => setTerritory(e.target.value)}
              required
            />
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
            <span className="font-extrabold text-xs text-slate-950 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-blue-700" />
              Monthly Volume & Value Quota (৳)
            </span>

            <Input
              label="Overall Monthly Sales Target (৳)"
              type="number"
              value={targetValue}
              onChange={(e) => {
                setTargetValue(e.target.value);
                const val = Number(e.target.value) || 0;
                setPcmoValue(String(Math.round(val / 2)));
                setHddoValue(String(Math.round(val / 2)));
              }}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="PCMO Target (৳)"
                type="number"
                value={pcmoValue}
                onChange={(e) => setPcmoValue(e.target.value)}
              />
              <Input
                label="HDDO Target (৳)"
                type="number"
                value={hddoValue}
                onChange={(e) => setHddoValue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-300">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-300 font-bold text-slate-800 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 shadow-md shadow-blue-600/30 w-full sm:w-auto"
            >
              Assign Target Quota
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
