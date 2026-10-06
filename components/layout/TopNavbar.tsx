"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  CheckCircle2,
  MapPin,
  Sparkles,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { Button, Badge } from "@/components/shared";

interface TopNavbarProps {
  onOpenSettings: () => void;
  activeToken: string;
  employeeFullId: string;
  employeeName: string;
  department?: string;
  hasPunchedIn?: boolean;
  inTime?: string | null;
  lastOutTime?: string | null;
  workingHours?: string | null;
  onPunchIn?: () => void;
  onPunchOut?: () => void;
  onQuickPunch?: () => void;
  isPunchedIn?: boolean;
  onOpenPermissions?: () => void;
  onSwitchEmployee?: (emp: { id: number | string; fullId: string; name: string; department: string }) => void;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export const PERSONA_PRESETS = [
  { id: 9, fullId: "SMT-0026", name: "Nusrat Jahan", department: "Product Design" },
  { id: 100, fullId: "SMT-0001", name: "System Administrator", department: "Administration" },
  { id: 1, fullId: "SMT-0051", name: "Abdul Halim", department: "Sales & Distribution" },
  { id: 10, fullId: "SMT-0042", name: "Tanvir Ahmed", department: "Engineering" },
  { id: 6, fullId: "SMT-0007", name: "Ariful Islam", department: "Human Resources" },
];

export function TopNavbar({
  onOpenSettings,
  activeToken,
  employeeFullId,
  employeeName,
  department = "Sales & Distribution",
  hasPunchedIn = false,
  inTime = null,
  lastOutTime = null,
  workingHours = null,
  onPunchIn,
  onPunchOut,
  onQuickPunch,
  isPunchedIn,
  onOpenPermissions,
  onSwitchEmployee,
  onLogout,
  onToggleSidebar,
}: TopNavbarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-300 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Left Corporate Status Area */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Navigation Drawer Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-800 hover:text-slate-950 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile Brand / App Badge */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-slate-900 text-xs tracking-tight hidden xs:inline sm:inline">
            Smart HRM
          </span>
        </div>

        {/* Company & Branch Tag (Desktop Only) */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs">
          <MapPin className="h-3.5 w-3.5 text-slate-900 shrink-0" />
          <span>Smart Tech (BD) Ltd. &bull; Dhaka HQ</span>
        </div>

        {/* Live Dhaka Time & Biometric status */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 px-2.5 sm:px-3 py-1.5 rounded-xl shadow-2xs">
          <Clock className="h-3.5 w-3.5 text-slate-900 shrink-0" />
          <span className="font-mono text-slate-950 font-extrabold text-[11px] sm:text-xs">{time || "09:00:00 AM"}</span>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            ZKTeco BioSync
          </span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Attendance Punch Controls: In Once, Out Unlimited */}
        {!hasPunchedIn ? (
          <Button
            variant="default"
            size="sm"
            onClick={onPunchIn || onQuickPunch}
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold shadow-sm text-xs h-9 px-2.5 sm:px-3"
            title="Punch In: Permitted once per day"
          >
            <span className="hidden sm:inline">Punch In</span>
            <span className="sm:hidden">In</span>
          </Button>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 rounded-xl shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>In: <strong className="font-mono text-emerald-950">{inTime || "09:00 AM"}</strong></span>
              {workingHours && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono text-emerald-800 font-extrabold">Duty: {workingHours}</span>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onPunchOut || onQuickPunch}
              leftIcon={<LogOut className="h-3.5 w-3.5 text-rose-600 shrink-0" />}
              className="border-2 border-rose-300 bg-white hover:bg-rose-50 text-rose-900 font-extrabold text-xs shadow-2xs h-9 px-2.5 sm:px-3"
              title="Punch out anytime. The last punch out calculates total duty hours."
            >
              <span className="hidden sm:inline">Punch Out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        )}

        {/* Notification Bell */}
        <button
          onClick={onOpenSettings}
          className="relative p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-300 shrink-0"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
        </button>

        {/* User Profile Avatar Chip & Persona Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-3 border-l border-slate-300">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0">
            {employeeFullId.slice(-2)}
          </div>
          {onSwitchEmployee ? (
            <div className="text-left">
              <select
                value={employeeFullId}
                onChange={(e) => {
                  const target = PERSONA_PRESETS.find((p) => p.fullId === e.target.value);
                  if (target) onSwitchEmployee(target);
                }}
                className="max-w-[85px] sm:max-w-[170px] md:max-w-none text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-1.5 sm:px-2 py-1 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs truncate"
                title="Switch active employee to test permissions"
              >
                {PERSONA_PRESETS.map((p) => (
                  <option key={p.fullId} value={p.fullId}>
                    {p.name} ({p.department})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {employeeName}
              </p>
              <p className="text-[10px] text-slate-600 font-semibold font-mono">
                {employeeFullId} &bull; {department}
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 p-2 sm:px-3 sm:py-2 text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-300 hover:border-rose-600 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs shrink-0"
            title="Logout / Sign out"
            aria-label="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
