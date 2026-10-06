"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  LogOut,
  CalendarCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Title,
  CardWrapper,
  Button,
  Badge,
  PageHeader,
  Banner,
  EmptyState,
  StatCard,
} from "@/components/shared";
import { MOCK_ATTENDANCE } from "@/lib/api/hrmClient";
import { AttendanceRecord, AttendanceApiRecord, ApiResponse } from "@/types/hrm";
import { AllEmployeesTodayAttendanceModal } from "./AllEmployeesTodayAttendanceModal";

interface AttendanceViewProps {
  employeeFullId?: string;
  employeeName?: string;
}

export function AttendanceView({
  employeeFullId = "SMT-0051",
  employeeName = "Abdul Halim",
}: AttendanceViewProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [showAllAttendanceModal, setShowAllAttendanceModal] = useState(false);
  const [hasPunchedIn, setHasPunchedIn] = useState(false);
  const [inTime, setInTime] = useState<string | null>(null);
  const [outTime, setOutTime] = useState<string | null>(null);
  const [workingHours, setWorkingHours] = useState<string | null>(null);
  const [overtimeHours, setOvertimeHours] = useState<string | null>(null);
  const [overtimeRate, setOvertimeRate] = useState<number | null>(null);
  const [todayOvertimePay, setTodayOvertimePay] = useState<number | null>(null);
  const [punchMessage, setPunchMessage] = useState<{
    type: "success" | "warning" | "danger";
    text: string;
  } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [isLoadingPunch, setIsLoadingPunch] = useState(false);

  // Fetch today's punch status for this employee
  const fetchTodayStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/hrm/check-today-attendance?employee_full_id=${employeeFullId}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data) {
        setHasPunchedIn(Boolean(json.data.has_punched_in));
        setInTime(json.data.in_time || null);
        setOutTime(json.data.out_time || null);
        setWorkingHours(json.data.working_hours || null);
        setOvertimeHours(json.data.overtime_hours || null);
        setOvertimeRate(json.data.overtime_rate ?? null);
        setTodayOvertimePay(json.data.today_overtime_pay ?? null);
      }
    } catch (err) {
      console.warn("Could not check today attendance", err);
    }
  }, [employeeFullId]);

  // Fetch monthly attendance records
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/hrm/v2/monthly-attendance-reports?month=${selectedMonth}&employee_full_id=${employeeFullId}`
      );
      if (!res.ok) return;
      const json: ApiResponse<AttendanceApiRecord[]> = await res.json();
      if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: AttendanceRecord[] = json.data.map((item: AttendanceApiRecord, idx: number) => ({
          id: item.id || idx + 1,
          employee_id: 1,
          employee_full_id: employeeFullId,
          date: item.date,
          in_time: item.in_time || "—",
          out_time: item.out_time || "—",
          status: item.status || "Present",
          location: item.location || "Tejgaon HQ, Dhaka",
          punch_source: item.punch_source || "Biometric",
          working_hours: item.working_hours || (item.in_time ? "8 hrs 45 mins" : "—"),
        }));
        setRecords(mapped);
      }
    } catch {
      // fallback
    }
  }, [selectedMonth, employeeFullId]);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      try {
        const [resToday, resLogs] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/hrm/check-today-attendance?employee_full_id=${employeeFullId}`),
          fetch(`http://127.0.0.1:8000/api/hrm/v2/monthly-attendance-reports?month=${selectedMonth}&employee_full_id=${employeeFullId}`),
        ]);

        if (!isCancelled && resToday.ok) {
          const jsonToday = await resToday.json();
          if (jsonToday?.data) {
            setHasPunchedIn(Boolean(jsonToday.data.has_punched_in));
            setInTime(jsonToday.data.in_time || null);
            setOutTime(jsonToday.data.out_time || null);
            setWorkingHours(jsonToday.data.working_hours || null);
            setOvertimeHours(jsonToday.data.overtime_hours || null);
            setOvertimeRate(jsonToday.data.overtime_rate ?? null);
            setTodayOvertimePay(jsonToday.data.today_overtime_pay ?? null);
          }
        }

        if (!isCancelled && resLogs.ok) {
          const jsonLogs: ApiResponse<AttendanceApiRecord[]> = await resLogs.json();
          if (jsonLogs?.data && Array.isArray(jsonLogs.data) && jsonLogs.data.length > 0) {
            const mapped: AttendanceRecord[] = jsonLogs.data.map((item: AttendanceApiRecord, idx: number) => ({
              id: item.id || idx + 1,
              employee_id: 1,
              employee_full_id: employeeFullId,
              date: item.date,
              in_time: item.in_time || "—",
              out_time: item.out_time || "—",
              status: item.status || "Present",
              location: item.location || "Tejgaon HQ, Dhaka",
              punch_source: item.punch_source || "Biometric",
              working_hours: item.working_hours || (item.in_time ? "8 hrs 45 mins" : "—"),
            }));
            setRecords(mapped);
          }
        }
      } catch (err) {
        console.warn("Could not load attendance", err);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [employeeFullId, selectedMonth]);

  // Handler: Punch In (Permitted once per day)
  const handlePunchIn = async () => {
    setIsLoadingPunch(true);
    setPunchMessage(null);
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    try {
      let res = await fetch("http://127.0.0.1:8000/api/hrm/punch-in", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          employee_full_id: employeeFullId,
          time: nowTime,
          location: "Dhaka Corporate Headquarters",
          latitude: 23.8103,
          longitude: 90.4125,
        }),
      });

      if (res.status === 404) {
        res = await fetch("http://127.0.0.1:8000/api/v1/hrm/punch-in", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            employee_full_id: employeeFullId,
            time: nowTime,
            location: "Dhaka Corporate Headquarters",
            latitude: 23.8103,
            longitude: 90.4125,
          }),
        });
      }

      const json = await res.json();
      if (res.ok && json.status) {
        setHasPunchedIn(true);
        setInTime(json.data.in_time || nowTime);
        toast.success(`Punched In successfully at ${json.data.in_time || nowTime}`);
        setPunchMessage({
          type: "success",
          text: `✓ Punched In successfully at ${json.data.in_time || nowTime}. Single daily entry recorded.`,
        });
        await fetchLogs();
        await fetchTodayStatus();
      } else {
        toast.error(json.message || "An employee can only punch in once per day.");
        setPunchMessage({
          type: "warning",
          text: json.message || "An employee can only punch in once per day.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      toast.error("Punch In failed: " + msg);
      setPunchMessage({ type: "danger", text: "Punch In failed: " + msg });
    } finally {
      setIsLoadingPunch(false);
    }
  };

  // Handler: Punch Out (Permitted unlimited times; the latest punch out counts total duty hours)
  const handlePunchOut = async () => {
    setIsLoadingPunch(true);
    setPunchMessage(null);
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    try {
      let res = await fetch("http://127.0.0.1:8000/api/hrm/punch-out", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          employee_full_id: employeeFullId,
          time: nowTime,
          latitude: 23.8103,
          longitude: 90.4125,
        }),
      });

      if (res.status === 404) {
        res = await fetch("http://127.0.0.1:8000/api/v1/hrm/punch-out", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            employee_full_id: employeeFullId,
            time: nowTime,
            latitude: 23.8103,
            longitude: 90.4125,
          }),
        });
      }

      const json = await res.json();
      if (res.ok && json.status) {
        setOutTime(json.data.out_time || nowTime);
        setWorkingHours(json.data.working_hours);
        setOvertimeHours(json.data.overtime_hours);
        toast.success(`Punch Out recorded at ${json.data.out_time || nowTime}. Duty: ${json.data.working_hours}`);
        setPunchMessage({
          type: "success",
          text: `✓ Punch Out recorded at ${json.data.out_time || nowTime}. Total duty: ${json.data.working_hours} (counted from initial Punch In at ${json.data.in_time} to this latest Punch Out).`,
        });
        await fetchLogs();
        await fetchTodayStatus();
      } else {
        toast.error(json.message || "You must punch in first before punching out.");
        setPunchMessage({
          type: "warning",
          text: json.message || "You must punch in first before punching out.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      toast.error("Punch Out failed: " + msg);
      setPunchMessage({ type: "danger", text: "Punch Out failed: " + msg });
    } finally {
      setIsLoadingPunch(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Geofenced Tracking"
        subtitle={`Live GPS punch clock, automated biometric logs, and monthly job card statements for ${employeeName} (${employeeFullId})`}
        badge={
          <Badge variant="success" className="gap-1 font-bold">
            <CheckCircle2 className="h-3 w-3" /> Geofence Verified &bull; ZKTeco Live
          </Badge>
        }
      />

      {/* Geofenced Punch Simulator: Single Punch In, Unlimited Punch Out */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-7 text-slate-950 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default" className="text-[11px] font-bold bg-slate-900 text-white">
                Geofence: Dhaka Headquarters
              </Badge>
              {hasPunchedIn ? (
                <Badge variant="success" className="text-[11px] font-extrabold flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="h-3 w-3 text-emerald-700" /> Punched In for Today
                </Badge>
              ) : (
                <Badge variant="warning" className="text-[11px] font-extrabold flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300">
                  <Clock className="h-3 w-3 text-amber-700" /> Awaiting Daily Punch In
                </Badge>
              )}
            </div>
            <Title level={2} className="text-gray-700 text-2xl font-black">
              {hasPunchedIn ? "Duty In Progress" : "Ready to Clock In"}
            </Title>
            <p className="text-slate-600 text-xs max-w-xl font-medium">
              Policy Rule: <strong className="text-slate-900">Punch In once per day</strong>. You can <strong className="text-slate-900">punch out as many times as you want</strong> throughout your shift. The <strong className="text-slate-900">last punch out</strong> counts your total duty hours.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAllAttendanceModal(true)}
              leftIcon={<Users className="h-4 w-4 text-emerald-700" />}
              className="border-2 border-slate-300 font-extrabold text-slate-800 hover:bg-slate-100 h-11 text-sm"
            >
              All Staff Today Attendance
            </Button>
            {!hasPunchedIn ? (
              <Button
                size="lg"
                onClick={handlePunchIn}
                disabled={isLoadingPunch}
                leftIcon={<Sparkles className="h-4 w-4 text-emerald-400" />}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 shadow-md h-11 text-sm"
              >
                {isLoadingPunch ? "Recording..." : "Punch In"}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  onClick={handlePunchOut}
                  disabled={isLoadingPunch}
                  leftIcon={<LogOut className="h-4 w-4 text-rose-300" />}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 shadow-md h-11 text-sm gap-2"
                >
                  {isLoadingPunch
                    ? "Updating..."
                    : outTime
                    ? "Punch Out Again"
                    : "Punch Out"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Live Duty Calculation Banner */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-300">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">1. Daily Punch In:</span>
            <p className="font-mono text-sm font-black text-slate-900 mt-0.5">
              {inTime ? (
                <span className="text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {inTime} (Recorded)
                </span>
              ) : (
                <span className="text-slate-500 font-semibold">Not Yet Punched In</span>
              )}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">2. Last Punch Out:</span>
            <p className="font-mono text-sm font-black text-slate-900 mt-0.5">
              {outTime ? (
                <span className="text-blue-900 flex items-center gap-1">
                  <LogOut className="h-3.5 w-3.5 text-blue-600" /> {outTime}
                </span>
              ) : hasPunchedIn ? (
                <span className="text-amber-700 font-semibold">On Duty (In Progress)</span>
              ) : (
                <span className="text-slate-500 font-semibold">—</span>
              )}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">3. Total Duty Duration:</span>
            <p className="font-mono text-sm font-black text-slate-950 mt-0.5">
              {workingHours || (hasPunchedIn ? "Counting until out..." : "—")}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                4. Overtime Tracked:
              </span>
              {overtimeRate && (
                <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  ৳{overtimeRate}/hr
                </span>
              )}
            </div>
            <p className="font-mono text-sm font-black text-emerald-800 mt-0.5">
              {overtimeHours || (workingHours ? "0 hrs (Normal Shift)" : "—")}
              {todayOvertimePay ? (
                <span className="text-xs text-emerald-950 font-extrabold ml-1.5">
                  (+৳{todayOvertimePay.toLocaleString()})
                </span>
              ) : null}
            </p>
          </div>
        </div>

        {punchMessage && (
          <div className="mt-4">
            <Banner
              variant={punchMessage.type}
              title={punchMessage.type === "success" ? "Punch Recorded" : "Attendance Notification"}
              description={punchMessage.text}
              isDismissible
              onClose={() => setPunchMessage(null)}
            />
          </div>
        )}
      </div>

      {/* Attendance Stats with StatCard */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Present Days"
          value="21 Days"
          subtitle="Out of 22 Working Days"
          variant="emerald"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <StatCard
          title="Late Check-ins"
          value="1 Day"
          subtitle="Allowed Grace: 15 mins"
          variant="amber"
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <StatCard
          title="Early Departures"
          value="0 Days"
          subtitle="Strict 06:00 PM Compliance"
          variant="blue"
          icon={<LogOut className="h-5 w-5" />}
        />

        <StatCard
          title="Approved Leave"
          value="0 Days"
          subtitle="Eligible for remuneration"
          variant="purple"
          icon={<CalendarCheck className="h-5 w-5" />}
        />
      </div>

      {/* Monthly Attendance Job Card Calendar */}
      <CardWrapper
        title="Monthly Attendance Job Card"
        description={`Daily biometric verification and punch log records for ${employeeName}`}
        headerAction={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-900" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs rounded-lg border-2 border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-slate-900"
            >
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
            </select>
          </div>
        }
      >
        <div className="pt-2">
          {/* Day Status Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-1.5 font-bold text-slate-500 uppercase text-[11px]">
                {day}
              </div>
            ))}

            {/* Calendar days representation */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isWeekend = day % 7 === 6 || day % 7 === 0;
              const isLate = day === 3;
              const isLeave = day === 15;
              const isToday = day === 3;

              return (
                <div
                  key={day}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[58px] transition-all ${
                    isToday
                      ? "border-2 border-slate-900 bg-white shadow-xs"
                      : isWeekend
                      ? "border border-slate-200 bg-white text-slate-400"
                      : isLate
                      ? "border-2 border-amber-500 bg-white"
                      : isLeave
                      ? "border-2 border-indigo-600 bg-white"
                      : "border border-slate-300 bg-white hover:border-slate-900"
                  }`}
                >
                  <span className={`text-xs font-black ${isToday ? "text-slate-950" : "text-slate-800"}`}>
                    {day}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isWeekend
                        ? "text-slate-600 bg-slate-200"
                        : isLate
                        ? "text-white bg-amber-600 shadow-2xs"
                        : isLeave
                        ? "text-white bg-slate-900 shadow-2xs"
                        : "text-white bg-emerald-700 shadow-2xs"
                    }`}
                  >
                    {isWeekend ? "Off" : isLate ? "Late" : isLeave ? "Leave" : "Present"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardWrapper>

      {/* Attendance History Table */}
      <CardWrapper title="Recent Attendance Punch Logs">
        {records.length === 0 ? (
          <EmptyState
            title="No attendance records found"
            description="Punch records for this period will appear here."
            className="my-4"
          />
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Clock In (Once)</th>
                  <th className="py-3 px-4">Latest Clock Out</th>
                  <th className="py-3 px-4">Duty Duration</th>
                  <th className="py-3 px-4">Location / Punch Method</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-100/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{r.date}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{r.in_time}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{r.out_time}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold">{r.working_hours}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-900 shrink-0" />
                      {r.location}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={r.status === "Present" ? "success" : "warning"}>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardWrapper>

      {/* All Employees Today's Attendance Modal */}
      <AllEmployeesTodayAttendanceModal
        isOpen={showAllAttendanceModal}
        onClose={() => setShowAllAttendanceModal(false)}
      />
    </div>
  );
}
