"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Coins,
  Percent,
  Calculator,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";
import {
  Title,
  CardWrapper,
  Button,
  Badge,
  PageHeader,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/shared";
import toast from "react-hot-toast";

interface CommissionSlab {
  id: number;
  minPercent: number;
  maxPercent: number;
  commissionRate: number; // percentage
  volumeBonusPerLiter: number; // ৳ per liter
}

interface CommissionRecord {
  id: number;
  employeeFullId: string;
  name: string;
  territory: string;
  month: string;
  targetAmount: number;
  achievedAmount: number;
  achievementPercent: number;
  volumeLiters: number;
  commissionEarned: number;
  status: "Pending Approval" | "Verified" | "Disbursed";
}

const INITIAL_SLABS: CommissionSlab[] = [
  { id: 1, minPercent: 80, maxPercent: 99.99, commissionRate: 1.5, volumeBonusPerLiter: 0.5 },
  { id: 2, minPercent: 100, maxPercent: 119.99, commissionRate: 3.5, volumeBonusPerLiter: 1.5 },
  { id: 3, minPercent: 120, maxPercent: 149.99, commissionRate: 5.0, volumeBonusPerLiter: 2.5 },
  { id: 4, minPercent: 150, maxPercent: 999.99, commissionRate: 7.5, volumeBonusPerLiter: 4.0 },
];

const INITIAL_COMMISSIONS: CommissionRecord[] = [
  {
    id: 1,
    employeeFullId: "SR-0101",
    name: "Mahbubur Rahman",
    territory: "Dhaka North (Tejgaon / Mirpur)",
    month: "2026-09",
    targetAmount: 500000,
    achievedAmount: 585000,
    achievementPercent: 117.0,
    volumeLiters: 4200,
    commissionEarned: 26775,
    status: "Disbursed",
  },
  {
    id: 2,
    employeeFullId: "SR-0102",
    name: "Kamrul Hasan",
    territory: "Chittagong South & Agrabad",
    month: "2026-09",
    targetAmount: 600000,
    achievedAmount: 610000,
    achievementPercent: 101.6,
    volumeLiters: 4800,
    commissionEarned: 28550,
    status: "Verified",
  },
  {
    id: 3,
    employeeFullId: "SR-0103",
    name: "Abul Kashem",
    territory: "Sylhet Sadar & Sunamganj",
    month: "2026-09",
    targetAmount: 450000,
    achievedAmount: 390000,
    achievementPercent: 86.6,
    volumeLiters: 2900,
    commissionEarned: 7300,
    status: "Pending Approval",
  },
  {
    id: 4,
    employeeFullId: "SR-0104",
    name: "Nazmul Huda",
    territory: "Bogura Central & Sirajganj",
    month: "2026-09",
    targetAmount: 550000,
    achievedAmount: 690000,
    achievementPercent: 125.4,
    volumeLiters: 5600,
    commissionEarned: 48500,
    status: "Verified",
  },
];

export interface CommissionViewProps {
  initialSubTab?: string;
}

export function CommissionView({ initialSubTab }: CommissionViewProps = {}) {
  const [openSections, setOpenSections] = useState<string[]>(
    initialSubTab ? [initialSubTab] : ["generate", "slabs", "list"]
  );


  const [slabs] = useState<CommissionSlab[]>(INITIAL_SLABS);
  const [records, setRecords] = useState<CommissionRecord[]>(INITIAL_COMMISSIONS);
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCommission = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`Sales Commission for ${selectedMonth} computed successfully`);
    }, 700);
  };

  const handleDisburse = (id: number) => {
    setRecords(
      records.map((r) => (r.id === id ? { ...r, status: "Disbursed" } : r))
    );
    toast.success("Commission voucher approved and transferred to Payroll");
  };

  const totalCommission = records.reduce((sum, r) => sum + r.commissionEarned, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Incentive & Commission Management"
        subtitle="Configure target-achievement slabs, compute monthly SR & Dealer incentives, and disburse vouchers into payroll."
        badge={<Badge variant="success">Auto Incentive Engine</Badge>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Total Commission Generated</span>
            <Coins className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            ৳{totalCommission.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
            For Month: {selectedMonth}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Field Officers Eligible</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{records.length} SRs</p>
          <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">
            Achieved &ge; 80% Target
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Disbursement Status</span>
            <FileCheck className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {records.filter((r) => r.status === "Disbursed").length} / {records.length}
          </p>
          <span className="text-[10px] text-purple-600 font-bold mt-1 inline-block">
            Vouchers Integrated with Salary
          </span>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOpenSections(["generate", "slabs", "list"])}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length > 1
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          All Modules (3 Sections)
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["generate"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("generate")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Calculator className="h-3.5 w-3.5" />
          Commission Calculation
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["slabs"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("slabs")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Percent className="h-3.5 w-3.5" />
          Achievement Slabs ({slabs.length})
        </button>
        <button
          type="button"
          onClick={() => setOpenSections(["list"])}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0",
            openSections.length === 1 && openSections.includes("list")
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
          )}
        >
          <Coins className="h-3.5 w-3.5" />
          Disbursement List ({records.length})
        </button>
      </div>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={(val) => setOpenSections(Array.isArray(val) ? val : [val])}
      >
        {/* 1. Commission Generation Console */}
        <AccordionItem value="generate">
          <AccordionTrigger
            icon={<Calculator className="h-5 w-5" />}
            subtitle="Trigger instant calculation for SFM Field Force & SND Dealer networks"
            badge={<Badge variant="default">Calculation Console</Badge>}
          >
            Commission Calculation & Processing Engine
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-800">Billing Cycle Month:</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  disabled={isGenerating}
                  onClick={handleGenerateCommission}
                  leftIcon={<Calculator className="h-4 w-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  {isGenerating ? "Computing..." : "Run Monthly Commission Calculation"}
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Slabs Setup */}
        <AccordionItem value="slabs">
          <AccordionTrigger
            icon={<Percent className="h-5 w-5" />}
            subtitle="Define slab rules, percentage multipliers & volume bonus per liter"
            badge={<Badge variant="success">4 Slabs Active</Badge>}
          >
            Target Achievement Slabs & Rate Rules
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">SL</th>
                    <th className="py-3 px-3">Achievement Range</th>
                    <th className="py-3 px-3 text-center">Value Commission %</th>
                    <th className="py-3 px-3 text-center">Volume Bonus (৳/Liter)</th>
                    <th className="py-3 px-3">Policy Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {slabs.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                        {s.minPercent}% - {s.maxPercent > 500 ? "Above" : `${s.maxPercent}%`}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-700 font-mono">
                        {s.commissionRate}%
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700 font-mono">
                        +৳{s.volumeBonusPerLiter.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        {s.minPercent >= 100
                          ? "Full Target Qualifier with super-incentive"
                          : "Partial achievement baseline"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Disbursement List */}
        <AccordionItem value="list">
          <AccordionTrigger
            icon={<Coins className="h-5 w-5" />}
            subtitle="View calculated disbursements, sales achievement, and approve payment vouchers"
            badge={<Badge variant="default">{records.length} Records</Badge>}
          >
            Commission Disbursement & Payment List
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Field Representative</th>
                    <th className="py-3 px-3">Assigned Territory</th>
                    <th className="py-3 px-3 font-mono">Target (৳)</th>
                    <th className="py-3 px-3 font-mono">Achieved (৳)</th>
                    <th className="py-3 px-3 text-center font-mono">% Ratio</th>
                    <th className="py-3 px-3 text-center font-mono">Volume (L)</th>
                    <th className="py-3 px-3 font-mono">Earned Commission (৳)</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">{r.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{r.employeeFullId}</p>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{r.territory}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                        ৳{r.targetAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        ৳{r.achievedAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-extrabold font-mono text-[11px] ${
                            r.achievementPercent >= 100
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.achievementPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {r.volumeLiters.toLocaleString()} L
                      </td>
                      <td className="py-2.5 px-3 font-mono font-extrabold text-blue-700 text-sm">
                        ৳{r.commissionEarned.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge
                          variant={
                            r.status === "Disbursed"
                              ? "success"
                              : r.status === "Verified"
                              ? "default"
                              : "warning"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {r.status !== "Disbursed" ? (
                          <Button
                            size="sm"
                            onClick={() => handleDisburse(r.id)}
                            className="text-[10px] py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                          >
                            Approve
                          </Button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
