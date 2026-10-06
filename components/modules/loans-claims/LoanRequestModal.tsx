"use client";

import React, { useState } from "react";
import { X, Calculator } from "lucide-react";
import { Title, Subtitle, Button, Input, Label } from "@/components/shared";

interface LoanRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    installments: number;
    purpose: string;
    monthlyInstallment: number;
  }) => Promise<void> | void;
  isLoading?: boolean;
}

const TENURE_OPTIONS = [
  { months: 3, label: "3 Months" },
  { months: 6, label: "6 Months" },
  { months: 10, label: "10 Months" },
  { months: 12, label: "12 Months" },
  { months: 24, label: "24 Months" },
];

export function LoanRequestModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: LoanRequestModalProps) {
  const [amount, setAmount] = useState("100000");
  const [installments, setInstallments] = useState("10");
  const [purpose, setPurpose] = useState("");

  if (!isOpen) return null;

  const numericAmount = Math.max(0, parseFloat(amount) || 0);
  const tenureMonths = parseInt(installments) || 10;
  const computedMonthly = tenureMonths > 0 ? Math.round(numericAmount / tenureMonths) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    onSubmit({
      amount: numericAmount,
      installments: tenureMonths,
      purpose: purpose || "Personal loan request",
      monthlyInstallment: computedMonthly,
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

        <Title level={2} className="text-xl font-bold text-gray-700">
          Apply For HR Loan
        </Title>
        <Subtitle className="text-xs text-slate-700 font-medium mt-1 mb-6">
          Monthly repayments will be scheduled directly from your payroll account
        </Subtitle>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Requested Loan Amount (৳)"
            type="number"
            min="1000"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            helperText="Enter the total loan amount in BDT"
          />

          <div>
            <Label required helperText="Installments will update based on amount">
              Repayment Tenure (Months)
            </Label>
            <select
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className="h-10 w-full rounded-lg border-2 border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            >
              {TENURE_OPTIONS.map((t) => {
                const perMonth =
                  numericAmount > 0
                    ? `৳${Math.round(numericAmount / t.months).toLocaleString()} / mo`
                    : "Enter amount";
                return (
                  <option key={t.months} value={t.months}>
                    {t.label} ({perMonth})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Dynamic EMI preview */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-semibold text-slate-800">Calculated Monthly Installment (EMI)</p>
                <p className="text-[11px] text-slate-500">
                  {tenureMonths} monthly deduction{tenureMonths > 1 ? "s" : ""} from payroll
                </p>
              </div>
            </div>
            <span className="font-bold text-base text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
              ৳{computedMonthly.toLocaleString()}
            </span>
          </div>

          <div>
            <Label required>Purpose of Loan</Label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Medical necessity, family emergency, home renovation..."
              className="w-full h-20 rounded-lg border-2 border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
