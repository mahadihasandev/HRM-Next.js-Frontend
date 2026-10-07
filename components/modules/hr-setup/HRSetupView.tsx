"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  Building2,
  Briefcase,
  Award,
  Shuffle,
  ShieldCheck,
  Gift,
  Landmark,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Badge,
  PageHeader,
} from "@/components/shared";
import toast from "react-hot-toast";

export type SetupTab =
  | "holiday"
  | "probation"
  | "depts"
  | "designations"
  | "grades"
  | "shifts"
  | "bonus"
  | "banks"
  | "approvals";

interface Holiday {
  id: number;
  year: number;
  name: string;
  fromDate: string;
  toDate: string;
  days: number;
  type: "National" | "Religious" | "Executive" | "Corporate";
  status: "Active" | "Inactive";
}

interface DepartmentItem {
  id: number;
  name: string;
  code: string;
  head: string;
  staffCount: number;
  location: string;
}

interface DesignationItem {
  id: number;
  title: string;
  department: string;
  grade: string;
  level: number;
}

interface GradeItem {
  id: number;
  gradeName: string;
  basicMin: number;
  basicMax: number;
  houseRentPercent: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
}

interface ShiftItem {
  id: number;
  name: string;
  inTime: string;
  outTime: string;
  lateGraceMin: number;
  earlyOutGraceMin: number;
  halfDayHours: number;
  isNightShift: boolean;
}

interface BankItem {
  id: number;
  name: string;
  routingNo: string;
  branch: string;
  accountNo: string;
  clearingMethod: string;
}

interface BonusTypeItem {
  id: number;
  name: string;
  minServiceMonths: number;
  percentOfBasic: number;
  eligibility: string;
}

const INITIAL_HOLIDAYS: Holiday[] = [
  { id: 1, year: 2026, name: "International Mother Language Day", fromDate: "2026-02-21", toDate: "2026-02-21", days: 1, type: "National", status: "Active" },
  { id: 2, year: 2026, name: "Shab-e-Barat", fromDate: "2026-02-25", toDate: "2026-02-25", days: 1, type: "Religious", status: "Active" },
  { id: 3, year: 2026, name: "Independence & National Day", fromDate: "2026-03-26", toDate: "2026-03-26", days: 1, type: "National", status: "Active" },
  { id: 4, year: 2026, name: "Jumatul Bida & Shab-e-Qadr", fromDate: "2026-04-03", toDate: "2026-04-03", days: 1, type: "Religious", status: "Active" },
  { id: 5, year: 2026, name: "Eid-ul-Fitr Festival Recess", fromDate: "2026-04-09", toDate: "2026-04-12", days: 4, type: "Religious", status: "Active" },
  { id: 6, year: 2026, name: "Pahela Baishakh (Bangla New Year 1433)", fromDate: "2026-04-14", toDate: "2026-04-14", days: 1, type: "National", status: "Active" },
  { id: 7, year: 2026, name: "International Workers' Day (May Day)", fromDate: "2026-05-01", toDate: "2026-05-01", days: 1, type: "National", status: "Active" },
  { id: 8, year: 2026, name: "Buddha Purnima (Vaisakhi)", fromDate: "2026-05-18", toDate: "2026-05-18", days: 1, type: "Religious", status: "Active" },
  { id: 9, year: 2026, name: "Eid-ul-Adha Festival Recess", fromDate: "2026-06-16", toDate: "2026-06-20", days: 5, type: "Religious", status: "Active" },
  { id: 10, year: 2026, name: "Ashura (10th Muharram)", fromDate: "2026-07-16", toDate: "2026-07-16", days: 1, type: "Religious", status: "Active" },
  { id: 11, year: 2026, name: "Janmashtami", fromDate: "2026-08-25", toDate: "2026-08-25", days: 1, type: "Religious", status: "Active" },
  { id: 12, year: 2026, name: "Durga Puja (Bijoya Dashami)", fromDate: "2026-10-10", toDate: "2026-10-11", days: 2, type: "Religious", status: "Active" },
];

const INITIAL_DEPTS: DepartmentItem[] = [
  { id: 1, name: "Sales & Distribution (SND)", code: "SND-01", head: "Kazi Farhan Ahmed", staffCount: 18, location: "Dhaka Central HQ" },
  { id: 2, name: "Field Force Management (SFM)", code: "SFM-02", head: "Tanvir Hossain", staffCount: 20, location: "Regional Base Offices" },
  { id: 3, name: "Engineering & IT Solutions", code: "ENG-03", head: "Mahbubur Rahman", staffCount: 12, location: "Tech Center, Banani" },
  { id: 4, name: "Finance, Audit & Payroll", code: "FIN-04", head: "Syeda Nusrat Jahan", staffCount: 8, location: "Corporate Suite A" },
  { id: 5, name: "Human Resources & Administration", code: "HRM-05", head: "Rezaul Karim", staffCount: 6, location: "Corporate Suite B" },
  { id: 6, name: "Supply Chain & Depot Logistics", code: "LOG-06", head: "Tareq Hasan", staffCount: 4, location: "Central Depot, Gazipur" },
];

const INITIAL_DESIGNATIONS: DesignationItem[] = [
  { id: 1, title: "Managing Director & CEO", department: "Executive Board", grade: "G-1", level: 1 },
  { id: 2, title: "General Manager (Sales & SND)", department: "Sales & Distribution", grade: "G-2", level: 2 },
  { id: 3, title: "Head of People & Culture (HR)", department: "Human Resources", grade: "G-3", level: 3 },
  { id: 4, title: "Principal Software Engineer", department: "Engineering & IT", grade: "G-3", level: 3 },
  { id: 5, title: "Senior Sales Representative (SR)", department: "Field Force Management", grade: "G-5", level: 5 },
  { id: 6, title: "Territory Sales Officer", department: "Sales & Distribution", grade: "G-4", level: 4 },
  { id: 7, title: "Accounts Executive", department: "Finance & Accounts", grade: "G-5", level: 5 },
];

const INITIAL_GRADES: GradeItem[] = [
  { id: 1, gradeName: "Grade 1 (Executive C-Suite)", basicMin: 120000, basicMax: 250000, houseRentPercent: 50, medicalAllowance: 15000, conveyanceAllowance: 25000 },
  { id: 2, gradeName: "Grade 2 (General Management)", basicMin: 80000, basicMax: 120000, houseRentPercent: 50, medicalAllowance: 10000, conveyanceAllowance: 18000 },
  { id: 3, gradeName: "Grade 3 (Department Heads)", basicMin: 55000, basicMax: 80000, houseRentPercent: 50, medicalAllowance: 8000, conveyanceAllowance: 12000 },
  { id: 4, gradeName: "Grade 4 (Senior Officers)", basicMin: 35000, basicMax: 55000, houseRentPercent: 50, medicalAllowance: 5000, conveyanceAllowance: 8000 },
  { id: 5, gradeName: "Grade 5 (Officers & SRs)", basicMin: 22000, basicMax: 35000, houseRentPercent: 50, medicalAllowance: 3500, conveyanceAllowance: 5000 },
  { id: 6, gradeName: "Grade 6 (Junior Executives)", basicMin: 15000, basicMax: 22000, houseRentPercent: 50, medicalAllowance: 2500, conveyanceAllowance: 3500 },
];

const INITIAL_SHIFTS: ShiftItem[] = [
  { id: 1, name: "General Corporate Shift", inTime: "09:00 AM", outTime: "06:00 PM", lateGraceMin: 15, earlyOutGraceMin: 15, halfDayHours: 4.5, isNightShift: false },
  { id: 2, name: "Early Morning Factory Shift", inTime: "07:00 AM", outTime: "03:30 PM", lateGraceMin: 10, earlyOutGraceMin: 10, halfDayHours: 4.0, isNightShift: false },
  { id: 3, name: "Depot Logistics Night Shift", inTime: "10:00 PM", outTime: "06:00 AM", lateGraceMin: 15, earlyOutGraceMin: 15, halfDayHours: 4.0, isNightShift: true },
];

const INITIAL_BANKS: BankItem[] = [
  { id: 1, name: "Eastern Bank PLC", routingNo: "095260842", branch: "Banani Corporate Branch", accountNo: "1081250987621", clearingMethod: "BEFTN / RTGS / NPSB" },
  { id: 2, name: "Dutch-Bangla Bank Ltd.", routingNo: "090273841", branch: "Tejgaon Commercial Branch", accountNo: "1161200084321", clearingMethod: "BEFTN / NPSB" },
  { id: 3, name: "City Bank PLC", routingNo: "225261453", branch: "Gulshan Avenue Branch", accountNo: "3104928172001", clearingMethod: "BEFTN / RTGS / NPSB" },
  { id: 4, name: "Islami Bank Bangladesh PLC", routingNo: "125272990", branch: "Dhanmondi Branch", accountNo: "2050189020311", clearingMethod: "BEFTN / RTGS" },
];

const INITIAL_BONUS_TYPES: BonusTypeItem[] = [
  { id: 1, name: "Eid-ul-Fitr Festival Bonus", minServiceMonths: 3, percentOfBasic: 100, eligibility: "All Muslim Employees" },
  { id: 2, name: "Eid-ul-Adha Festival Bonus", minServiceMonths: 3, percentOfBasic: 100, eligibility: "All Muslim Employees" },
  { id: 3, name: "Durga Puja Festival Bonus", minServiceMonths: 3, percentOfBasic: 100, eligibility: "All Hindu Employees" },
  { id: 4, name: "Annual Performance Incentive", minServiceMonths: 12, percentOfBasic: 50, eligibility: "Confirmed Staff with KPI > 85%" },
];

interface HRSetupViewProps {
  initialSection?: string;
}

export function HRSetupView({ initialSection = "holiday" }: HRSetupViewProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [depts] = useState<DepartmentItem[]>(INITIAL_DEPTS);
  const [designations] = useState<DesignationItem[]>(INITIAL_DESIGNATIONS);
  const [grades] = useState<GradeItem[]>(INITIAL_GRADES);
  const [shifts] = useState<ShiftItem[]>(INITIAL_SHIFTS);
  const [banks] = useState<BankItem[]>(INITIAL_BANKS);
  const [bonusTypes] = useState<BonusTypeItem[]>(INITIAL_BONUS_TYPES);

  // Active Section: driven directly by sidebar navigation & subcategory switcher
  const validTabs: SetupTab[] = [
    "holiday",
    "probation",
    "depts",
    "designations",
    "grades",
    "shifts",
    "bonus",
    "banks",
    "approvals",
  ];
  const [selectedTab, setSelectedTab] = useState<SetupTab>(
    validTabs.includes(initialSection as SetupTab) ? (initialSection as SetupTab) : "holiday"
  );


  const activeTab: SetupTab = selectedTab;

  // Add Holiday Form State
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayFrom, setNewHolidayFrom] = useState("");
  const [newHolidayTo, setNewHolidayTo] = useState("");
  const [newHolidayType, setNewHolidayType] = useState<Holiday["type"]>("National");
  const [isAddingHoliday, setIsAddingHoliday] = useState(false);

  // Probation Period Config State
  const [probationMonths, setProbationMonths] = useState(6);
  const [evalFirstMonth, setEvalFirstMonth] = useState(3);
  const [evalFinalMonth, setEvalFinalMonth] = useState(5);
  const [autoReminderDays, setAutoReminderDays] = useState(15);

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayFrom || !newHolidayTo) {
      toast.error("Please fill in all holiday fields");
      return;
    }
    const from = new Date(newHolidayFrom);
    const to = new Date(newHolidayTo);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newItem: Holiday = {
      id: Date.now(),
      year: from.getFullYear(),
      name: newHolidayName.trim(),
      fromDate: newHolidayFrom,
      toDate: newHolidayTo,
      days: days > 0 ? days : 1,
      type: newHolidayType,
      status: "Active",
    };

    setHolidays([newItem, ...holidays]);
    setNewHolidayName("");
    setNewHolidayFrom("");
    setNewHolidayTo("");
    setIsAddingHoliday(false);
    toast.success(`Holiday "${newItem.name}" added successfully`);
  };

  const handleDeleteHoliday = (id: number) => {
    setHolidays(holidays.filter((h) => h.id !== id));
    toast.success("Holiday removed");
  };

  const handleSaveProbation = () => {
    toast.success("Probation rules & evaluation schedule updated");
  };

  const tabsConfig = [
    {
      id: "holiday" as SetupTab,
      label: "Holiday Calendar",
      icon: CalendarDays,
      badge: `${holidays.length} Days`,
      title: "Holiday Calendar & Gazetted Off-Days",
      description: "Manage national holidays, executive decrees, and religious festive schedules",
    },
    {
      id: "probation" as SetupTab,
      label: "Probation Rules",
      icon: Clock,
      badge: `${probationMonths}m Standard`,
      title: "Probation Period & Confirmation Policy",
      description: "BLA 2006 compliance rules for new recruits, scorecard milestones & automatic alerts",
    },
    {
      id: "depts" as SetupTab,
      label: "Departments",
      icon: Building2,
      badge: `${depts.length} Divisions`,
      title: "Departments & Operational Divisions",
      description: "Organizational business units, facility locations, and department heads",
    },
    {
      id: "designations" as SetupTab,
      label: "Designations",
      icon: Briefcase,
      badge: `${designations.length} Titles`,
      title: "Designations & Corporate Titles",
      description: "Designation catalog, department associations, and grade levels",
    },
    {
      id: "grades" as SetupTab,
      label: "Pay Grades",
      icon: Award,
      badge: "6 Grades",
      title: "Pay Grades & Statutory Allowance Formulas",
      description: "Basic salary bands, house rent percentage, and statutory conveyance standards",
    },
    {
      id: "shifts" as SetupTab,
      label: "Shifts & Roster",
      icon: Shuffle,
      badge: `${shifts.length} Shifts`,
      title: "Shifts & Shift Boundaries",
      description: "Shift schedules, grace timings for late arrivals, early leaves, and half-day boundaries",
    },
    {
      id: "bonus" as SetupTab,
      label: "Festival Bonus",
      icon: Gift,
      badge: `${bonusTypes.length} Types`,
      title: "Festival & Incentive Bonus Types",
      description: "Eid, Puja, and executive bonus eligibility rules and percentages of basic",
    },
    {
      id: "banks" as SetupTab,
      label: "Corporate Banks",
      icon: Landmark,
      badge: `${banks.length} Banks`,
      title: "Bank Accounts & Clearing Gateways",
      description: "Corporate accounts for BEFTN, RTGS, and automated salary disbursements",
    },
    {
      id: "approvals" as SetupTab,
      label: "Approvals & Signatures",
      icon: ShieldCheck,
      badge: "3 Tiers",
      title: "Approval Authorities & Workflow Hierarchy",
      description: "Tier 1 Supervisor, Tier 2 HOD, and Tier 3 HR Administration approval matrices",
    },
  ];

  const currentTabDef = tabsConfig.find((t) => t.id === activeTab) || tabsConfig[0];
  const ActiveIcon = currentTabDef.icon;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Enterprise HR Setup & Compliance"
        subtitle="Manage master settings, Bangladeshi Labor Act compliance, calendars, departments, grades, and statutory payroll structures."
        badge={<Badge variant="default">BLA 2006 Compliant</Badge>}
      />

      {/* Active Section Content Canvas */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in duration-150">
        {/* Subcategories Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
          {tabsConfig.map((tab) => {
            const isTabActive = tab.id === activeTab;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer",
                  isTabActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-gray-700 hover:text-slate-950 hover:bg-slate-100"
                )}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span className={cn(isTabActive ? "text-white" : "text-gray-700 font-bold")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-700 tracking-tight">
                {currentTabDef.title}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {currentTabDef.description}
              </p>
            </div>
          </div>
          <Badge variant="default" className="font-bold self-start sm:self-auto">
            {currentTabDef.badge}
          </Badge>
        </div>

        {/* 1. Holiday Calendar Tab */}
        {activeTab === "holiday" && (
          <div className="space-y-4">
            {/* Year filter and Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Calendar Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                >
                  <option value={2026}>2026 (Current Academic & Fiscal)</option>
                  <option value={2025}>2025 (Historical)</option>
                  <option value={2027}>2027 (Upcoming)</option>
                </select>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddingHoliday(!isAddingHoliday)}
                leftIcon={<Plus className="h-4 w-4" />}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {isAddingHoliday ? "Close Form" : "Add Gazetted Holiday"}
              </Button>
            </div>

            {/* Add Holiday Form */}
            {isAddingHoliday && (
              <form
                onSubmit={handleAddHoliday}
                className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-200"
              >
                <p className="text-xs font-extrabold text-blue-900 uppercase tracking-wide">
                  New Gazetted Holiday Entry
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Holiday Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newHolidayName}
                      onChange={(e) => setNewHolidayName(e.target.value)}
                      placeholder="e.g. Shab-e-Barat"
                      className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      From Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newHolidayFrom}
                      onChange={(e) => setNewHolidayFrom(e.target.value)}
                      className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      To Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newHolidayTo}
                      onChange={(e) => setNewHolidayTo(e.target.value)}
                      className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Classification
                    </label>
                    <select
                      value={newHolidayType}
                      onChange={(e) => setNewHolidayType(e.target.value as Holiday["type"])}
                      className="w-full bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
                    >
                      <option value="National">National Holiday</option>
                      <option value="Religious">Religious Holiday</option>
                      <option value="Executive">Executive Order</option>
                      <option value="Corporate">Corporate Discretion</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingHoliday(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Save Holiday
                  </Button>
                </div>
              </form>
            )}

            {/* Holiday Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">SL</th>
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3">Holiday Name</th>
                    <th className="py-3 px-3">From Date</th>
                    <th className="py-3 px-3">To Date</th>
                    <th className="py-3 px-3 text-center">Days</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {holidays.map((h, idx) => (
                    <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{h.year}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{h.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{h.fromDate}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{h.toDate}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full font-extrabold bg-blue-100 text-blue-800 text-[11px]">
                          {h.days} {h.days === 1 ? "Day" : "Days"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={h.type === "National" ? "default" : h.type === "Religious" ? "success" : "outline"}>
                          {h.type}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteHoliday(h.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Holiday"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Probation Rules Tab */}
        {activeTab === "probation" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-950 text-xs leading-relaxed flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-amber-900">
                  BLA 2006 Statutory Probation Standard
                </p>
                <p className="text-amber-800 mt-0.5">
                  Under Bangladesh Labor Act 2006 Section 4(4), the statutory probation period for a clerical worker is 6 months and for other workers 3 months. Confirmation or extension notices must be issued prior to the expiry date.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Standard Probation Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={probationMonths}
                    onChange={(e) => setProbationMonths(Number(e.target.value))}
                    className="w-20 bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-center focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-600">Months</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Default for all newly joined executives</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Mid-term Performance Review
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={probationMonths}
                    value={evalFirstMonth}
                    onChange={(e) => setEvalFirstMonth(Number(e.target.value))}
                    className="w-20 bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-center focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-600">th Month</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">First evaluation scorecard triggered</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Final Confirmation Review
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={evalFirstMonth}
                    max={probationMonths}
                    value={evalFinalMonth}
                    onChange={(e) => setEvalFinalMonth(Number(e.target.value))}
                    className="w-20 bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-center focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-600">th Month</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Final evaluation report by Dept Head</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Auto-Alert Prior to Expiry
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={autoReminderDays}
                    onChange={(e) => setAutoReminderDays(Number(e.target.value))}
                    className="w-20 bg-white text-slate-900 border-2 border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-center focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-600">Days Before</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Alerts sent to HR & Manager</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSaveProbation}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Save Probation Policy
              </Button>
            </div>
          </div>
        )}

        {/* 3. Departments Tab */}
        {activeTab === "depts" && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">SL</th>
                    <th className="py-3 px-3">Department Name</th>
                    <th className="py-3 px-3">Code</th>
                    <th className="py-3 px-3">Head of Department</th>
                    <th className="py-3 px-3">Location / Facility</th>
                    <th className="py-3 px-3 text-center">Active Staff</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {depts.map((d, idx) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{d.name}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                        <span className="px-2 py-0.5 bg-blue-50 rounded border border-blue-200">
                          {d.code}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{d.head}</td>
                      <td className="py-2.5 px-3 text-slate-600">{d.location}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-mono">
                        {d.staffCount}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge variant="success">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Designations Tab */}
        {activeTab === "designations" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">SL</th>
                  <th className="py-3 px-3">Designation Title</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Grade Scale</th>
                  <th className="py-3 px-3 text-center">Hierarchy Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {designations.map((des, idx) => (
                  <tr key={des.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{des.title}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{des.department}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-700 font-mono">{des.grade}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                      Level {des.level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pay Grades Tab */}
        {activeTab === "grades" && (
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Grade Name</th>
                    <th className="py-3 px-3">Basic Salary Range (৳)</th>
                    <th className="py-3 px-3 text-center">House Rent %</th>
                    <th className="py-3 px-3">Medical (৳)</th>
                    <th className="py-3 px-3">Conveyance (৳)</th>
                    <th className="py-3 px-3 text-center">PF (BLA 8.33%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {grades.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{g.gradeName}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        ৳{g.basicMin.toLocaleString()} - ৳{g.basicMax.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-700 font-mono">
                        {g.houseRentPercent}% of Basic
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        ৳{g.medicalAllowance.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        ৳{g.conveyanceAllowance.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          Eligible
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Shifts & Boundaries Tab */}
        {activeTab === "shifts" && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Shift Name</th>
                    <th className="py-3 px-3">Shift In Time</th>
                    <th className="py-3 px-3">Shift Out Time</th>
                    <th className="py-3 px-3 text-center">Late Grace</th>
                    <th className="py-3 px-3 text-center">Early Out Grace</th>
                    <th className="py-3 px-3 text-center">Half-Day Min</th>
                    <th className="py-3 px-3 text-center">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {shifts.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{s.inTime}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{s.outTime}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800">
                        {s.lateGraceMin} mins
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800">
                        {s.earlyOutGraceMin} mins
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800">
                        {s.halfDayHours} hrs
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge variant={s.isNightShift ? "warning" : "default"}>
                          {s.isNightShift ? "Night Roster" : "Day Roster"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. Bonus Types Tab */}
        {activeTab === "bonus" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">SL</th>
                  <th className="py-3 px-3">Bonus Title</th>
                  <th className="py-3 px-3 text-center">Min Service Required</th>
                  <th className="py-3 px-3 text-center">% of Basic</th>
                  <th className="py-3 px-3">Staff Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bonusTypes.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{b.name}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {b.minServiceMonths} Months
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-extrabold text-blue-700">
                      {b.percentOfBasic}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-semibold">{b.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. Corporate Banks Tab */}
        {activeTab === "banks" && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0f172a] text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3">Bank Name</th>
                  <th className="py-3 px-3">Routing No</th>
                  <th className="py-3 px-3">Branch Name</th>
                  <th className="py-3 px-3">Corporate Account No</th>
                  <th className="py-3 px-3">Clearing Gateways</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {banks.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{bk.name}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{bk.routingNo}</td>
                    <td className="py-2.5 px-3 text-slate-700">{bk.branch}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{bk.accountNo}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{bk.clearingMethod}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant="success">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 9. Approval Authorities Tab */}
        {activeTab === "approvals" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                  Tier 1: Reporting Officer
                </span>
                <p className="text-xs font-bold text-gray-700">Line Manager / Supervisor</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Verifies operational shift coverage and recommends request.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                  Tier 2: Department Head
                </span>
                <p className="text-xs font-bold text-gray-700">General Manager / HOD</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Reviews departmental budget, targets, and departmental approvals.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                  Tier 3: HR Administration
                </span>
                <p className="text-xs font-bold text-gray-700">Head of HR / Director</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Final statutory compliance sign-off and payroll ledger reflection.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
