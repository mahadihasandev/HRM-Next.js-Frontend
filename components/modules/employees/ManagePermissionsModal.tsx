"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Check,
  Store,
  Compass,
  Banknote,
  Users,
  CalendarCheck,
  CalendarRange,
  Clock,
  Briefcase,
  RotateCcw,
  Sparkles,
  Search,
  Settings,
  Bell,
  Shuffle,
  PiggyBank,
  Lock,
  UserCheck,
} from "lucide-react";
import { Title, Subtitle, Button, Badge, Banner } from "@/components/shared";
import { Employee, EmployeePermissionProfile } from "@/types/hrm";

export interface OperatorUser {
  id: number | string;
  fullId: string;
  name: string;
  department: string;
}

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  operator?: OperatorUser;
  isAdmin?: boolean;
  availableEmployees?: OperatorUser[];
  onSelectEmployee?: (emp: OperatorUser) => void;
  onSwitchOperatorToAdmin?: () => void;
  onPermissionsUpdated?: (profile: EmployeePermissionProfile) => void;
}

interface PermissionCardItem {
  key: string;
  name: string;
  desc: string;
  module: string;
  category: "navigation" | "action";
  icon: React.ElementType;
}

const ALL_SYSTEM_PERMISSIONS: PermissionCardItem[] = [
  // Commercial & Field Force
  {
    key: "module.snd",
    name: "SND Distribution Network",
    desc: "Access dealer network, retail outlets, primary sales orders, and depots",
    module: "snd",
    category: "navigation",
    icon: Store,
  },
  {
    key: "module.sfm",
    name: "SFM Field Force Management",
    desc: "Field targets, monthly commitments, shop visit reports, and SR quotas",
    module: "sfm",
    category: "navigation",
    icon: Compass,
  },
  {
    key: "action.snd.orders",
    name: "Create & Punch SND Orders",
    desc: "Authorize and submit distributor purchase orders into the system",
    module: "snd",
    category: "action",
    icon: Store,
  },
  {
    key: "action.sfm.commitments",
    name: "Assign SFM Target Quotas",
    desc: "Allocate monthly sales quotas, PCMO/HDDO volume targets to SRs",
    module: "sfm",
    category: "action",
    icon: Compass,
  },

  // Core HRM & Workforce Navigation
  {
    key: "module.dashboard",
    name: "Executive Dashboard",
    desc: "View corporate summaries, workforce headcount, and organizational metrics",
    module: "dashboard",
    category: "navigation",
    icon: ShieldCheck,
  },
  {
    key: "module.employees",
    name: "Employee Directory",
    desc: "Browse personnel records, designations, and public contact cards",
    module: "employees",
    category: "navigation",
    icon: Users,
  },
  {
    key: "module.attendance",
    name: "Attendance & Job Card",
    desc: "Inspect employee monthly attendance, biometrics, and shift logs",
    module: "attendance",
    category: "navigation",
    icon: CalendarCheck,
  },
  {
    key: "module.leave",
    name: "Leave Management",
    desc: "View annual and medical leave balances under BLA 2006 compliance",
    module: "leave",
    category: "navigation",
    icon: CalendarRange,
  },
  {
    key: "module.salary",
    name: "Salary & Payroll Management",
    desc: "Inspect monthly payroll disbursements, basic pay, and payslips",
    module: "salary",
    category: "navigation",
    icon: Banknote,
  },
  {
    key: "module.loans",
    name: "Company Loans & Advance",
    desc: "Inspect provident fund loan applications and repayment status",
    module: "loans",
    category: "navigation",
    icon: PiggyBank,
  },
  {
    key: "module.requests",
    name: "Short Leave & IOM Requests",
    desc: "View manual punch requests, late entry explanations, and IOM movement",
    module: "requests",
    category: "navigation",
    icon: Clock,
  },
  {
    key: "module.shifts",
    name: "Shift Roster & Exchange",
    desc: "View shift assignments, duty schedules, and roster exchanges",
    module: "shifts",
    category: "navigation",
    icon: Shuffle,
  },
  {
    key: "module.outwork",
    name: "Tour Plans & DA/TA Claims",
    desc: "View official tour plans, travel authorizations, and daily allowances",
    module: "outwork",
    category: "navigation",
    icon: Briefcase,
  },
  {
    key: "module.notices",
    name: "Circulars & Notice Board",
    desc: "View company-wide circulars, administrative notices, and updates",
    module: "notices",
    category: "navigation",
    icon: Bell,
  },
  {
    key: "module.settings",
    name: "System & Device Settings",
    desc: "Manage biometric hardware tokens, API credentials, and sync settings",
    module: "settings",
    category: "navigation",
    icon: Settings,
  },

  // Action Privileges
  {
    key: "action.employees.create",
    name: "Register New Employee",
    desc: "Create and onboard new employees into the central directory",
    module: "employees",
    category: "action",
    icon: Users,
  },
  {
    key: "action.employees.edit",
    name: "Edit Employee Record",
    desc: "Modify employee credentials, designation, and BLA salary structure",
    module: "employees",
    category: "action",
    icon: Shield,
  },
  {
    key: "action.employees.delete",
    name: "Delete Employee Record",
    desc: "Permanently delete employee profiles and associated logs from database",
    module: "employees",
    category: "action",
    icon: ShieldAlert,
  },
  {
    key: "action.leave.approve",
    name: "Approve / Reject Leaves",
    desc: "Recommend, approve, or reject employee leave applications",
    module: "leave",
    category: "action",
    icon: CalendarRange,
  },
  {
    key: "action.salary.disburse",
    name: "Disburse Monthly Salaries",
    desc: "Execute payroll disbursements and process bank transfer statements",
    module: "salary",
    category: "action",
    icon: Banknote,
  },
  {
    key: "action.loans.approve",
    name: "Sanction Staff Loans",
    desc: "Approve or reject employee provident loans and advances",
    module: "loans",
    category: "action",
    icon: PiggyBank,
  },
  {
    key: "action.notices.publish",
    name: "Publish Corporate Notices",
    desc: "Issue announcements to the digital circular board for all staff",
    module: "notices",
    category: "action",
    icon: Bell,
  },
  {
    key: "action.permissions.manage",
    name: "Manage User Permissions (RBAC)",
    desc: "Grant or revoke access permissions for any user in the system",
    module: "settings",
    category: "action",
    icon: Lock,
  },
];

export function ManagePermissionsModal({
  isOpen,
  onClose,
  employee,
  operator,
  isAdmin,
  availableEmployees,
  onSelectEmployee,
  onSwitchOperatorToAdmin,
  onPermissionsUpdated,
}: ManagePermissionsModalProps) {
  const [profile, setProfile] = useState<EmployeePermissionProfile | null>(null);
  const [effectivePerms, setEffectivePerms] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "commercial" | "workforce" | "action">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string>("");

  // Determine whether the logged-in operator is an Admin
  const computedIsAdmin =
    isAdmin !== undefined
      ? isAdmin
      : Boolean(operator?.department === "Administration" || operator?.fullId === "SMT-0001");

  // Keep target ID in sync with employee prop
  useEffect(() => {
    if (employee) {
      setTargetId(employee.employee_full_id || String(employee.id));
    }
  }, [employee]);

  // Fetch target employee permissions whenever modal opens or target changes
  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;
    setIsLoading(true);
    setFeedback(null);
    setErrorMessage(null);
    setSearch("");
    setCategoryFilter("all");

    const fetchPermissions = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/hrm/permissions/employee/${targetId}`);
        if (!res.ok) throw new Error("Failed to load permissions from API");

        const json: EmployeePermissionProfile = await res.json();
        if (isMounted) {
          setProfile(json);
          setEffectivePerms(json.effective_permissions || {});
        }
      } catch (err) {
        console.error("Could not fetch employee permissions", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPermissions();
    return () => {
      isMounted = false;
    };
  }, [isOpen, targetId]);

  const filteredItems = useMemo(() => {
    return ALL_SYSTEM_PERMISSIONS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase()) ||
        item.key.toLowerCase().includes(search.toLowerCase()) ||
        item.module.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryFilter === "all") return true;
      if (categoryFilter === "commercial") return item.module === "snd" || item.module === "sfm";
      if (categoryFilter === "action") return item.category === "action";
      if (categoryFilter === "workforce")
        return item.category === "navigation" && item.module !== "snd" && item.module !== "sfm";
      return true;
    });
  }, [search, categoryFilter]);

  if (!isOpen) return null;

  const togglePermission = (key: string) => {
    if (!computedIsAdmin) {
      setErrorMessage("Access Denied: Only Admin-level accounts are authorized to modify permissions.");
      return;
    }
    setEffectivePerms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGrantAll = () => {
    if (!computedIsAdmin) return;
    const updated: Record<string, boolean> = {};
    ALL_SYSTEM_PERMISSIONS.forEach((item) => {
      updated[item.key] = true;
    });
    setEffectivePerms(updated);
  };

  const handleRevokeAll = () => {
    if (!computedIsAdmin) return;
    const updated: Record<string, boolean> = {};
    ALL_SYSTEM_PERMISSIONS.forEach((item) => {
      updated[item.key] = false;
    });
    setEffectivePerms(updated);
  };

  const handleGrantSndSfm = () => {
    if (!computedIsAdmin) return;
    setEffectivePerms((prev) => ({
      ...prev,
      "module.snd": true,
      "module.sfm": true,
      "action.snd.orders": true,
      "action.sfm.commitments": true,
    }));
  };

  const handleResetToDefaults = () => {
    if (!computedIsAdmin) return;
    if (profile?.department_defaults) {
      setEffectivePerms({ ...profile.department_defaults });
    }
  };

  const handleSave = async () => {
    if (!computedIsAdmin) {
      setErrorMessage("Access Denied: Only Admin-level accounts can grant or modify employee permissions.");
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    setErrorMessage(null);

    try {
      const activeOperatorId = operator?.fullId || "SMT-0001";
      const activeOperatorName = operator?.name || "System Administrator";

      const res = await fetch(`http://127.0.0.1:8000/api/hrm/permissions/employee/${targetId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Operator-Id": activeOperatorId,
          ...(computedIsAdmin ? { "X-Admin-Role": "admin" } : {}),
        },
        body: JSON.stringify({
          permissions: effectivePerms,
          operator_id: activeOperatorId,
          granted_by: activeOperatorName,
        }),
      });

      if (res.status === 403) {
        const errJson: { message?: string } = await res.json().catch(() => ({}));
        setErrorMessage(
          errJson.message || "Access Denied: Only Admin-level accounts have permission to grant or modify access rights."
        );
        return;
      }

      if (!res.ok) throw new Error("Failed to save permissions on server");

      const updatedProfile: EmployeePermissionProfile = await res.json();
      setProfile(updatedProfile);
      setEffectivePerms(updatedProfile.effective_permissions || {});
      setFeedback(`✓ Permissions for ${profile?.employee?.name || targetId} updated successfully in central database!`);

      if (onPermissionsUpdated) {
        onPermissionsUpdated(updatedProfile);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setErrorMessage("Error saving permissions: " + msg);
    } finally {
      setIsSaving(false);
    }
  };

  const allowedCount = Object.values(effectivePerms).filter(Boolean).length;
  const totalCount = ALL_SYSTEM_PERMISSIONS.length;
  const currentEmpData = profile?.employee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-7 shadow-2xl border-2 border-slate-300 relative my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200 shrink-0">
          <div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-md shadow-slate-900/30 shrink-0">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Title level={2} className="text-xl font-black text-gray-700 leading-tight">
                Access Control & Permissions Policy
              </Title>
              <Badge variant="default" className="text-[10px] font-mono font-bold bg-slate-900 text-white">
                {allowedCount}/{totalCount} Active
              </Badge>
              {computedIsAdmin ? (
                <Badge variant="success" className="text-[10px] font-extrabold flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" /> Admin Authorized
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-[10px] font-extrabold flex items-center gap-1 bg-rose-100 text-rose-900 border border-rose-300">
                  <Lock className="h-3 w-3 text-rose-700" /> Read-Only Mode
                </Badge>
              )}
            </div>
            <Subtitle className="text-xs text-slate-700 font-medium mt-0.5">
              Strict RBAC: Only Admin-level accounts can grant, revoke, or modify module access and actions.
            </Subtitle>
          </div>
        </div>

        {/* Non-Admin Locked Warning Notice */}
        {!computedIsAdmin && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 my-3 flex items-start gap-3 shrink-0 animate-in fade-in">
            <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-black text-amber-950">Administrative Gating Active: Read-Only View</p>
              <p className="text-[11px] text-amber-900 font-semibold mt-0.5 leading-relaxed">
                Only Admin-level accounts (<span className="font-extrabold">Administration Department / SMT-0001</span>)
                are authorized to grant, revoke, or modify employee permissions. All controls are locked.
              </p>
              {onSwitchOperatorToAdmin && (
                <Button
                  type="button"
                  size="sm"
                  onClick={onSwitchOperatorToAdmin}
                  className="mt-2 text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white h-7 px-3 gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5 text-emerald-400" /> Switch to System Admin (SMT-0001)
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Target Employee Switcher & Card */}
        <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 my-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {currentEmpData?.name?.slice(0, 2).toUpperCase() || targetId.slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Configuring Target:</span>
                <span className="font-black text-sm text-slate-950">{currentEmpData?.name || "Loading..."}</span>
              </div>
              <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
                {currentEmpData?.designation || "Personnel"} &bull; <span className="font-mono font-bold text-slate-900">{currentEmpData?.employee_full_id || targetId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {availableEmployees && availableEmployees.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">Switch Target:</span>
                <select
                  value={targetId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setTargetId(nextId);
                    const selected = availableEmployees.find((p) => p.fullId === nextId);
                    if (selected && onSelectEmployee) {
                      onSelectEmployee(selected);
                    }
                  }}
                  className="text-xs font-extrabold text-slate-950 bg-white border-2 border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
                  title="Switch target personnel to configure"
                >
                  {availableEmployees.map((emp) => (
                    <option key={emp.fullId} value={emp.fullId}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Badge variant="default" className="font-extrabold text-xs bg-slate-900 text-white">
              {currentEmpData?.department || "General"}
            </Badge>
          </div>
        </div>

        {/* Feedback / Error Banners */}
        {feedback && (
          <div className="my-1 shrink-0">
            <Banner
              variant="success"
              title="Permissions Deployed"
              description={feedback}
              isDismissible
              onClose={() => setFeedback(null)}
            />
          </div>
        )}

        {errorMessage && (
          <div className="my-1 shrink-0">
            <Banner
              variant="danger"
              title="Authorization Error"
              description={errorMessage}
              isDismissible
              onClose={() => setErrorMessage(null)}
            />
          </div>
        )}

        {/* Quick Bulk Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-blue-50/90 border border-blue-200 rounded-xl my-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-blue-950 font-black">
            <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Bulk Actions:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!computedIsAdmin || isSaving}
              onClick={handleGrantSndSfm}
              className="text-[11px] font-bold bg-white text-blue-900 border-blue-300 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2.5"
            >
              + Grant SND & SFM
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!computedIsAdmin || isSaving}
              onClick={handleGrantAll}
              className="text-[11px] font-bold bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2.5"
            >
              Grant All (Full Access)
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!computedIsAdmin || isSaving}
              onClick={handleResetToDefaults}
              leftIcon={<RotateCcw className="h-3 w-3" />}
              className="text-[11px] font-bold bg-white text-slate-800 border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2.5"
            >
              Reset to Defaults
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!computedIsAdmin || isSaving}
              onClick={handleRevokeAll}
              className="text-[11px] font-bold bg-white text-rose-800 border-rose-300 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2.5"
            >
              Revoke All Options (0 Allowed)
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-2 shrink-0">
          <div className="flex-1 w-full relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search permissions by name, module, or key (e.g. snd, sfm, delete, salary)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All ({ALL_SYSTEM_PERMISSIONS.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("commercial")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === "commercial"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              SND & SFM (4)
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("workforce")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === "workforce"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              HRM Modules (11)
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("action")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === "action"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Actions (8)
            </button>
          </div>
        </div>

        {/* Permissions Toggles List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-slate-600 font-semibold">
              Loading permissions from central database...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 font-semibold">
              No permissions match your search query.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isGranted = Boolean(effectivePerms[item.key]);
              const isDeptDefault = Boolean(profile?.department_defaults?.[item.key]);
              const isOverride = isGranted !== isDeptDefault;
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  onClick={computedIsAdmin ? () => togglePermission(item.key) : undefined}
                  className={`flex items-start justify-between p-3 rounded-xl border-2 transition-all select-none ${
                    computedIsAdmin ? "cursor-pointer" : "cursor-not-allowed opacity-90"
                  } ${
                    isGranted
                      ? "bg-emerald-50/70 border-emerald-300 hover:border-emerald-500 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isGranted ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-xs text-slate-950">{item.name}</span>
                        <span className="font-mono text-[10px] text-slate-600 font-semibold">
                          ({item.key})
                        </span>
                        {isGranted ? (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Check className="h-2.5 w-2.5" /> Allowed
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            Restricted
                          </span>
                        )}

                        {isOverride && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                            Admin Override
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Switch */}
                  <div className="shrink-0 pt-0.5">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isGranted}
                      disabled={!computedIsAdmin}
                      className={`w-11 h-6 flex items-center rounded-full p-1 duration-200 ${
                        computedIsAdmin ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                      } ${
                        isGranted ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-200 shrink-0">
          <p className="text-[11px] text-slate-600 font-medium">
            <span className="font-bold text-slate-900">{allowedCount} of {totalCount}</span> options allowed for this personnel.
          </p>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-slate-300 text-slate-900 font-bold hover:bg-slate-100 w-full sm:w-auto"
            >
              Cancel
            </Button>

            {computedIsAdmin ? (
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black shadow-md gap-1.5 w-full sm:w-auto"
              >
                {isSaving ? "Saving Policy..." : "Save & Deploy Permission Policies"}
              </Button>
            ) : (
              <Button
                type="button"
                disabled
                className="bg-slate-200 text-slate-500 border border-slate-300 font-bold cursor-not-allowed gap-1.5 w-full sm:w-auto"
                leftIcon={<Lock className="h-4 w-4" />}
              >
                Admin Authorization Required
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
