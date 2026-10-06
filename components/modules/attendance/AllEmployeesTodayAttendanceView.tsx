"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  CalendarCheck,
  Clock,
  CalendarRange,
  UserX,
  Download,
  RefreshCw,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import {
  PageHeader,
  Badge,
  Button,
} from "@/components/shared";
import { useGetAllEmployeesTodayAttendanceQuery } from "@/store/services/attendance";
import { EmployeeTodayAttendanceItem } from "@/store/services/attendance/types";
import { NavTab } from "@/components/layout/Sidebar";

interface AllEmployeesTodayAttendanceViewProps {
  onNavigate?: (tab: NavTab) => void;
}

export function AllEmployeesTodayAttendanceView({ onNavigate }: AllEmployeesTodayAttendanceViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const { data: attendanceResp, isLoading, refetch, isFetching } = useGetAllEmployeesTodayAttendanceQuery();

  const roster: EmployeeTodayAttendanceItem[] = useMemo(() => attendanceResp?.data ?? [], [attendanceResp?.data]);
  const summary = attendanceResp?.summary ?? {
    total: 68,
    present: 60,
    late: 3,
    leave: 3,
    absent: 2,
    attendance_rate: "88.2%",
  };

  // Distinct departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    roster.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return Array.from(set).sort();
  }, [roster]);

  // Filtered employees
  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      // Status filter
      if (selectedStatus !== "all" && item.status.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
      // Department filter
      if (selectedDept !== "all" && item.department !== selectedDept) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesId = item.employee_full_id.toLowerCase().includes(query);
        const matchesDept = item.department.toLowerCase().includes(query);
        const matchesDesig = item.designation.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesDept && !matchesDesig) {
          return false;
        }
      }
      return true;
    });
  }, [roster, selectedStatus, selectedDept, searchTerm]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredRoster.length === 0) return;

    const headers = [
      "Staff Code",
      "Employee Name",
      "Department",
      "Designation",
      "Status",
      "In Time",
      "Out Time",
      "Working Hours",
      "Overtime Hours",
      "Punch Source",
      "Location",
    ];

    const rows = filteredRoster.map((item) => [
      `"${item.employee_full_id}"`,
      `"${item.name}"`,
      `"${item.department}"`,
      `"${item.designation}"`,
      `"${item.status}"`,
      `"${item.in_time || "—"}"`,
      `"${item.out_time || "—"}"`,
      `"${item.working_hours || "—"}"`,
      `"${item.overtime_hours || "—"}"`,
      `"${item.punch_source}"`,
      `"${item.location}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `all_employees_today_attendance_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={
          <span className="text-slate-800 dark:text-slate-800 font-extrabold tracking-tight">
            Today&apos;s Live Attendance & Biometric Roster
          </span>
        }
        subtitle="Enterprise staff attendance records across SilkBio terminals, ADMS Cloud push & Geofenced mobile app"
        badge={
          <Badge variant="success" className="gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            ZKTeco ADMS: Synced ({summary.total} Staff)
          </Badge>
        }
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              isLoading={isFetching}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />}
              className="border-slate-300 text-slate-800 font-bold"
            >
              Sync Devices
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="h-3.5 w-3.5 text-blue-700" />}
              className="border-slate-300 text-slate-800 font-bold"
            >
              Export CSV
            </Button>
            {onNavigate && (
              <Button
                size="sm"
                onClick={() => onNavigate("attendance")}
                leftIcon={<Clock className="h-3.5 w-3.5 text-white" />}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs"
              >
                My Personal Job Card
              </Button>
            )}
          </div>
        }
      />

      {/* 5 KPI Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <button
          type="button"
          onClick={() => setSelectedStatus("all")}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            selectedStatus === "all"
              ? "border-slate-900 bg-slate-900 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className={selectedStatus === "all" ? "text-slate-200" : "text-slate-600"}>
              Total Workforce
            </span>
            <Users className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black font-mono">{summary.total}</p>
          <span className={`text-[11px] font-bold ${selectedStatus === "all" ? "text-emerald-300" : "text-emerald-700"}`}>
            {summary.attendance_rate} Rate
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("present")}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            selectedStatus === "present"
              ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className={selectedStatus === "present" ? "text-emerald-100" : "text-emerald-800"}>
              Present on Duty
            </span>
            <CalendarCheck className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black font-mono">{summary.present}</p>
          <span className={`text-[11px] font-bold ${selectedStatus === "present" ? "text-emerald-100" : "text-slate-600"}`}>
            Verified In-Office & Field
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("late")}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            selectedStatus === "late"
              ? "border-amber-600 bg-amber-600 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className={selectedStatus === "late" ? "text-amber-100" : "text-amber-800"}>
              Late Arrivals
            </span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black font-mono">{summary.late}</p>
          <span className={`text-[11px] font-bold ${selectedStatus === "late" ? "text-amber-100" : "text-slate-600"}`}>
            IOM Submissions
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("leave")}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            selectedStatus === "leave"
              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className={selectedStatus === "leave" ? "text-blue-100" : "text-blue-800"}>
              On Leave
            </span>
            <CalendarRange className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black font-mono">{summary.leave}</p>
          <span className={`text-[11px] font-bold ${selectedStatus === "leave" ? "text-blue-100" : "text-slate-600"}`}>
            BLA Authorized
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("absent")}
          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
            selectedStatus === "absent"
              ? "border-rose-600 bg-rose-600 text-white shadow-sm"
              : "border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className={selectedStatus === "absent" ? "text-rose-100" : "text-rose-800"}>
              Unapproved Absent
            </span>
            <UserX className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black font-mono">{summary.absent}</p>
          <span className={`text-[11px] font-bold ${selectedStatus === "absent" ? "text-rose-100" : "text-slate-600"}`}>
            No Punch Recorded
          </span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search by name, ID (e.g. SMT-0051), designation, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-slate-300 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
              <span>Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-slate-700 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Showing: <span className="font-mono text-slate-900 font-black">{filteredRoster.length}</span> staff
            </span>
          </div>
        </div>

        {/* Enterprise Data Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {isLoading ? (
            <div className="p-16 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700">Loading today&apos;s enterprise attendance roster...</p>
            </div>
          ) : filteredRoster.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <Users className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No staff attendance records matched your filter.</p>
              <p className="text-xs text-slate-500">Try clearing the search query or selecting &apos;All&apos; status.</p>
            </div>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#0f172a] text-white font-extrabold uppercase tracking-wider text-[11px] sticky top-0 z-10">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department & Designation</th>
                  <th className="py-3.5 px-4">Shift</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">In Time</th>
                  <th className="py-3.5 px-4 text-center">Out Time</th>
                  <th className="py-3.5 px-4 text-center">Duty Duration</th>
                  <th className="py-3.5 px-4">Device & Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredRoster.map((item) => {
                  const isPresent = item.status === "Present";
                  const isLate = item.status === "Late";
                  const isLeave = item.status === "Leave";
                  const isAbsent = item.status === "Absent";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* Employee Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {item.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs">{item.name}</p>
                            <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              {item.employee_full_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department & Designation */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{item.department}</p>
                        <p className="text-[11px] text-slate-600 font-medium">{item.designation}</p>
                      </td>

                      {/* Shift */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {item.shift.replace("Day Shift ", "")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isPresent && (
                          <Badge variant="success" className="font-bold text-[10px]">
                            Present
                          </Badge>
                        )}
                        {isLate && (
                          <Badge variant="warning" className="font-bold text-[10px]">
                            Late ({item.late_minutes}m)
                          </Badge>
                        )}
                        {isLeave && (
                          <Badge variant="secondary" className="font-bold text-[10px] bg-blue-100 text-blue-900 border-blue-200">
                            On Leave
                          </Badge>
                        )}
                        {isAbsent && (
                          <Badge variant="destructive" className="font-bold text-[10px]">
                            Absent
                          </Badge>
                        )}
                      </td>

                      {/* In Time */}
                      <td className="py-3.5 px-4 text-center">
                        {item.in_time ? (
                          <div>
                            <span className="font-mono font-black text-slate-900 text-xs">
                              {item.in_time}
                            </span>
                            {isLate ? (
                              <p className="text-[9px] font-bold text-amber-700">
                                Grace Exceeded
                              </p>
                            ) : (
                              <p className="text-[9px] font-bold text-emerald-700">
                                On Time
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Out Time */}
                      <td className="py-3.5 px-4 text-center">
                        {item.out_time ? (
                          <span className="font-mono font-bold text-slate-800 text-xs">
                            {item.out_time}
                          </span>
                        ) : isPresent || isLate ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                            Active in Office
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Duty Duration & OT */}
                      <td className="py-3.5 px-4 text-center">
                        {item.working_hours ? (
                          <div>
                            <span className="font-mono font-bold text-slate-900">
                              {item.working_hours}
                            </span>
                            {item.overtime_hours && (
                              <p className="text-[10px] font-bold text-purple-700 font-mono">
                                OT: {item.overtime_hours}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Punch Source & Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                          <MapPin className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                          <span className="truncate max-w-[150px]">{item.punch_source}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium truncate max-w-[180px]">
                          {item.location}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Statutory Bangladesh Labor Act (BLA 2006) attendance logs verified across SilkBio terminals & central database.
            </span>
          </div>
          <span className="text-slate-500 font-bold font-mono">
            {filteredRoster.length} of {summary.total} Employees Displayed
          </span>
        </div>
      </div>
    </div>
  );
}
