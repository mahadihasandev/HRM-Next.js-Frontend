"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  LogOut,
  Menu,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { BrandMark, Button, Text } from "@/components/shared";
import { NAV_MODULES, type NavTab } from "./Sidebar";

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
  onSwitchEmployee?: (employee: {
    id: number | string;
    fullId: string;
    name: string;
    department: string;
  }) => void;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  activeTab?: NavTab;
  activeSubOption?: string;
}

export const PERSONA_PRESETS = [
  {
    id: 9,
    fullId: "SMT-0026",
    name: "Nusrat Jahan",
    department: "Product Design",
  },
  {
    id: 100,
    fullId: "SMT-0001",
    name: "System Administrator",
    department: "Administration",
  },
  {
    id: 1,
    fullId: "SMT-0051",
    name: "Abdul Halim",
    department: "Sales & Distribution",
  },
  {
    id: 10,
    fullId: "SMT-0042",
    name: "Tanvir Ahmed",
    department: "Engineering",
  },
  {
    id: 6,
    fullId: "SMT-0007",
    name: "Ariful Islam",
    department: "Human Resources",
  },
];

export function TopNavbar({
  onOpenSettings,
  employeeFullId,
  employeeName,
  department,
  hasPunchedIn,
  inTime,
  onPunchIn,
  onPunchOut,
  onQuickPunch,
  onOpenPermissions,
  onSwitchEmployee,
  onLogout,
  onToggleSidebar,
  activeTab = "dashboard",
  activeSubOption,
}: TopNavbarProps) {
  const [date, setDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const account = useRef<HTMLDivElement>(null);
  const accountButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () =>
      setDate(
        new Date().toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Dhaka",
        }),
      );
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!account.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        accountButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);
  const section =
    NAV_MODULES.find((module) => module.id === activeTab)?.label || "Workspace";
  const subsection = NAV_MODULES.find((module) => module.id === activeTab)?.subItems?.find((item) => item.id === activeSubOption)?.label;
  const initials = employeeName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return (
    <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <BrandMark className="!size-8 !rounded-lg lg:hidden" />
        <div className="hidden min-w-0 items-center gap-2 text-xs sm:flex">
          <span className="text-slate-400">Workspace</span>
          <ChevronRight className="size-3 text-slate-300" />
          <span className="font-medium text-slate-800">{section}</span>
          {subsection && <>
            <ChevronRight className="size-3 shrink-0 text-slate-300" />
            <span className="truncate text-slate-500">{subsection}</span>
          </>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <Text
          variant="caption"
          className="hidden !font-normal !text-slate-500 xl:block"
        >
          {date}
        </Text>
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />
        {hasPunchedIn && inTime && (
          <Text
            variant="caption"
            className="hidden !font-normal !text-teal-700 md:block"
          >
            In at {inTime}
          </Text>
        )}
        <Button
          size="sm"
          variant={hasPunchedIn ? "outline" : "default"}
          onClick={
            hasPunchedIn
              ? onPunchOut || onQuickPunch
              : onPunchIn || onQuickPunch
          }
          leftIcon={<Clock3 className="size-3.5" />}
          className="!h-9 !rounded-lg !px-3"
          aria-label={hasPunchedIn ? "Punch out" : "Punch in"}
        >
          {hasPunchedIn ? "Punch out" : "Punch in"}
        </Button>
        <div ref={account} className="relative">
          <button
            ref={accountButton}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="account-panel"
            aria-label="Open account menu"
            className="flex items-center gap-2.5 rounded-xl py-1 text-left focus-visible:outline-2 focus-visible:outline-teal-700"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">
              {initials}
            </span>
            <span className="hidden max-w-40 sm:block">
              <Text
                as="span"
                className="block truncate !text-xs !font-semibold"
              >
                {employeeName}
              </Text>
              <Text
                as="span"
                variant="caption"
                className="mt-1 block truncate !text-[10px] !font-normal !text-slate-500"
              >
                {department}
              </Text>
            </span>
            <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
          </button>
          {menuOpen && (
            <div
              id="account-panel"
              className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
            >
              <div className="mb-1 border-b border-slate-100 px-3 py-3">
                <Text className="!text-sm !font-semibold">{employeeName}</Text>
                <Text
                  variant="caption"
                  className="mt-1 !font-normal !text-slate-500"
                >
                  {employeeFullId} · {department}
                </Text>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSettings();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-600 hover:bg-slate-50"
              >
                <Settings2 className="size-4" />
                Integrations & settings
              </button>
              {onOpenPermissions && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPermissions();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <ShieldCheck className="size-4" />
                  Access permissions
                </button>
              )}
              {process.env.NEXT_PUBLIC_ENABLE_DEMO_PREVIEWS === "true" &&
                onSwitchEmployee && (
                  <label className="block border-t border-slate-100 px-3 py-3 text-xs text-slate-500">
                    Preview persona
                    <select
                      aria-label="Preview persona"
                      value={employeeFullId}
                      onChange={(event) => {
                        const persona = PERSONA_PRESETS.find(
                          (item) => item.fullId === event.target.value,
                        );
                        if (persona) {
                          onSwitchEmployee(persona);
                          setMenuOpen(false);
                        }
                      }}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-2"
                    >
                      <option value={employeeFullId}>{employeeName}</option>
                      {PERSONA_PRESETS.filter(
                        (item) => item.fullId !== employeeFullId,
                      ).map((item) => (
                        <option key={item.fullId} value={item.fullId}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-lg border-t border-slate-100 px-3 py-2.5 text-xs text-rose-700 hover:bg-rose-50"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
