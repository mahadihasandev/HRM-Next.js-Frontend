"use client";

import React, { useState } from "react";
import {
  Users,
  CalendarCheck,
  CalendarRange,
  Banknote,
  Clock,
  ArrowUpRight,
  MapPin,
  Sparkles,
  CheckCircle2,
  FileText,
  Calendar,
  LogOut,
} from "lucide-react";
import {
  CardWrapper,
  Button,
  Badge,
  PageHeader,
  StatCard,
  Banner,
} from "@/components/shared";
import { NavTab } from "@/components/layout/Sidebar";
import { useGetDashboardMetricsQuery } from "@/store/services/dashboard";
import { usePostMobilePunchMutation } from "@/store/services/attendance";
import { DashboardPieChart } from "./DashboardPieChart";
import { DashboardBarChart } from "./DashboardBarChart";
import { AllEmployeesTodayAttendanceModal } from "@/components/modules/attendance/AllEmployeesTodayAttendanceModal";

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  isPunchedIn?: boolean;
  onQuickPunch?: () => void;
  hasPunchedIn?: boolean;
  inTime?: string | null;
  lastOutTime?: string | null;
  workingHours?: string | null;
  overtimeHours?: string | null;
  onPunchIn?: () => void;
  onPunchOut?: () => void;
  employeeName?: string;
  employeeFullId?: string;
}

export function DashboardView({
  onNavigate,
  isPunchedIn = false,
  onQuickPunch,
  hasPunchedIn = false,
  inTime = null,
  lastOutTime = null,
  workingHours = null,
  overtimeHours = null,
  onPunchIn,
  onPunchOut,
  employeeName = "Abdul Halim",
  employeeFullId = "SMT-0051",
}: DashboardViewProps) {
  const { data: metricsResp } = useGetDashboardMetricsQuery();
  const [postMobilePunch, { isLoading: isPunching }] = usePostMobilePunchMutation();
  const [showAllAttendanceModal, setShowAllAttendanceModal] = useState(false);
  const [punchFeedback, setPunchFeedback] = useState<{
    variant: "success" | "danger";
    title: string;
    message: string;
  } | null>(null);

  const metrics = metricsResp?.data;

  const handlePunchClick = async () => {
    onQuickPunch?.();

    try {
      await postMobilePunch({
        latitude: 23.8058,
        longitude: 90.3533,
        note: isPunchedIn ? "Clock out" : "Clock in",
      }).unwrap();

      setPunchFeedback({
        variant: "success",
        title: isPunchedIn ? "Clocked Out" : "Clocked In",
        message: isPunchedIn
          ? "You have clocked out for the day. Biometric sync updated in central ZKTeco database."
          : "Biometric geo-attendance recorded at Dhaka Corporate HQ. Shift: General (09:00 - 18:00).",
      });
    } catch (err: unknown) {
      onQuickPunch?.();
      const errMsg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : err instanceof Error
          ? err.message
          : "Server failed to verify punch event";

      setPunchFeedback({
        variant: "danger",
        title: "Punch Verification Failed",
        message: `Could not verify attendance punch: ${errMsg}. Punch status was restored.`,
      });
    }

    setTimeout(() => setPunchFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <PageHeader
        title={
          <span className="text-slate-800 dark:text-slate-800 font-extrabold tracking-tight">
            Welcome back, {employeeName}
          </span>
        }
        subtitle={`Smart Technologies (BD) Ltd. • Corporate HQ, Dhaka • ID: ${employeeFullId} • Saturday, 05 Oct 2026`}
        badge={
          <Badge variant="success" className="gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            ZKTeco BioSync: Active
          </Badge>
        }
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllAttendanceModal(true)}
              leftIcon={<Users className="h-3.5 w-3.5 text-emerald-700" />}
              className="border-slate-300 font-bold text-slate-800 hover:bg-slate-50"
            >
              All Staff Today Attendance
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("attendance")}
              leftIcon={<MapPin className="h-3.5 w-3.5 text-blue-700" />}
              className="border-slate-300 font-semibold text-slate-800"
            >
              GPS Clock In
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigate("leave")}
              leftIcon={<CalendarRange className="h-3.5 w-3.5" />}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm shadow-slate-900/20"
            >
              Apply Leave
            </Button>
          </div>
        }
      />

      {punchFeedback && (
        <Banner
          variant={punchFeedback.variant}
          title={punchFeedback.title}
          description={punchFeedback.message}
          isDismissible
          onClose={() => setPunchFeedback(null)}
        />
      )}

      {/* Top Metric KPI Cards with High Contrast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Workforce"
          value={metrics?.total_employees ?? 68}
          subtitle="5 Operational Divisions &bull; BLA Compliant"
          variant="slate"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: "68 Confirmed", isPositive: true }}
        />

        <StatCard
          title="Today's Attendance"
          value={`${metrics?.present_today ?? 60} / ${metrics?.total_employees ?? 68}`}
          subtitle={`${metrics?.late_today ?? 3} Late arrivals &bull; Click to inspect`}
          variant="emerald"
          icon={<CalendarCheck className="h-5 w-5" />}
          trend={{ value: metrics?.attendance_rate ?? "88.2%", isPositive: true }}
          onClick={() => setShowAllAttendanceModal(true)}
          className="cursor-pointer hover:border-emerald-500 transition-all hover:shadow-md"
        />

        <StatCard
          title="Pending Approvals"
          value={`${(metrics?.pending_tasks?.leave_recommendations ?? 12) + (metrics?.pending_tasks?.loan_applications ?? 8) + (metrics?.pending_tasks?.short_leaves ?? 5)} Tasks`}
          subtitle={`${metrics?.pending_tasks?.leave_recommendations ?? 12} Leaves, ${metrics?.pending_tasks?.loan_applications ?? 8} Loans`}
          variant="amber"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: "Action Required", isPositive: false }}
        />

        <StatCard
          title="Monthly Net Salary (৳)"
          value="৳82,300"
          subtitle="Gross: ৳92,000 &bull; EBL Bank Transfer"
          variant="indigo"
          icon={<Banknote className="h-5 w-5" />}
          trend={{ value: "Disbursed", isPositive: true }}
        />
      </div>

      {/* Executive Visual Analytics: Beautiful Pie Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col">
          <DashboardPieChart
            attendanceSummary={{
              total: metrics?.total_employees ?? 68,
              present: metrics?.present_today ?? 60,
              late: metrics?.late_today ?? 3,
              leave: metrics?.on_leave_today ?? 3,
              absent: metrics?.absent_today ?? 2,
              attendance_rate: metrics?.attendance_rate ?? "88.2%",
            }}
            onOpenAllAttendance={() => setShowAllAttendanceModal(true)}
          />
        </div>
        <div className="lg:col-span-6 flex flex-col">
          <DashboardBarChart
            weeklyData={metrics?.weekly_attendance}
            totalEmployees={metrics?.total_employees ?? 68}
            onOpenAllAttendance={() => setShowAllAttendanceModal(true)}
          />
        </div>
      </div>

      {/* Main Grid: Punch Clock & Right Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Punch Clock Widget & Launchpad */}
        <div className="lg:col-span-1 space-y-6">
          <CardWrapper
            title="Biometric Attendance Check-In"
            description="Geofenced terminal & SilkBio device sync"
          >
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-white border-2 border-slate-900 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white shadow-xs flex items-center justify-center mb-2 font-bold">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                
                {hasPunchedIn ? (
                  <div className="w-full space-y-2">
                    <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Punched In:
                        </span>
                        <span className="font-mono font-extrabold text-emerald-950 text-sm">{inTime || "09:00 AM"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-emerald-200">
                        <span className="text-slate-600 font-medium">Last Punch Out:</span>
                        <span className="font-mono font-bold text-slate-900">{lastOutTime || "—"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-emerald-200">
                        <span className="text-slate-700 font-extrabold">Total Duty Hours:</span>
                        <span className="font-mono font-black text-emerald-900 text-sm">
                          {workingHours || "Pending Out"}
                        </span>
                      </div>
                      {overtimeHours && (
                        <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-emerald-200">
                          <span className="text-amber-700 font-bold">Overtime (OT):</span>
                          <span className="font-mono font-bold text-amber-900">{overtimeHours}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-rose-400 bg-white hover:bg-rose-50 text-rose-900 font-extrabold shadow-sm py-2"
                      onClick={onPunchOut || handlePunchClick}
                      isLoading={isPunching}
                    >
                      <LogOut className="h-4 w-4 text-rose-600 mr-2" />
                      {lastOutTime ? "Punch Out Again" : "Punch Out"}
                    </Button>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight">
                      ✓ Punch out as many times as you want. The latest punch out counts total duty.
                    </p>
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    <p className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                      Not Punched
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                      <span>Tejgaon I/A, Dhaka HQ &bull; In-Office</span>
                    </div>
                    <Button
                      variant="default"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-sm shadow-slate-900/30 mt-2 py-2"
                      onClick={onPunchIn || handlePunchClick}
                      isLoading={isPunching}
                    >
                      <Sparkles className="h-4 w-4 text-emerald-400 mr-2" />
                      Punch In Now
                    </Button>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight">
                      Notice: Employees can punch in only ONCE per day.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-700 font-medium divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Roster Shift:</span>
                  <span className="font-bold text-slate-900">General Shift (09:00 - 18:00)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Grace Buffer:</span>
                  <span className="font-bold text-emerald-700">15 Minutes (Up to 09:15 AM)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Today Elapsed:</span>
                  <span className="font-mono font-bold text-slate-900">8h 15m (Active)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Device Protocol:</span>
                  <span className="font-bold text-blue-700">ZKTeco SilkBio 101TC &bull; Verified</span>
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* Quick Management Hub / Launchpad */}
          <CardWrapper
            title="Employee Self-Service (ESS)"
            description="Quick application shortcuts"
          >
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => onNavigate("leave")}
                className="p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-900 text-left transition-all cursor-pointer group shadow-xs"
              >
                <CalendarRange className="h-4 w-4 text-slate-900 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Apply Leave</p>
                <p className="text-[10px] text-slate-600 font-semibold">Leave Request</p>
              </button>

              <button
                onClick={() => onNavigate("requests")}
                className="p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-900 text-left transition-all cursor-pointer group shadow-xs"
              >
                <Clock className="h-4 w-4 text-slate-900 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Late IOM</p>
                <p className="text-[10px] text-slate-600 font-semibold">Late Explanation</p>
              </button>

              <button
                onClick={() => onNavigate("salary")}
                className="p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-900 text-left transition-all cursor-pointer group shadow-xs"
              >
                <Banknote className="h-4 w-4 text-slate-900 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Payslip</p>
                <p className="text-[10px] text-slate-600 font-semibold">BLA Voucher ৳</p>
              </button>

              <button
                onClick={() => onNavigate("loans")}
                className="p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-900 text-left transition-all cursor-pointer group shadow-xs"
              >
                <FileText className="h-4 w-4 text-slate-900 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">HR Loan</p>
                <p className="text-[10px] text-slate-600 font-semibold">Festival Advance</p>
              </button>
            </div>
          </CardWrapper>

          {/* Bangladesh Labour Act (BLA 2006) Leave Balance Matrix */}
          <CardWrapper
            title="Leave Balances (BLA 2006 Act)"
            description="Annual entitlement according to Labour Law"
          >
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Casual Leave (CL)</span>
                  <span className="text-emerald-700 font-mono">7 / 10 Days</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "70%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Sick Leave (SL)</span>
                  <span className="text-blue-700 font-mono">11 / 14 Days</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Earned Leave (EL)</span>
                  <span className="text-indigo-700 font-mono">16 / 18 Days</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>
            </div>
          </CardWrapper>
        </div>

        {/* Right: Pending Approvals & Performance Trends */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actionable Pending Approvals Queue */}
          <CardWrapper
            title="Pending Line Manager Approvals"
            description="Submitted staff requests requiring your recommendation or authorization"
            headerAction={
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("leave")}
                rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}
                className="border-slate-300 font-bold text-slate-800"
              >
                View All Queue
              </Button>
            }
          >
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl border-2 border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    NJ
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">Nusrat Jahan &bull; SMT-0026</p>
                      <Badge variant="warning" className="text-[10px] font-bold">Sick Leave</Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Oct 15 - Oct 17 (3 Days) &bull; Prescribed medical rest (Certificate attached)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-xs"
                  >
                    Recommend
                  </Button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    TA
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">Tanvir Ahmed &bull; SMT-0042</p>
                      <Badge variant="secondary" className="text-[10px] font-bold">Shift Exchange</Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Oct 12 &bull; Morning Shift ➔ General Shift (Academic exam schedule)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-xs"
                  >
                    Approve
                  </Button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    MR
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">Mizanur Rahman &bull; SMT-0078</p>
                      <Badge variant="default" className="text-[10px] font-bold">Festival Loan ৳30,000</Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      6 Installments @ ৳5,000/month &bull; Salary deduction tenure
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800 font-bold shadow-xs"
                  >
                    Recommend
                  </Button>
                </div>
              </div>
            </div>
          </CardWrapper>

          {/* Weekly Attendance Matrix with High Contrast */}
          <CardWrapper
            title="Weekly Attendance Headcount"
            description="Daily enterprise check-in statistics across shifts"
          >
            <div className="pt-2 space-y-4">
              <div className="grid grid-cols-5 gap-3 text-center">
                {[
                  { day: "Sun", present: 460, late: 12, rate: "96.0%" },
                  { day: "Mon", present: 468, late: 8, rate: "97.7%" },
                  { day: "Tue", present: 455, late: 15, rate: "95.0%" },
                  { day: "Wed", present: 462, late: 11, rate: "96.4%" },
                  { day: "Thu", present: 452, late: 18, rate: "94.3%" },
                ].map((item) => (
                  <div
                    key={item.day}
                    className="p-3 rounded-xl bg-white border-2 border-slate-300 flex flex-col items-center shadow-xs"
                  >
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                      {item.day}
                    </span>
                    <span className="text-xl font-black text-slate-800 my-1 font-mono">
                      {item.present}
                    </span>
                    <span className="text-[10px] font-extrabold text-white bg-emerald-700 px-2 py-0.5 rounded-md shadow-2xs">
                      {item.rate}
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold mt-1">
                      {item.late} late
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardWrapper>

          {/* Upcoming Bangladesh Govt & Festival Holidays */}
          <CardWrapper
            title="Upcoming Bangladesh National & Festival Holidays"
            description="Gazetted holidays under Ministry of Public Administration"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-slate-900 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Durga Puja</p>
                  <p className="text-[11px] text-slate-600 font-medium">24 October 2026 &bull; Saturday</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 bg-slate-900 text-white rounded">
                    National Holiday
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-slate-900 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Eid-e-Miladunnabi</p>
                  <p className="text-[11px] text-slate-600 font-medium">16 November 2026 &bull; Monday</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 bg-slate-900 text-white rounded">
                    Public Holiday
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-slate-900 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Victory Day</p>
                  <p className="text-[11px] text-slate-600 font-medium">16 December 2026 &bull; Wednesday</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 bg-slate-900 text-white rounded">
                    National Holiday
                  </span>
                </div>
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>

      {/* All Employees Today's Attendance Modal */}
      <AllEmployeesTodayAttendanceModal
        isOpen={showAllAttendanceModal}
        onClose={() => setShowAllAttendanceModal(false)}
      />
    </div>
  );
}
