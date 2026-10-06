"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarRange,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Title,
  Subtitle,
  CardWrapper,
  Button,
  Badge,
  Input,
  PageHeader,
  Banner,
  EmptyState,
  Label,
} from "@/components/shared";
import { MOCK_LEAVE_APPLICATIONS } from "@/lib/api/hrmClient";
import { LeaveApplication, LeaveApiRecord, ApiResponse } from "@/types/hrm";

export function LeaveManagementView() {
  const [applications, setApplications] = useState<LeaveApplication[]>(MOCK_LEAVE_APPLICATIONS);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved">("all");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Form states
  const [fromDate, setFromDate] = useState("2026-10-20");
  const [toDate, setToDate] = useState("2026-10-22");
  const [leaveType, setLeaveType] = useState("1");
  const [reason, setReason] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("01717186089");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLeaves = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/hrm/leave-applications");
        if (!res.ok) return;
        const json: ApiResponse<LeaveApiRecord[]> = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const mapped: LeaveApplication[] = json.data.map((item: LeaveApiRecord) => ({
            id: item.id,
            employee_id: item.employee_id || 479,
            employee_name: item.employee_name || "Abdul Halim",
            employee_full_id: item.employee_full_id || "SMT-0051",
            leave_type: item.leave_type || "Casual Leave",
            leave_type_id: item.leave_type_id || 1,
            from_date: item.from_date,
            to_date: item.to_date,
            days_count: item.days_count || 1,
            reason: item.reason || "Personal affairs",
            emergency_phone: item.emergency_phone || "01717186089",
            status: item.status || "Approved",
            applied_at: item.applied_at || "Recent",
            recommended_by: item.recommended_by,
            approved_by: item.approved_by,
          }));
          setApplications(mapped);
        }
      } catch {
        // Fallback to initial mock if network fails
      }
    };
    fetchLeaves();
    return () => {
      isMounted = false;
    };
  }, []);

  const calculateDaysCount = (start: string, end: string): number => {
    if (!start || !end) return 1;
    const dStart = new Date(start);
    const dEnd = new Date(end);
    if (isNaN(dStart.getTime()) || isNaN(dEnd.getTime()) || dEnd < dStart) return 1;
    return Math.round((dEnd.getTime() - dStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const computedDays = calculateDaysCount(fromDate, toDate);

    const newApp: LeaveApplication = {
      id: Math.floor(1000 + Math.random() * 9000),
      employee_id: 479,
      employee_name: "Abdul Halim",
      employee_full_id: "SMT-0051",
      leave_type: leaveType === "1" ? "Casual Leave" : leaveType === "2" ? "Annual Leave" : "Medical Leave",
      leave_type_id: Number(leaveType),
      from_date: fromDate,
      to_date: toDate,
      days_count: computedDays,
      reason: reason || "Personal affairs",
      emergency_phone: emergencyPhone,
      status: "Pending Recommend",
      applied_at: "Just now",
    };

    setApplications([newApp, ...applications]);
    setIsApplyModalOpen(false);
    setReason("");
    setFeedbackMsg(`✓ Leave application for ${computedDays} day(s) submitted successfully!`);
    setTimeout(() => setFeedbackMsg(null), 5000);

    try {
      await fetch("http://127.0.0.1:8000/api/hrm/leave/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_date: fromDate,
          to_date: toDate,
          leave_type: leaveType,
          days_count: computedDays,
          reason: reason || "Personal affairs",
          emergency_phone: emergencyPhone,
        }),
      });
    } catch {
      // offline handling
    }
  };

  const handleRecommend = async (id: number | string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "Pending Approve", recommended_by: "Abdul Halim (HR)" } : app
      )
    );
    try {
      await fetch(`http://127.0.0.1:8000/api/hrm/recommend-leave-application/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Recommended by HR Line Manager" }),
      });
    } catch {
      // ignore
    }
  };

  const handleApprove = async (id: number | string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "Approved", approved_by: "Director" } : app
      )
    );
    try {
      await fetch(`http://127.0.0.1:8000/api/hrm/approve-leave-application/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Approved by Operations Director" }),
      });
    } catch {
      // ignore
    }
  };

  const filtered = applications.filter((app) => {
    if (activeTab === "pending") return app.status.includes("Pending");
    if (activeTab === "approved") return app.status === "Approved";
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedApps = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management & Approval Workflow"
        subtitle="Submit annual, medical or casual leave applications and process recommendation workflows"
        badge={
          <Badge variant="default" className="gap-1">
            <CalendarRange className="h-3 w-3" /> 39 Days Left
          </Badge>
        }
        action={
          <Button
            size="sm"
            onClick={() => setIsApplyModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Apply For Leave
          </Button>
        }
      />

      {feedbackMsg && (
        <Banner
          variant="success"
          title="Application Status"
          description={feedbackMsg}
          isDismissible
          onClose={() => setFeedbackMsg(null)}
        />
      )}

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <CardWrapper className="border-2 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Casual Leave (CL)
            </span>
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
              CL
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <Title level={2} className="text-2xl font-black text-gray-700">
              11 Days
            </Title>
            <span className="text-xs font-bold text-slate-600">Allocated: 14</span>
          </div>
          <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 rounded-full" style={{ width: "78%" }} />
          </div>
        </CardWrapper>

        <CardWrapper className="border-2 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Annual / Earned Leave (AL)
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
              AL
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <Title level={2} className="text-2xl font-black text-emerald-700">
              18 Days
            </Title>
            <span className="text-xs font-bold text-slate-600">Allocated: 20</span>
          </div>
          <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: "90%" }} />
          </div>
        </CardWrapper>

        <CardWrapper className="border-2 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Medical / Sick Leave (ML)
            </span>
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
              ML
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <Title level={2} className="text-2xl font-black text-gray-700">
              10 Days
            </Title>
            <span className="text-xs font-bold text-slate-600">Allocated: 14</span>
          </div>
          <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 rounded-full" style={{ width: "71%" }} />
          </div>
        </CardWrapper>
      </div>

      {/* Applications Workflow Section */}
      <CardWrapper
        title="My Leave History & Approvals"
        description="Track pending approvals and recommended statuses across HR branches"
        headerAction={
          <div className="flex items-center bg-white border-2 border-slate-300 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === "all" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === "pending" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === "approved" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
              }`}
            >
              Approved
            </button>
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            title="No leave applications found"
            description={
              activeTab === "pending"
                ? "There are currently no pending leave applications awaiting approval."
                : activeTab === "approved"
                ? "No approved leave records found in this category."
                : "No leave applications submitted yet."
            }
            action={
              <Button
                size="sm"
                onClick={() => setIsApplyModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
                className="bg-slate-900 text-white font-bold"
              >
                Apply Now
              </Button>
            }
            className="my-4"
          />
        ) : (
          <>
            <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                <tr>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {paginatedApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-100/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-black text-slate-950">{app.employee_name}</p>
                      <p className="font-mono text-slate-600 font-bold text-[11px]">{app.employee_full_id}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.leave_type}</td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <p className="font-bold text-slate-950">
                        {app.from_date} ➔ {app.to_date}
                      </p>
                      <span className="text-[11px] font-extrabold text-white bg-slate-900 px-2 py-0.5 rounded shadow-2xs">
                        {app.days_count} Working Day{app.days_count > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-700 font-medium truncate">
                      {app.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          app.status === "Approved"
                            ? "success"
                            : app.status.includes("Pending")
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {app.status === "Pending Recommend" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-slate-900 text-white font-bold hover:bg-slate-800"
                          onClick={() => handleRecommend(app.id)}
                        >
                          Recommend
                        </Button>
                      )}
                      {app.status === "Pending Approve" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                          onClick={() => handleApprove(app.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 mt-2">
              <span className="text-xs font-bold text-slate-700">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} applications
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2.5 text-xs font-bold border-slate-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <span className="text-xs font-mono font-bold text-slate-900 px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2.5 text-xs font-bold border-slate-300"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
        )}
      </CardWrapper>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <Title level={2} className="text-xl font-bold text-gray-700">
              Apply For Leave
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium mt-1 mb-6">
              Enter your leave timeframe and emergency contact details
            </Subtitle>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <Label required>Leave Category</Label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="h-10 w-full rounded-lg border-2 border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="1">Casual Leave (11 days remaining)</option>
                  <option value="2">Annual / Earned Leave (18 days remaining)</option>
                  <option value="3">Medical / Sick Leave (10 days remaining)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="From Date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                />
                <Input
                  label="To Date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                />
              </div>

              {/* Dynamic Duration Preview */}
              <div className="p-3 bg-white border-2 border-slate-900 rounded-xl text-xs flex items-center justify-between text-slate-950">
                <span className="font-bold text-slate-900">Calculated Leave Duration:</span>
                <span className="font-black text-white bg-slate-900 px-3 py-1 rounded-md shadow-2xs">
                  {calculateDaysCount(fromDate, toDate)} Working Day{calculateDaysCount(fromDate, toDate) > 1 ? "s" : ""}
                </span>
              </div>

              <Input
                label="Emergency Contact Phone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                required
              />

              <div>
                <Label required>Reason for Leave</Label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the reason for leave..."
                  className="w-full h-24 rounded-lg border-2 border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
