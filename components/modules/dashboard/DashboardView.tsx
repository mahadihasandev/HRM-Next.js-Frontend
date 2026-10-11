"use client";

import { isModuleAvailable } from "@/lib/navigation";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarCheck,
  CalendarRange,
  ClipboardCheck,
  Factory,
  FileText,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Banner,
  Button,
  CardWrapper,
  PageHeader,
  StatCard,
  Text,
  Title,
} from "@/components/shared";
import { type NavTab } from "@/components/layout/Sidebar";
import { useGetDashboardMetricsQuery } from "@/store/services/dashboard";
import { AttendanceSummaryCard } from "@/components/shared/Attendance/AttendanceSummaryCard";
import { DashboardPieChart } from "./DashboardPieChart";
import { DashboardBarChart } from "./DashboardBarChart";
import { AllEmployeesTodayAttendanceModal } from "@/components/modules/attendance/AllEmployeesTodayAttendanceModal";

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  hasPunchedIn?: boolean;
  inTime?: string | null;
  lastOutTime?: string | null;
  workingHours?: string | null;
  overtimeHours?: string | null;
  onPunchIn: () => Promise<void>;
  onPunchOut: () => Promise<void>;
  attendanceLoading?: boolean;
  attendanceError?: boolean;
  onRefreshAttendance: () => Promise<void>;
  employeeName?: string;
  employeeFullId?: string;
}
const shortcuts: {
  title: string;
  detail: string;
  tab: NavTab;
  icon: typeof Users;
}[] = [
  {
    title: "Employees",
    detail: "People & profiles",
    tab: "employees",
    icon: Users,
  },
  {
    title: "Payroll",
    detail: "Salary & bank letters",
    tab: "salary",
    icon: Banknote,
  },
  {
    title: "Factory",
    detail: "Lines & production",
    tab: "factory",
    icon: Factory,
  },
  {
    title: "Leave",
    detail: "Apply & review",
    tab: "leave",
    icon: CalendarRange,
  },
];
export function DashboardView({
  onNavigate,
  hasPunchedIn = false,
  inTime,
  lastOutTime,
  workingHours,
  overtimeHours,
  onPunchIn,
  onPunchOut,
  attendanceLoading,
  attendanceError,
  onRefreshAttendance,
  employeeName = "",
  employeeFullId = "",
}: DashboardViewProps) {
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetDashboardMetricsQuery();
  const [showAllAttendanceModal, setShowAllAttendanceModal] = useState(false);
  const metrics = response?.data;
  const pending = metrics?.pending_tasks;
  const leaveCount =
    pending?.leave_recommendations ?? metrics?.pending_leave_requests;
  const approvals = metrics
    ? (leaveCount || 0) +
      (pending?.loan_applications || 0) +
      (pending?.short_leaves || 0)
    : undefined;
  const placeholder = isLoading ? "…" : "—";
  const reviewRows = [
    {
      title: "Leave requests",
      detail: "Review employee applications",
      count: leaveCount,
      tab: "leave" as NavTab,
      icon: CalendarRange,
      color: "bg-teal-50 text-teal-700",
    },
    {
      title: "Loans & advances",
      detail: "Review submitted applications",
      count: pending?.loan_applications,
      tab: "loans" as NavTab,
      icon: Banknote,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Short leave & IOM",
      detail: "Movement and attendance requests",
      count: pending?.short_leaves,
      tab: "requests" as NavTab,
      icon: FileText,
      color: "bg-amber-50 text-amber-700",
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title="People overview"
        titleClassName="!text-slate-900"
        subtitle="Your workforce, daily attendance and priorities in one place."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllAttendanceModal(true)}
            leftIcon={<CalendarCheck className="size-4" />}
          >
            Attendance register
          </Button>
        }
      />
      <AttendanceSummaryCard
        employeeName={employeeName}
        employeeFullId={employeeFullId}
        hasPunchedIn={hasPunchedIn}
        inTime={inTime}
        outTime={lastOutTime}
        workingHours={workingHours}
        overtimeHours={overtimeHours}
        isLoading={attendanceLoading}
        hasError={attendanceError}
        onPunch={hasPunchedIn ? onPunchOut : onPunchIn}
        onRefresh={onRefreshAttendance}
        onViewAttendance={() => onNavigate("attendance")}
      />
      {error && (
        <Banner
          variant="danger"
          title="Overview could not load"
          description="Check your connection and try refreshing the dashboard."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Total workforce"
          value={metrics?.total_employees ?? placeholder}
          subtitle="Employees in the directory"
          icon={<Users className="size-[18px]" />}
          variant="emerald"
        />
        <StatCard
          title="Present today"
          value={metrics?.present_today ?? placeholder}
          subtitle={
            metrics
              ? `${metrics.late_today} late arrivals reported`
              : "Daily attendance"
          }
          icon={<CalendarCheck className="size-[18px]" />}
          variant="blue"
        />
        <StatCard
          title="On leave today"
          value={metrics?.on_leave_today ?? placeholder}
          subtitle="Employee leave status"
          icon={<CalendarRange className="size-[18px]" />}
          variant="indigo"
        />
        <StatCard
          title="Pending requests"
          value={approvals ?? placeholder}
          subtitle="Leave, loans & short leave"
          icon={<ClipboardCheck className="size-[18px]" />}
          variant="amber"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <DashboardBarChart
          weeklyData={metrics?.weekly_attendance}
          totalEmployees={metrics?.total_employees}
        />
        <DashboardPieChart
          attendanceSummary={
            metrics
              ? {
                  total: metrics.total_employees,
                  present: metrics.present_today,
                  late: metrics.late_today,
                  leave: metrics.on_leave_today,
                  absent: metrics.absent_today,
                  attendance_rate: metrics.attendance_rate,
                }
              : undefined
          }
          onOpenAllAttendance={() => setShowAllAttendanceModal(true)}
        />
      </div>
      <div>
        <CardWrapper
          title="Needs your attention"
          headerClassName="!flex-row"
          description="Open the request register to review and take action"
          headerAction={
            <Button
              variant="ghost"
              size="icon"
              className="!size-8"
              aria-label="Refresh dashboard"
              isLoading={isFetching}
              onClick={() => refetch()}
            >
              <RefreshCw className="size-3.5" />
            </Button>
          }
        >
          <div className="divide-y divide-slate-100">
            {reviewRows.filter((row) => isModuleAvailable(row.tab, process.env.NEXT_PUBLIC_ENABLE_DEMO_PREVIEWS === "true")).map((row) => (
              <button
                key={row.title}
                type="button"
                onClick={() => onNavigate(row.tab)}
                className="group flex w-full items-center gap-4 rounded-lg py-3.5 text-left first:pt-1 hover:bg-slate-50"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${row.color}`}
                >
                  <row.icon className="size-[18px]" />
                </span>
                <span className="flex-1">
                  <Text
                    as="span"
                    className="block !text-[13px] !font-medium !text-slate-800"
                  >
                    {row.title}
                  </Text>
                  <Text
                    as="span"
                    variant="caption"
                    className="mt-1 block !text-[11px]"
                  >
                    {row.detail}
                  </Text>
                </span>
                <span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                  {row.count ?? "—"}
                </span>
                <ArrowRight className="size-4 text-slate-300 group-hover:text-teal-700" />
              </button>
            ))}
          </div>
        </CardWrapper>
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Title level={3} className="!text-base">
            Quick access
          </Title>
          <Text variant="caption" className="!text-[11px]">
            Your everyday HR tools
          </Text>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.tab}
              type="button"
              onClick={() => onNavigate(shortcut.tab)}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-teal-300"
            >
              <shortcut.icon className="size-5 shrink-0 text-teal-700" />
              <span className="flex-1">
                <Text
                  as="span"
                  className="block !text-xs !font-medium !text-slate-800"
                >
                  {shortcut.title}
                </Text>
                <Text
                  as="span"
                  variant="caption"
                  className="mt-1 block !text-[10px]"
                >
                  {shortcut.detail}
                </Text>
              </span>
              <ArrowUpRight className="size-4 text-slate-300 group-hover:text-teal-700" />
            </button>
          ))}
        </div>
      </div>
      {showAllAttendanceModal && (
        <AllEmployeesTodayAttendanceModal
          isOpen
          onClose={() => setShowAllAttendanceModal(false)}
        />
      )}
    </div>
  );
}
