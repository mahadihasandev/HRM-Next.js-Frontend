"use client";

import React, { useState } from "react";
import { CreditCard, Printer, QrCode, ShieldCheck, Download, Search } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import toast from "react-hot-toast";

interface IdCardProfile {
  name: string;
  employeeFullId: string;
  designation: string;
  department: string;
  bloodGroup: string;
  joiningDate: string;
  validTill: string;
  emergencyPhone: string;
  company: string;
}

const SAMPLE_ID_CARDS: IdCardProfile[] = [
  {
    name: "Abdul Halim",
    employeeFullId: "SMT-0051",
    designation: "Senior HR Executive",
    department: "Administration & HR",
    bloodGroup: "B+",
    joiningDate: "2020-02-01",
    validTill: "2028-12-31",
    emergencyPhone: "+880 1717-186089",
    company: "Smart Technologies (BD) Ltd.",
  },
  {
    name: "Sayed Mahfuzur Rahman",
    employeeFullId: "SMT-0052",
    designation: "Principal Software Engineer",
    department: "Engineering & IT",
    bloodGroup: "O+",
    joiningDate: "2021-06-15",
    validTill: "2028-12-31",
    emergencyPhone: "+880 1819-234567",
    company: "Smart Technologies (BD) Ltd.",
  },
  {
    name: "Kazi Farhan Ahmed",
    employeeFullId: "SMT-0001",
    designation: "General Manager (Sales)",
    department: "Sales & Distribution",
    bloodGroup: "A+",
    joiningDate: "2018-01-10",
    validTill: "2028-12-31",
    emergencyPhone: "+880 1912-345678",
    company: "Smart Technologies (BD) Ltd.",
  },
];

export function EmployeeIdCardPrintTab() {
  const [selectedStaff, setSelectedStaff] = useState<IdCardProfile>(SAMPLE_ID_CARDS[0]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Corporate Smart ID Card Generator
            </h4>
            <p className="text-xs text-slate-500">
              Generate standardized ISO-CR80 PVC employee smart cards with QR & barcode authentication
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Select Employee:</span>
          <select
            value={selectedStaff.employeeFullId}
            onChange={(e) => {
              const found = SAMPLE_ID_CARDS.find((c) => c.employeeFullId === e.target.value);
              if (found) setSelectedStaff(found);
            }}
            className="bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
          >
            {SAMPLE_ID_CARDS.map((c) => (
              <option key={c.employeeFullId} value={c.employeeFullId}>
                {c.name} ({c.employeeFullId})
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="h-4 w-4" />}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Print Card (PVC)
          </Button>
        </div>
      </div>

      {/* ID Card Previews (Front & Back) */}
      <div className="flex flex-wrap items-center justify-center gap-8 py-6">
        {/* Front of Card */}
        <div className="w-72 h-[420px] rounded-2xl bg-white border-2 border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between text-center relative font-sans">
          {/* Top Brand Header */}
          <div className="bg-[#0b1329] text-white p-3.5 border-b border-blue-600">
            <h5 className="font-extrabold text-xs tracking-wider uppercase text-blue-400">
              Smart Group of Industries
            </h5>
            <p className="text-[9px] text-slate-300 font-medium">Enterprise Workforce Identity</p>
          </div>

          {/* Photo & Badge */}
          <div className="flex flex-col items-center pt-2">
            <div className="h-24 w-24 rounded-full bg-slate-900 border-4 border-white shadow-md text-white font-black text-2xl flex items-center justify-center mb-2">
              {selectedStaff.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <h3 className="font-black text-slate-950 text-sm">{selectedStaff.name}</h3>
            <p className="text-[11px] font-bold text-blue-700">{selectedStaff.designation}</p>
            <p className="text-[10px] text-slate-500 font-semibold">{selectedStaff.department}</p>
          </div>

          {/* Details */}
          <div className="px-4 py-2 text-[10px] text-slate-700 space-y-1 bg-slate-50 mx-3 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">ID No:</span>
              <span className="font-mono font-bold text-slate-900">{selectedStaff.employeeFullId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Blood Group:</span>
              <span className="font-mono font-bold text-rose-600">{selectedStaff.bloodGroup}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Issue Date:</span>
              <span className="font-mono font-bold text-slate-800">{selectedStaff.joiningDate}</span>
            </div>
          </div>

          {/* Bottom Barcode / QR */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between px-5">
            <div className="text-left">
              <p className="text-[9px] font-mono font-bold text-slate-400">AUTHENTICATED</p>
              <div className="h-4 w-28 bg-slate-800 rounded-xs mt-0.5" />
            </div>
            <div className="h-8 w-8 border border-slate-300 rounded flex items-center justify-center text-slate-800">
              <QrCode className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="w-72 h-[420px] rounded-2xl bg-white border-2 border-slate-300 shadow-xl overflow-hidden flex flex-col justify-between p-4 text-center font-sans text-xs">
          <div className="space-y-2 text-left">
            <div className="text-center border-b border-slate-200 pb-2 mb-2">
              <p className="font-extrabold text-[11px] text-slate-900 uppercase">
                Terms of Identification
              </p>
            </div>
            <p className="text-[9px] text-slate-600 leading-relaxed">
              1. This smart identity card is the official property of Smart Technologies (BD) Ltd.
            </p>
            <p className="text-[9px] text-slate-600 leading-relaxed">
              2. The cardholder must carry and display this card on enterprise premises and authorized field territories.
            </p>
            <p className="text-[9px] text-slate-600 leading-relaxed">
              3. If found, please return to: Tejgaon Commercial HQ, Dhaka-1208, Bangladesh.
            </p>
          </div>

          <div className="space-y-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-left">
            <p className="font-bold text-slate-800">Emergency Contact:</p>
            <p className="font-mono text-blue-700 font-bold">{selectedStaff.emergencyPhone}</p>
            <p className="text-slate-500">Corporate HQ: +880 2 8878900</p>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-end">
            <div className="text-left">
              <div className="h-0.5 w-20 bg-slate-400 mb-1" />
              <p className="text-[9px] font-bold text-slate-800">Authorized Signature</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-mono text-slate-400">SMART-VERIFY-V2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
