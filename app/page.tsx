"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { TopNavbar, PERSONA_PRESETS } from "@/components/layout/TopNavbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { DashboardView } from "@/components/modules/dashboard/DashboardView";
import { EmployeeDirectoryView } from "@/components/modules/employees/EmployeeDirectoryView";
import { AttendanceView } from "@/components/modules/attendance/AttendanceView";
import { AllEmployeesTodayAttendanceView } from "@/components/modules/attendance/AllEmployeesTodayAttendanceView";
import { LeaveManagementView } from "@/components/modules/leave/LeaveManagementView";
import { SalaryPayrollView } from "@/components/modules/payroll/SalaryPayrollView";
import { AccountingView } from "@/components/modules/accounting/AccountingView";
import { RequestsView } from "@/components/modules/requests/RequestsView";
import { LoansClaimsView } from "@/components/modules/loans-claims/LoansClaimsView";
import { SndManagementView } from "@/components/modules/snd/SndManagementView";
import { SfmManagementView } from "@/components/modules/sfm/SfmManagementView";
import { NoticesView } from "@/components/modules/notices/NoticesView";
import { HRSetupView } from "@/components/modules/hr-setup/HRSetupView";
import { RecruitmentView } from "@/components/modules/recruitment/RecruitmentView";
import { CommissionView } from "@/components/modules/commission/CommissionView";
import { DeviceIntegrationView } from "@/components/modules/attendance/DeviceIntegrationView";
import { PerformanceLettersView } from "@/components/modules/performance/PerformanceLettersView";
import { EmployeeSubTab } from "@/components/modules/employees/EmployeeDirectoryView";
import { ApiCredentialsModal } from "@/components/modules/settings/ApiCredentialsModal";
import { ManagePermissionsModal } from "@/components/modules/employees/ManagePermissionsModal";
import { Employee, EmployeePermissionProfile } from "@/types/hrm";
import { ShieldAlert, UserCheck, ShieldCheck } from "lucide-react";
import { Button, Title, CardWrapper, Badge } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, setUser } from "@/store/authSlice";
import { LoginView } from "@/components/modules/auth/LoginView";
import toast from "react-hot-toast";

interface ActiveEmployeeState {
  id: number | string;
  fullId: string;
  name: string;
  department: string;
}

const DEFAULT_EMPLOYEE: ActiveEmployeeState = PERSONA_PRESETS[0];

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function AppHome() {
  const dispatch = useAppDispatch();
  const { user: authUser, token: authToken } = useAppSelector((state) => state.auth);
  const isMounted = useIsClient();
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [activeSubOption, setActiveSubOption] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [switchedPersona, setSwitchedPersona] = useState<ActiveEmployeeState | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [activeToken, setActiveToken] = useState("");
  const [todayAttendance, setTodayAttendance] = useState<{
    hasPunchedIn: boolean;
    inTime: string | null;
    lastOutTime: string | null;
    workingHours: string | null;
    overtimeHours: string | null;
  }>({
    hasPunchedIn: false,
    inTime: null,
    lastOutTime: null,
    workingHours: null,
    overtimeHours: null,
  });
  const [isGrantingQuick, setIsGrantingQuick] = useState(false);

  // Derived current employee without cascading setState in effects
  const rawFullId = authUser?.fullId || authUser?.email || "SMT-0001";
  const normalizedFullId =
    rawFullId.toLowerCase() === "admin@smart.com" ||
    rawFullId.toLowerCase() === "admin@smarterp.biz" ||
    rawFullId.toLowerCase() === "admin"
      ? "SMT-0001"
      : rawFullId;

  const currentEmployee: ActiveEmployeeState =
    switchedPersona ??
    (authUser
      ? {
          id: authUser.id,
          fullId: normalizedFullId,
          name: authUser.name,
          department: authUser.department || "Administration",
        }
      : DEFAULT_EMPLOYEE);

  const effectiveToken = authToken || activeToken;

  const fetchPermissions = useCallback(async (fullId: string) => {
    try {
      const canonicalId =
        fullId.toLowerCase() === "admin@smart.com" ||
        fullId.toLowerCase() === "admin@smarterp.biz" ||
        fullId.toLowerCase() === "admin"
          ? "SMT-0001"
          : fullId;
      const res = await fetch(`http://127.0.0.1:8000/api/hrm/permissions/employee/${canonicalId}`);
      if (!res.ok) return;
      const data: EmployeePermissionProfile = await res.json();
      if (data?.effective_permissions) {
        setPermissions(data.effective_permissions);
      }
    } catch (err) {
      console.warn("Could not fetch remote permissions", err);
    }
  }, []);

  const fetchTodayAttendance = useCallback(async (fullId: string) => {
    try {
      const canonicalId =
        fullId.toLowerCase() === "admin@smart.com" ||
        fullId.toLowerCase() === "admin@smarterp.biz" ||
        fullId.toLowerCase() === "admin"
          ? "SMT-0001"
          : fullId;
      const res = await fetch(
        `http://127.0.0.1:8000/api/hrm/check-today-attendance?employee_full_id=${canonicalId}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data) {
        setTodayAttendance({
          hasPunchedIn: Boolean(json.data.has_punched_in),
          inTime: json.data.in_time || null,
          lastOutTime: json.data.out_time || null,
          workingHours: json.data.working_hours || null,
          overtimeHours: json.data.overtime_hours || null,
        });
      }
    } catch (err) {
      console.warn("Could not fetch today attendance", err);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    if (!authUser || !currentEmployee.fullId) return;

    const canonicalId =
      currentEmployee.fullId.toLowerCase() === "admin@smart.com" ||
      currentEmployee.fullId.toLowerCase() === "admin@smarterp.biz" ||
      currentEmployee.fullId.toLowerCase() === "admin"
        ? "SMT-0001"
        : currentEmployee.fullId;

    const loadRemoteData = async () => {
      try {
        const [permRes, attRes] = await Promise.allSettled([
          fetch(`http://127.0.0.1:8000/api/hrm/permissions/employee/${canonicalId}`),
          fetch(`http://127.0.0.1:8000/api/hrm/check-today-attendance?employee_full_id=${canonicalId}`),
        ]);

        if (!ignore && permRes.status === "fulfilled" && permRes.value.ok) {
          const data: EmployeePermissionProfile = await permRes.value.json();
          if (data?.effective_permissions) {
            setPermissions(data.effective_permissions);
          }
        }

        if (!ignore && attRes.status === "fulfilled" && attRes.value.ok) {
          const json = await attRes.value.json();
          if (json?.data) {
            setTodayAttendance({
              hasPunchedIn: Boolean(json.data.has_punched_in),
              inTime: json.data.in_time || null,
              lastOutTime: json.data.out_time || null,
              workingHours: json.data.working_hours || null,
              overtimeHours: json.data.overtime_hours || null,
            });
          }
        }
      } catch (err) {
        console.warn("Could not load employee permissions or attendance", err);
      }
    };

    void loadRemoteData();

    return () => {
      ignore = true;
    };
  }, [authUser, currentEmployee.fullId]);

  const handlePunchIn = async () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
    };

    try {
      let res = await fetch("http://127.0.0.1:8000/api/hrm/punch-in", {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify({
          employee_full_id: currentEmployee.fullId,
          time: nowTime,
          location: "Dhaka Headquarters",
        }),
      });

      if (res.status === 404) {
        res = await fetch("http://127.0.0.1:8000/api/v1/hrm/punch-in", {
          method: "POST",
          headers: reqHeaders,
          body: JSON.stringify({
            employee_full_id: currentEmployee.fullId,
            time: nowTime,
            location: "Dhaka Headquarters",
          }),
        });
      }

      const json = await res.json();
      if (res.ok && json.status) {
        setTodayAttendance((prev) => ({
          ...prev,
          hasPunchedIn: true,
          inTime: json.data?.in_time || nowTime,
        }));
        toast.success(json.message || `Successfully Punched In at ${json.data?.in_time || nowTime}`);
      } else {
        toast.error(json.message || "An employee can only punch in once per day.");
      }
    } catch (err: unknown) {
      console.error("Punch In failed", err);
      toast.error("Punch In failed. Please verify your connection.");
    }
  };

  const handlePunchOut = async () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const reqHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
    };

    try {
      let res = await fetch("http://127.0.0.1:8000/api/hrm/punch-out", {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify({
          employee_full_id: currentEmployee.fullId,
          time: nowTime,
        }),
      });

      if (res.status === 404) {
        res = await fetch("http://127.0.0.1:8000/api/v1/hrm/punch-out", {
          method: "POST",
          headers: reqHeaders,
          body: JSON.stringify({
            employee_full_id: currentEmployee.fullId,
            time: nowTime,
          }),
        });
      }

      const json = await res.json();
      if (res.ok && json.status) {
        setTodayAttendance((prev) => ({
          ...prev,
          lastOutTime: json.data?.out_time || nowTime,
          workingHours: json.data?.working_hours || null,
          overtimeHours: json.data?.overtime_hours || null,
        }));
        toast.success(json.message || `Punch Out recorded at ${json.data?.out_time || nowTime}`);
      } else {
        toast.error(json.message || "You must punch in first before punching out.");
      }
    } catch (err: unknown) {
      console.error("Punch Out failed", err);
      toast.error("Punch Out failed. Please try again.");
    }
  };

  const handleTabChange = (tab: NavTab, subOption?: string) => {
    if (tab === "settings") {
      setIsSettingsOpen(true);
    } else {
      setActiveTab(tab);
      setActiveSubOption(subOption);
    }
  };

  const handleSwitchEmployee = (emp: ActiveEmployeeState) => {
    setSwitchedPersona(emp);
    dispatch(
      setUser({
        user: {
          id: emp.id,
          fullId: emp.fullId,
          name: emp.name,
          department: emp.department,
          email: `${emp.name.toLowerCase().replace(/[^a-z]/g, "")}@smarterp.biz`,
        },
        token: effectiveToken,
      })
    );
    // Fetch fresh permissions for the switched persona
    void fetchPermissions(emp.fullId);
    void fetchTodayAttendance(emp.fullId);
    toast.success(`Active persona switched to ${emp.name} (${emp.fullId})`);
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    // Reset attendance state on logout
    setTodayAttendance({
      hasPunchedIn: false,
      inTime: null,
      lastOutTime: null,
      workingHours: null,
      overtimeHours: null,
    });
    setActiveTab("dashboard");
    setPermissions({});
    setSwitchedPersona(null);
    dispatch(logout());
  };

  const isCurrentAdmin =
    currentEmployee.department === "Administration" || currentEmployee.fullId === "SMT-0001";

  const handleQuickGrant = async (moduleKey: string) => {
    if (!isCurrentAdmin) {
      toast.error("Access Denied: Only Admin-level accounts can grant permissions.");
      return;
    }
    setIsGrantingQuick(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/hrm/permissions/employee/${currentEmployee.fullId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Operator-Id": currentEmployee.fullId,
            "X-Admin-Role": "admin",
          },
          body: JSON.stringify({
            permission_key: moduleKey,
            is_granted: true,
            operator_id: currentEmployee.fullId,
            granted_by: currentEmployee.name,
          }),
        }
      );
      if (res.ok) {
        await fetchPermissions(currentEmployee.fullId);
        toast.success(`Access granted for ${moduleKey.replace("module.", "")}`);
      } else if (res.status === 403) {
        toast.error("Access Denied: Only Admin-level accounts can modify permissions.");
      }
    } catch (err) {
      console.error("Error granting module access", err);
      toast.error("Failed to grant permission.");
    } finally {
      setIsGrantingQuick(false);
    }
  };

  const currentEmployeeAsEntity: Employee = {
    id: currentEmployee.id,
    employee_id: currentEmployee.id,
    employee_full_id: currentEmployee.fullId,
    name: currentEmployee.name,
    designation:
      currentEmployee.department === "Product Design"
        ? "Lead UI/UX Architect"
        : currentEmployee.department === "Engineering"
        ? "Principal Backend Engineer"
        : "Senior Field Sales Manager",
    department: currentEmployee.department,
    company: "Smart Technologies (BD) Ltd.",
    email: `${currentEmployee.name.toLowerCase().replace(/[^a-z]/g, "")}@smarterp.biz`,
    status: "Active",
  };

  const canAccessActiveTab =
    activeTab === "dashboard" ||
    activeTab === "today-attendance" ||
    activeTab === "settings" ||
    permissions[`module.${activeTab}`] !== false;

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-700 tracking-wider uppercase">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  if (!authUser || !authToken) {
    return (
      <LoginView
        onLoginSuccess={(_user, token) => {
          setSwitchedPersona(null);
          setActiveToken(token);
          setActiveTab("dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-row overflow-x-clip relative">
      {/* High Contrast Enterprise Navy Sidebar with Granular RBAC */}
      <Sidebar
        activeTab={activeTab}
        activeSubOption={activeSubOption}
        onTabChange={handleTabChange}
        employeeId={currentEmployee.fullId}
        employeeName={currentEmployee.name}
        permissions={permissions}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f6fa]">
        {/* Sticky Top Navbar */}
        <TopNavbar
          onOpenSettings={() => setIsSettingsOpen(true)}
          activeToken={effectiveToken}
          employeeFullId={currentEmployee.fullId}
          employeeName={currentEmployee.name}
          department={currentEmployee.department}
          hasPunchedIn={todayAttendance.hasPunchedIn}
          inTime={todayAttendance.inTime}
          lastOutTime={todayAttendance.lastOutTime}
          workingHours={todayAttendance.workingHours}
          onPunchIn={handlePunchIn}
          onPunchOut={handlePunchOut}
          onOpenPermissions={() => setIsPermissionsOpen(true)}
          onSwitchEmployee={handleSwitchEmployee}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8 min-w-0">
          {/* Access Control Guard Screen */}
          {!canAccessActiveTab ? (
            <div className="py-8 sm:py-12 flex justify-center animate-in fade-in duration-200">
              <CardWrapper className="max-w-xl w-full p-4 sm:p-8 text-center border-2 border-slate-300">
                <div className="h-16 w-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-300">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <Title level={2} className="text-xl font-black text-gray-700">
                  Access Restricted by Role Policy
                </Title>
                <div className="flex items-center justify-center gap-2 my-2">
                  <Badge variant="warning" className="font-bold">
                    Module: {activeTab.toUpperCase()}
                  </Badge>
                  <Badge variant="default" className="font-bold">
                    User: {currentEmployee.department}
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 font-medium max-w-md mx-auto mt-2 leading-relaxed">
                  Employees in <span className="font-black text-slate-950">{currentEmployee.department}</span>{" "}
                  (such as {currentEmployee.name}) do not have default access to{" "}
                  <span className="font-black text-slate-950">
                    {activeTab === "snd"
                      ? "SND Distribution (Dealer & Sales Network)"
                      : activeTab === "sfm"
                      ? "SFM Field Force (SR Targets & Visits)"
                      : activeTab.toUpperCase()}
                  </span>
                  .
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6 text-xs text-slate-800 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Active Persona:</span>
                    <span className="font-bold">{currentEmployee.name} ({currentEmployee.fullId})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Department Policy:</span>
                    <span className="font-bold text-rose-700">Restricted (No Access)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Custom Admin Override:</span>
                    <span className="font-bold text-slate-700">Not Granted</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("dashboard")}
                    className="border-slate-300 text-slate-900 font-bold hover:bg-slate-100 w-full sm:w-auto"
                  >
                    Back to Dashboard
                  </Button>
                  {isCurrentAdmin ? (
                    <Button
                      size="sm"
                      disabled={isGrantingQuick}
                      onClick={() => handleQuickGrant(`module.${activeTab}`)}
                      leftIcon={<ShieldCheck className="h-4 w-4" />}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md shadow-emerald-700/20 w-full sm:w-auto"
                    >
                      {isGrantingQuick
                        ? "Granting..."
                        : `Grant Access to ${currentEmployee.name}`}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleSwitchEmployee(PERSONA_PRESETS[0])}
                      leftIcon={<UserCheck className="h-4 w-4 text-emerald-400" />}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black shadow-md shadow-slate-900/20 w-full sm:w-auto"
                    >
                      Switch to System Admin to Grant
                    </Button>
                  )}
                </div>
              </CardWrapper>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <DashboardView
                  onNavigate={setActiveTab}
                  hasPunchedIn={todayAttendance.hasPunchedIn}
                  inTime={todayAttendance.inTime}
                  lastOutTime={todayAttendance.lastOutTime}
                  workingHours={todayAttendance.workingHours}
                  overtimeHours={todayAttendance.overtimeHours}
                  onPunchIn={handlePunchIn}
                  onPunchOut={handlePunchOut}
                  employeeName={currentEmployee.name}
                  employeeFullId={currentEmployee.fullId}
                />
              )}

              {activeTab === "today-attendance" && (
                <AllEmployeesTodayAttendanceView onNavigate={setActiveTab} />
              )}

              {activeTab === "hr-setup" && (
                <HRSetupView
                  key={activeSubOption || "holiday"}
                  initialSection={activeSubOption}
                />
              )}

              {activeTab === "employees" && (
                <EmployeeDirectoryView
                  key={activeSubOption || "directory"}
                  currentOperator={currentEmployee}
                  isAdmin={isCurrentAdmin}
                  initialSubTab={
                    activeSubOption === "add-employee" ||
                    activeSubOption === "birthdays" ||
                    activeSubOption === "probation" ||
                    activeSubOption === "summary" ||
                    activeSubOption === "reports" ||
                    activeSubOption === "archive" ||
                    activeSubOption === "bulk-salary" ||
                    activeSubOption === "id-cards"
                      ? (activeSubOption as EmployeeSubTab)
                      : "directory"
                  }
                />
              )}

              {activeTab === "recruitment" && (
                <RecruitmentView
                  key={`recruitment-${activeSubOption || "all"}`}
                  initialSubTab={activeSubOption}
                />
              )}

              {activeTab === "commission" && (
                <CommissionView
                  key={`commission-${activeSubOption || "all"}`}
                  initialSubTab={activeSubOption}
                />
              )}

              {activeTab === "devices-logs" && (
                <DeviceIntegrationView
                  key={`devices-${activeSubOption || "all"}`}
                  initialSubTab={activeSubOption}
                />
              )}

              {activeTab === "performance" && (
                <PerformanceLettersView
                  key={`performance-${activeSubOption || "all"}`}
                  initialSubTab={activeSubOption}
                />
              )}

              {activeTab === "attendance" && (
                <AttendanceView
                  employeeFullId={currentEmployee.fullId}
                  employeeName={currentEmployee.name}
                />
              )}

              {activeTab === "leave" && <LeaveManagementView />}

              {activeTab === "salary" && (
                <SalaryPayrollView
                  currentOperator={currentEmployee}
                  isAdmin={isCurrentAdmin}
                />
              )}

              {activeTab === "accounting" && (
                <AccountingView
                  currentOperator={currentEmployee}
                  isAdmin={isCurrentAdmin}
                />
              )}

              {(activeTab === "requests" ||
                activeTab === "shifts" ||
                activeTab === "outwork") && (
                <RequestsView
                  key={`${activeTab}-${activeSubOption || "all"}`}
                  initialSubTab={
                    activeTab === "shifts"
                      ? "shifts"
                      : activeTab === "outwork"
                      ? "outwork"
                      : activeSubOption === "short-leave" ||
                        activeSubOption === "late-iom" ||
                        activeSubOption === "shifts" ||
                        activeSubOption === "outwork" ||
                        activeSubOption === "daily-work" ||
                        activeSubOption === "trainings"
                      ? activeSubOption
                      : "short-leave"
                  }
                />
              )}

              {activeTab === "loans" && <LoansClaimsView />}

              {activeTab === "snd" && <SndManagementView />}

              {activeTab === "sfm" && <SfmManagementView />}

              {activeTab === "notices" && <NoticesView />}
            </>
          )}
        </main>
      </div>

      {/* API Connection & Credentials Modal */}
      <ApiCredentialsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeToken={activeToken}
        onUpdateToken={setActiveToken}
      />

      {/* Access Control & Permissions Policy Modal */}
      <ManagePermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        employee={currentEmployeeAsEntity}
        operator={currentEmployee}
        isAdmin={isCurrentAdmin}
        availableEmployees={PERSONA_PRESETS}
        onSelectEmployee={(target) => {
          handleSwitchEmployee(target);
        }}
        onSwitchOperatorToAdmin={() => {
          handleSwitchEmployee(PERSONA_PRESETS[0]);
        }}
        onPermissionsUpdated={(updatedProfile) => {
          if (updatedProfile.employee.employee_full_id === currentEmployee.fullId) {
            setPermissions(updatedProfile.effective_permissions || {});
          }
        }}
      />

      {/* Smartphone Bottom Navigation Dock (Visible on Mobile/Tablet) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenMenu={() => setIsMobileSidebarOpen(true)}
        permissions={permissions}
      />
    </div>
  );
}
