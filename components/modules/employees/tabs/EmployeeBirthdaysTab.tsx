"use client";

import React, { useState } from "react";
import { Cake, Calendar, Gift, Mail, Bell, Search, Sparkles } from "lucide-react";
import { Badge, Button } from "@/components/shared";
import toast from "react-hot-toast";

interface BirthdayItem {
  id: number;
  name: string;
  employeeFullId: string;
  department: string;
  designation: string;
  dateOfBirth: string; // MM-DD
  dayOfMonth: number;
  bloodGroup: string;
  turningAge: number;
}

const UPCOMING_BIRTHDAYS: BirthdayItem[] = [
  { id: 1, name: "Abdul Halim", employeeFullId: "SMT-0051", department: "Administration & HR", designation: "Senior HR Executive", dateOfBirth: "10-08", dayOfMonth: 8, bloodGroup: "B+", turningAge: 34 },
  { id: 2, name: "Sayed Mahfuzur Rahman", employeeFullId: "SMT-0052", department: "Engineering & IT", designation: "Principal Software Engineer", dateOfBirth: "10-12", dayOfMonth: 12, bloodGroup: "O+", turningAge: 36 },
  { id: 3, name: "Kazi Farhan Ahmed", employeeFullId: "SMT-0001", department: "Sales & Distribution", designation: "General Manager (Sales)", dateOfBirth: "10-19", dayOfMonth: 19, bloodGroup: "A+", turningAge: 42 },
  { id: 4, name: "Nafisa Tabassum", employeeFullId: "SMT-0078", department: "Engineering & IT", designation: "Software Engineer", dateOfBirth: "10-25", dayOfMonth: 25, bloodGroup: "AB+", turningAge: 27 },
  { id: 5, name: "Kamal Uddin", employeeFullId: "SMT-0055", department: "Supply Chain & Logistics", designation: "Depot Manager", dateOfBirth: "11-04", dayOfMonth: 4, bloodGroup: "B+", turningAge: 39 },
];

export function EmployeeBirthdaysTab() {
  const [selectedMonth, setSelectedMonth] = useState("10");
  const [search, setSearch] = useState("");

  const handleSendGreeting = (name: string) => {
    toast.success(`Happy Birthday greeting & corporate e-card sent to ${name}!`);
  };

  const filtered = UPCOMING_BIRTHDAYS.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Month Filter & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
            <Cake className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Employee Birthday Calendar
            </h4>
            <p className="text-xs text-slate-500">
              Celebrate team milestones and foster workplace engagement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none"
          >
            <option value="10">October 2026 (Current)</option>
            <option value="11">November 2026</option>
            <option value="12">December 2026</option>
          </select>
        </div>
      </div>

      {/* Birthday Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-pink-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {b.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{b.name}</h5>
                  <p className="text-[10px] text-slate-500 font-mono">{b.employeeFullId}</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                {b.bloodGroup}
              </Badge>
            </div>

            <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Designation:</span>
                <span className="font-semibold">{b.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-blue-700">{b.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Celebration Day:</span>
                <span className="font-bold text-pink-600">
                  October {b.dayOfMonth}th ({b.turningAge}th Birthday)
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <Button
                size="sm"
                onClick={() => handleSendGreeting(b.name)}
                leftIcon={<Gift className="h-3.5 w-3.5" />}
                className="w-full text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white"
              >
                Send Greeting Card
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
