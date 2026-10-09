"use client";

import { isModuleAvailable } from "@/lib/navigation";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  CalendarCheck,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Factory,
  FileText,
  LogOut,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Badge,
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
  isPunchedIn = false,
  onQuickPunch,
  hasPunchedIn = false,
  inTime,
  lastOutTime,
  workingHours,
  overtimeHours,
  onPunchIn,
  onPunchOut,
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
  const [postMobilePunch, { isLoading: isPunching }] =
    usePostMobilePunchMutation();
  const [showAllAttendanceModal, setShowAllAttendanceModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: "success" | "danger";
    message: string;
  } | null>(null);
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
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Dhaka",
  });
  async function fallbackPunch() {
    try {
      await postMobilePunch({
        latitude: 23.8058,
        longitude: 90.3533,
        note: isPunchedIn ? "Clock out" : "Clock in",
      }).unwrap();
      onQuickPunch?.();
      setFeedback({
        variant: "success",
        message: "Your attendance has been recorded.",
      });
    } catch {
      setFeedback({
        variant: "danger",
        message: "Attendance could not be recorded. Please try again.",
      });
    }
  }
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
      <section className="relative overflow-hidden rounded-2xl bg-[#123f40] px-6 py-6 text-white sm:px-8 sm:py-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-32 size-96 rounded-full border-[50px] border-teal-300/5"
        />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Text
              variant="caption"
              className="!text-[10px] !font-medium !tracking-[.14em] !text-teal-200/80"
            >
              {today.toUpperCase()}
            </Text>
            <Title
              level={2}
              className="mt-2 !text-2xl !font-medium !text-white sm:!text-[28px]"
            >
              Welcome back, {employeeName.split(" ")[0] || "colleague"}
              <span className="text-teal-300">.</span>
            </Title>
            <Text className="mt-2 max-w-xl !text-sm !text-teal-100/80">
              Keep people connected and your factory moving. Start with what
              needs your attention today.
            </Text>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate("leave")}
            className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
            rightIcon={<ArrowUpRight className="size-4" />}
          >
            Apply for leave
          </Button>
        </div>
      </section>
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
      {feedback && (
        <Banner
          variant={feedback.variant}
          title={feedback.message}
          isDismissible
          onClose={() => setFeedback(null)}
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
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
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
        <CardWrapper
          title="My attendance"
          description={`${employeeFullId} · Today's punch record`}
          headerAction={
            <Badge variant={hasPunchedIn ? "success" : "secondary"}>
              {hasPunchedIn ? "Punched in" : "Not punched in"}
            </Badge>
          }
        >
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
            <div>
              <Text variant="caption" className="!text-[11px]">
                Punch in
              </Text>
              <Text className="mt-1 !text-lg !font-semibold !text-slate-800 tabular-nums">
                {inTime || "—"}
              </Text>
            </div>
            <div>
              <Text variant="caption" className="!text-[11px]">
                Last punch out
              </Text>
              <Text className="mt-1 !text-lg !font-semibold !text-slate-800 tabular-nums">
                {lastOutTime || "—"}
              </Text>
            </div>
          </div>
          <div className="my-4 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              Duty hours
            </span>
            <span className="font-medium text-slate-700">
              {workingHours || "Awaiting punch out"}
            </span>
          </div>
          {overtimeHours && (
            <Text variant="caption" className="mb-3">
              Overtime: {overtimeHours}
            </Text>
          )}
          <Button
            className="w-full"
            variant={hasPunchedIn ? "outline" : "default"}
            onClick={
              hasPunchedIn
                ? onPunchOut || fallbackPunch
                : onPunchIn || fallbackPunch
            }
            isLoading={isPunching}
            leftIcon={
              hasPunchedIn ? (
                <LogOut className="size-4" />
              ) : (
                <CheckCircle2 className="size-4" />
              )
            }
          >
            {hasPunchedIn ? "Punch out" : "Punch in now"}
          </Button>
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
