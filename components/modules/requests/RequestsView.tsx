"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Shuffle,
  Briefcase,
  AlertCircle,
  Plus,
  CheckCircle2,
  X,
  MapPin,
  CheckSquare,
  GraduationCap,
  PhoneCall,
  CalendarDays,
  UserCheck,
  Building,
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
import {
  MOCK_SHORT_LEAVES,
  MOCK_LATE_REQUESTS,
  MOCK_SHIFT_EXCHANGES,
  MOCK_OUTWORKS,
} from "@/lib/api/hrmClient";
import { DailyWorkItem, TrainingProgramItem } from "@/types/hrm";

const INITIAL_DAILY_WORKS: DailyWorkItem[] = [
  {
    id: 1,
    date: "2026-10-04",
    description: "UI/UX Architecture Review & SND Dealer Ordering Workflow",
    tasks: [
      { description: "Audit SND Customer Order Punch Form UI", startTime: "09:30 AM", finishTime: "11:30 AM", status: "Finish" },
      { description: "Bangladesh Labor Act 2006 Overtime Calculation sync", startTime: "12:00 PM", finishTime: "02:30 PM", status: "Finish" },
      { description: "General Ledger & NBR Tax TDS module review", startTime: "03:30 PM", finishTime: "05:30 PM", status: "Waiting" },
    ],
    communications: [
      { organization: "CodeTap Distributors (Mirpur)", contactPerson: "Rezaul Karim", phone: "01712345678", purpose: "Lubricant stock replenishment inquiry", status: "Finish" },
      { organization: "Prime Bank PLC (Garib-E-Newaz)", contactPerson: "Operations Desk", phone: "01988776655", purpose: "BEFTN Salary Advice confirmation", status: "Finish" },
    ],
    appointments: [
      { organization: "Smart Technologies (BD) Ltd.", contactPerson: "Chief Operating Officer", phone: "01717186089", purpose: "Q4 Field Force Strategy & DA/TA budget", status: "Waiting" },
    ],
  },
  {
    id: 2,
    date: "2026-10-03",
    description: "Field Force SFM Commitment Target Review & Mobile Responsive Audit",
    tasks: [
      { description: "Smartphone viewport touch targets inspection", startTime: "10:00 AM", finishTime: "01:00 PM", status: "Finish" },
      { description: "Biometric Attendance API sync test", startTime: "02:30 PM", finishTime: "04:30 PM", status: "Finish" },
    ],
    communications: [
      { organization: "Gulshan Auto Care", contactPerson: "Mamunur Rashid", phone: "01811223344", purpose: "Direct dealership onboarding follow-up", status: "Finish" },
    ],
    appointments: [
      { organization: "Smart HQ", contactPerson: "Finance Controller", phone: "01711000001", purpose: "NBR Tax Deductions & PF audit reconciliation", status: "Finish" },
    ],
  },
];

const INITIAL_TRAININGS: TrainingProgramItem[] = [
  {
    id: 110,
    title: "Advanced Field Sales Execution & Outlet Merchandising",
    startDate: "2026-10-15",
    endDate: "2026-10-18",
    venue: "Smart Training Institute, Level 5, Dhaka",
    duration: "4 Days (24 Hours)",
    trainer: "Farhan Masud (Senior Sales Director)",
    status: "Upcoming",
    enrolledCount: 28,
    message: "Mandatory training program for all Territory Officers and Field Sales Representatives.",
  },
  {
    id: 111,
    title: "Bangladesh Labor Act (BLA 2006) & NBR Tax TDS Regulations 2026",
    startDate: "2026-10-22",
    endDate: "2026-10-23",
    venue: "Corporate Auditorium & Virtual Hybrid",
    duration: "2 Days (12 Hours)",
    trainer: "Advocate Kamrul Islam (Labor Law Specialist)",
    status: "Upcoming",
    enrolledCount: 45,
    message: "Comprehensive workshop on statutory payroll compliance, gratuity, and tax withholding.",
  },
  {
    id: 109,
    title: "Supply Chain & SND Inventory Optimization Workshop",
    startDate: "2026-09-10",
    endDate: "2026-09-12",
    venue: "Tejgaon Logistics Center",
    duration: "3 Days (18 Hours)",
    trainer: "Md. Moniruzzaman",
    status: "Completed",
    enrolledCount: 32,
    message: "Successfully conducted with depot distribution managers and logistics supervisors.",
  },
];

interface RequestsViewProps {
  initialSubTab?: "short-leave" | "late-iom" | "shifts" | "outwork" | "daily-work" | "trainings";
}

export function RequestsView({ initialSubTab = "short-leave" }: RequestsViewProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<
    "short-leave" | "late-iom" | "shifts" | "outwork" | "daily-work" | "trainings"
  >(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [shortLeaves, setShortLeaves] = useState(MOCK_SHORT_LEAVES);
  const [lateRequests, setLateRequests] = useState(MOCK_LATE_REQUESTS);
  const [shifts, setShifts] = useState(MOCK_SHIFT_EXCHANGES);
  const [outworks, setOutworks] = useState(MOCK_OUTWORKS);
  const [dailyWorks, setDailyWorks] = useState<DailyWorkItem[]>(INITIAL_DAILY_WORKS);
  const [trainings, setTrainings] = useState<TrainingProgramItem[]>(INITIAL_TRAININGS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Short leave form
  const [leaveDay, setLeaveDay] = useState("2026-10-06");
  const [shortLeaveType, setShortLeaveType] = useState<"early" | "delay">("early");
  const [shortLeaveTime, setShortLeaveTime] = useState("03:30 PM");
  const [emergencyPhone, setEmergencyPhone] = useState("01717186089");
  const [shortLeaveReason, setShortLeaveReason] = useState("");

  // Daily Work Diary quick form
  const [isDailyWorkModalOpen, setIsDailyWorkModalOpen] = useState(false);
  const [diaryDate, setDiaryDate] = useState("2026-10-04");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [commOrg, setCommOrg] = useState("");
  const [commPhone, setCommPhone] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchAllRequests = async () => {
      try {
        const [resShort, resLate, resShift, resOut, resDaily, resTrain] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/hrm/short-leave/list").catch(() => null),
          fetch("http://127.0.0.1:8000/api/hrm/late-request").catch(() => null),
          fetch("http://127.0.0.1:8000/api/hrm/shift-applications").catch(() => null),
          fetch("http://127.0.0.1:8000/api/hrm/outwork/list").catch(() => null),
          fetch("http://127.0.0.1:8000/api/hrm/daily-work").catch(() => null),
          fetch("http://127.0.0.1:8000/api/hrm/tranings").catch(() => null),
        ]);

        if (resShort && resShort.ok) {
          const json = await resShort.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setShortLeaves(json.data);
          }
        }
        if (resLate && resLate.ok) {
          const json = await resLate.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setLateRequests(json.data);
          }
        }
        if (resShift && resShift.ok) {
          const json = await resShift.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setShifts(json.data);
          }
        }
        if (resOut && resOut.ok) {
          const json = await resOut.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setOutworks(json.data);
          }
        }
      } catch {
        // fallback
      }
    };
    fetchAllRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateShortLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: Math.floor(100 + Math.random() * 900),
      employee_name: "Nusrat Jahan (SMT-0026)",
      leave_day: leaveDay,
      leave_type: shortLeaveType,
      early_out_time: shortLeaveType === "early" ? shortLeaveTime : undefined,
      delay_in_time: shortLeaveType === "delay" ? shortLeaveTime : undefined,
      emergency_phone: emergencyPhone,
      reason: shortLeaveReason,
      status: "Pending Recommendation",
    };

    setShortLeaves([newRecord, ...shortLeaves]);
    setIsModalOpen(false);
    setShortLeaveReason("");
    setFeedbackMsg(`Short Leave request for ${leaveDay} (${shortLeaveType === "early" ? "Early Out" : "Delay In"}) has been logged!`);
    setTimeout(() => setFeedbackMsg(null), 6000);
  };

  const handleCreateDailyWork = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiary: DailyWorkItem = {
      id: Date.now(),
      date: diaryDate,
      description: diaryTitle || "Routine Field / Corporate Operation Diary",
      tasks: taskDesc
        ? [{ description: taskDesc, startTime: "09:00 AM", finishTime: "05:00 PM", status: "Finish" }]
        : [{ description: "General office tasks completed", startTime: "09:00 AM", finishTime: "06:00 PM", status: "Finish" }],
      communications: commOrg
        ? [{ organization: commOrg, contactPerson: "Representative", phone: commPhone || "017XXXXXXXX", purpose: "Commercial Discussion", status: "Finish" }]
        : [],
      appointments: [],
    };

    setDailyWorks([newDiary, ...dailyWorks]);
    setIsDailyWorkModalOpen(false);
    setDiaryTitle("");
    setTaskDesc("");
    setCommOrg("");
    setFeedbackMsg("Daily work diary logged successfully!");
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleEnrollTraining = (title: string) => {
    setFeedbackMsg(`Enrolled successfully in training program: "${title}". Notification sent to HR!`);
    setTimeout(() => setFeedbackMsg(null), 6000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Requests & Operations"
        subtitle="Manage Short Leaves, Late Attendance Regularization (IOM), Shift Exchanges, Outwork Movement, Daily Diaries, and Training"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {activeSubTab === "short-leave" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Apply Short Leave
              </Button>
            )}
            {activeSubTab === "daily-work" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsDailyWorkModalOpen(true)}
                leftIcon={<Plus className="h-4 w-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Log Daily Diary
              </Button>
            )}
          </div>
        }
      />

      {feedbackMsg && (
        <Banner
          variant="success"
          title="Operation Recorded"
          description={feedbackMsg}
          isDismissible
          onClose={() => setFeedbackMsg(null)}
        />
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-300 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: "short-leave", label: "Short Leave", icon: Clock },
          { id: "late-iom", label: "Late Arrival IOM", icon: AlertCircle },
          { id: "shifts", label: "Shift Exchanges", icon: Shuffle },
          { id: "outwork", label: "Outwork / Field Visit", icon: Briefcase },
          { id: "daily-work", label: "Daily Work & Diary", icon: CheckSquare },
          { id: "trainings", label: "Training & HR", icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap font-bold ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Short Leave */}
      {activeSubTab === "short-leave" && (
        <CardWrapper title="Short Leave Applications">
          {shortLeaves.length === 0 ? (
            <EmptyState
              title="No short leave applications"
              description="You have not submitted any early departure or delayed arrival requests."
              icon={<Clock className="h-6 w-6 text-slate-900" />}
              action={
                <Button
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="bg-slate-900 text-white font-bold"
                >
                  Apply Short Leave
                </Button>
              }
              className="my-4"
            />
          ) : (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Requested Time</th>
                    <th className="py-3 px-4">Emergency Contact</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {shortLeaves.map((sl) => (
                    <tr key={sl.id} className="hover:bg-slate-100/70 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-950">{sl.employee_name}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium">{sl.leave_day}</td>
                      <td className="py-3.5 px-4 font-bold capitalize text-slate-900">
                        {sl.leave_type === "early" ? "Early Out" : "Delay In"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-950">
                        {sl.early_out_time || sl.delay_in_time}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 font-semibold">
                        {sl.emergency_phone || "01717186089"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{sl.reason}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            sl.status === "Approved"
                              ? "success"
                              : sl.status.includes("Pending")
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {sl.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardWrapper>
      )}

      {/* Tab 2: Late Arrival IOM */}
      {activeSubTab === "late-iom" && (
        <CardWrapper title="Inter Office Memo (IOM) — Late Attendance Regularization">
          {lateRequests.length === 0 ? (
            <EmptyState
              title="No late attendance records"
              description="No delayed arrival explanations required at this time."
              icon={<AlertCircle className="h-6 w-6 text-slate-900" />}
              className="my-4"
            />
          ) : (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">In Time</th>
                    <th className="py-3 px-4">Standard Shift In</th>
                    <th className="py-3 px-4">IOM Type & Purpose</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {lateRequests.map((lr) => (
                    <tr key={lr.id} className="hover:bg-slate-100/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{lr.date}</td>
                      <td className="py-3.5 px-4 font-black text-slate-950">{lr.employee_name || "Nusrat Jahan (SMT-0026)"}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-700">{lr.in_time}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">09:00 AM</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <span className="font-bold text-slate-900">{lr.iom_type_name || lr.iom_type || "General IOM"}:</span> {lr.purpose}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={lr.status === "Approved" ? "success" : "warning"}>
                          {lr.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardWrapper>
      )}

      {/* Tab 3: Shift Exchanges */}
      {activeSubTab === "shifts" && (
        <CardWrapper title="Shift Exchange Applications & Roster Switches">
          {shifts.length === 0 ? (
            <EmptyState
              title="No shift change requests"
              description="All department shifts are operating under regular roster."
              icon={<Shuffle className="h-6 w-6 text-slate-900" />}
              className="my-4"
            />
          ) : (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                  <tr>
                    <th className="py-3 px-4">Exchange Date</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Current Shift</th>
                    <th className="py-3 px-4">Target Shift</th>
                    <th className="py-3 px-4">Purpose / Reason</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {shifts.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-100/70 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-950">{s.exchange_date}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{s.employee_name}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{s.current_shift}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-950">{s.target_shift}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs truncate">{s.description}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={s.status === "Approved" ? "success" : "warning"}>
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardWrapper>
      )}

      {/* Tab 4: Outwork / Field Movement */}
      {activeSubTab === "outwork" && (
        <CardWrapper title="Outwork & Client Duty Permits">
          {outworks.length === 0 ? (
            <EmptyState
              title="No outwork permits found"
              description="No external depot or client site movements logged."
              icon={<Briefcase className="h-6 w-6 text-slate-900" />}
              className="my-4"
            />
          ) : (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase font-extrabold tracking-wider border-b border-slate-900">
                  <tr>
                    <th className="py-3 px-4">Outwork Date</th>
                    <th className="py-3 px-4">Timing Window</th>
                    <th className="py-3 px-4">Return Schedule</th>
                    <th className="py-3 px-4">Duty Notes & Destination</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {outworks.map((ow) => (
                    <tr key={ow.id} className="hover:bg-slate-100/70 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-950">{ow.date}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {ow.start_time} - {ow.return_time}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={ow.not_return ? "secondary" : "default"}>
                          {ow.not_return ? "Not Returning" : "Will Return"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-sm truncate">{ow.note}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="success">{ow.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardWrapper>
      )}

      {/* Tab 5: Daily Work Diary & Appointments */}
      {activeSubTab === "daily-work" && (
        <div className="space-y-4">
          {dailyWorks.map((work) => (
            <CardWrapper key={work.id} className="p-5 border border-slate-200 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    <span>{work.date} — {work.description}</span>
                  </h3>
                </div>
                <Badge variant="success">Submitted</Badge>
              </div>

              {/* Tasks Breakdown */}
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Executed Tasks ({work.tasks.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {work.tasks.map((task, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-mono font-semibold text-slate-600 mb-1">
                        <span>{task.startTime} - {task.finishTime}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {task.status}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Communications */}
              {work.communications.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Commercial Calls & Client Communications
                  </h4>
                  <div className="space-y-1.5">
                    {work.communications.map((comm, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                        <div className="flex items-center gap-2">
                          <PhoneCall className="h-4 w-4 text-emerald-600" />
                          <span className="font-bold text-slate-900">{comm.organization}</span>
                          <span className="text-slate-500">({comm.contactPerson} - {comm.phone})</span>
                        </div>
                        <span className="text-slate-700 font-medium">{comm.purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardWrapper>
          ))}
        </div>
      )}

      {/* Tab 6: Training Programs */}
      {activeSubTab === "trainings" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trainings.map((tr) => (
              <CardWrapper key={tr.id} className="p-5 border border-slate-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={tr.status === "Upcoming" ? "warning" : "success"}>
                      {tr.status}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-500">TRN-#{tr.id}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{tr.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{tr.message}</p>

                  <div className="mt-4 space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Trainer:</span>
                      <span className="font-bold text-slate-900">{tr.trainer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-bold text-slate-900">{tr.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dates:</span>
                      <span className="font-mono text-slate-900">{tr.startDate} to {tr.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Venue:</span>
                      <span className="font-bold text-slate-900">{tr.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700">
                    {tr.enrolledCount} Staff Enrolled
                  </span>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleEnrollTraining(tr.title)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Enroll SMT-0026
                  </Button>
                </div>
              </CardWrapper>
            ))}
          </div>
        </div>
      )}

      {/* Short Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <Title level={2} className="text-xl font-bold text-gray-700">
              Submit Short Leave Request
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium mt-1 mb-6">
              Early departure or delayed office arrival notice
            </Subtitle>

            <form onSubmit={handleCreateShortLeave} className="space-y-4 text-xs">
              <Input
                label="Date of Leave"
                type="date"
                value={leaveDay}
                onChange={(e) => setLeaveDay(e.target.value)}
                required
              />

              <div>
                <Label required>Type of Request</Label>
                <select
                  value={shortLeaveType}
                  onChange={(e) => setShortLeaveType(e.target.value as "early" | "delay")}
                  className="h-10 w-full rounded-lg border-2 border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="early">Early Out (Leave before 06:00 PM)</option>
                  <option value="delay">Delay In (Arrive after 09:15 AM)</option>
                </select>
              </div>

              <Input
                label="Requested Departure / Arrival Time"
                type="text"
                value={shortLeaveTime}
                onChange={(e) => setShortLeaveTime(e.target.value)}
                placeholder="e.g. 03:30 PM"
                required
              />

              <Input
                label="Emergency Contact Phone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                required
              />

              <div>
                <Label required>Reason</Label>
                <textarea
                  value={shortLeaveReason}
                  onChange={(e) => setShortLeaveReason(e.target.value)}
                  placeholder="Doctor consultation, family urgency..."
                  className="w-full h-20 rounded-lg border-2 border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily Work Modal */}
      {isDailyWorkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-300 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsDailyWorkModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <Title level={2} className="text-xl font-bold text-gray-700">
              Log Daily Work Diary
            </Title>
            <Subtitle className="text-xs text-slate-700 font-medium mt-1 mb-6">
              Record daily accomplishments, phone calls & meetings
            </Subtitle>

            <form onSubmit={handleCreateDailyWork} className="space-y-4 text-xs">
              <Input
                label="Date"
                type="date"
                value={diaryDate}
                onChange={(e) => setDiaryDate(e.target.value)}
                required
              />

              <Input
                label="Daily Theme / Purpose"
                type="text"
                value={diaryTitle}
                onChange={(e) => setDiaryTitle(e.target.value)}
                placeholder="e.g. System Testing & Regional SND Sales Coordination"
                required
              />

              <div>
                <Label required>Key Tasks Completed</Label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task details and deliverables..."
                  className="w-full h-18 rounded-lg border-2 border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <Input
                label="Client / Vendor Communication (Optional)"
                type="text"
                value={commOrg}
                onChange={(e) => setCommOrg(e.target.value)}
                placeholder="Organization or Dealer Name"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsDailyWorkModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Save Diary
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
