"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarRange,
  Banknote,
  Landmark,
  Clock,
  Shuffle,
  Briefcase,
  PiggyBank,
  Bell,
  Settings,
  ChevronDown,
  Store,
  Compass,
  X,
  Sliders,
  UserPlus,
  Coins,
  Server,
  Award,
  Factory,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark, SearchInput, Text } from "@/components/shared";

export type NavTab =
  | "dashboard"
  | "today-attendance"
  | "employees"
  | "hr-setup"
  | "recruitment"
  | "commission"
  | "devices-logs"
  | "attendance"
  | "leave"
  | "salary"
  | "factory"
  | "people"
  | "accounting"
  | "snd"
  | "sfm"
  | "requests"
  | "shifts"
  | "outwork"
  | "loans"
  | "performance"
  | "notices"
  | "settings";

export interface NavSubItem {
  id: string;
  label: string;
  badge?: string;
}

export interface NavModule {
  id: NavTab;
  label: string;
  sub?: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning";
  subItems?: NavSubItem[];
}

export interface SidebarProps {
  activeTab: NavTab;
  activeSubOption?: string;
  onTabChange: (tab: NavTab, subOption?: string) => void;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  permissions?: Record<string, boolean>;
  isOpen?: boolean;
  onClose?: () => void;
}

export const NAV_MODULES: NavModule[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    sub: "Overview & Real-time Analytics",
    icon: LayoutDashboard,
  },
  {
    id: "today-attendance",
    label: "Today's Attendance",
    sub: "Daily workforce roster",
    icon: CalendarCheck,
    badgeVariant: "success",
  },
  {
    id: "employees",
    label: "Employees",
    sub: "Workforce & Profiles",
    icon: Users,
    badgeVariant: "default",
    subItems: [
      { id: "directory", label: "Master Employee Directory" },
      { id: "birthdays", label: "Emp. Birthdays Calendar" },
      { id: "probation", label: "Probation List & Reviews" },
      { id: "summary", label: "Workforce Distribution" },
      { id: "reports", label: "Joiners & Separations" },
      { id: "archive", label: "Deactive Staff Archive" },
      { id: "bulk-salary", label: "Bulk Salary Increment" },
      { id: "id-cards", label: "Smart ID Card Print" },
    ],
  },
  {
    id: "hr-setup",
    label: "HR setup",
    sub: "17 Master Modules",
    icon: Sliders,
    badgeVariant: "default",
    subItems: [
      { id: "holiday", label: "Holiday Calendar & Off-Days" },
      { id: "probation", label: "Probation Period Rules" },
      { id: "depts", label: "Departments & Divisions" },
      { id: "designations", label: "Designations & Titles" },
      { id: "grades", label: "Pay Grades & Scales" },
      { id: "shifts", label: "Shifts & Shift Boundaries" },
      { id: "bonus", label: "Festival Bonus Types" },
      { id: "banks", label: "Bank Accounts & Routing" },
      { id: "approvals", label: "Approval Authorities" },
    ],
  },
  {
    id: "recruitment",
    label: "Recruitment",
    sub: "Job Openings & Candidates",
    icon: UserPlus,
    badgeVariant: "success",
    subItems: [
      { id: "jobs", label: "Active Job Circulars" },
      { id: "applications", label: "Candidate ATS Pipeline" },
    ],
  },
  {
    id: "commission",
    label: "Sales Commission",
    sub: "Incentive Calculation",
    icon: Coins,
    badgeVariant: "success",
    subItems: [
      { id: "generate", label: "Commission Calculation" },
      { id: "slabs", label: "Achievement Slabs" },
      { id: "list", label: "Disbursement List" },
    ],
  },
  {
    id: "devices-logs",
    label: "Devices & logs",
    sub: "ADMS Push & Terminals",
    icon: Server,
    badgeVariant: "default",
    subItems: [
      { id: "devices", label: "Networked Machine Devices" },
      { id: "logs", label: "Biometric Punch Audit Logs" },
    ],
  },
  {
    id: "attendance",
    label: "My attendance",
    sub: "Personal Punch Card & Logs",
    icon: Clock,
  },
  {
    id: "leave",
    label: "Leave management",
    sub: "Applications & balances",
    icon: CalendarRange,
    badgeVariant: "warning",
  },
  {
    id: "salary",
    label: "Payroll",
    sub: "Imports, Approval & Bank Letters",
    icon: Banknote,
    badgeVariant: "success",
  },
  {
    id: "factory",
    label: "Factory operations",
    sub: "Lines, Shifts & Production",
    icon: Factory,
  },
  { id: "people", label: "HR & compliance", sub: "Documents, Rosters & Worker Welfare", icon: ShieldCheck },
  {
    id: "performance",
    label: "Performance & letters",
    sub: "Discipline, Awards & Letters",
    icon: Award,
    badgeVariant: "default",
    subItems: [
      { id: "letters", label: "Official Letters Generator" },
      { id: "awards", label: "Awards & Disciplinary" },
      { id: "training", label: "Training & Development" },
    ],
  },
  {
    id: "accounting",
    label: "Finance",
    sub: "Ledgers & Vouchers",
    icon: Landmark,
    badgeVariant: "success",
  },
  {
    id: "snd",
    label: "SND Distribution",
    sub: "Dealers & Outlets Network",
    icon: Store,
    badgeVariant: "default",
  },
  {
    id: "sfm",
    label: "SFM Field Force",
    sub: "Territories & Targets",
    icon: Compass,
    badgeVariant: "success",
  },
  {
    id: "requests",
    label: "Requests & IOM",
    sub: "Movement & Shift Delay",
    icon: Clock,
  },
  {
    id: "shifts",
    label: "Shift Roster",
    sub: "Work Schedules & Matrix",
    icon: Shuffle,
  },
  {
    id: "outwork",
    label: "Outwork & Tour Plans",
    sub: "Tour Itinerary & DA/TA",
    icon: Briefcase,
  },
  {
    id: "loans",
    label: "Loans & advances",
    sub: "Company Advances & EMI",
    icon: PiggyBank,
  },
  {
    id: "notices",
    label: "Notices",
    sub: "Company Bulletin Board",
    icon: Bell,
  },
  {
    id: "settings",
    label: "Integrations",
    sub: "Connection & Credentials",
    icon: Settings,
  },
];

const NAV_GROUPS: { label: string; tabs: NavTab[] }[] = [
  {
    label: "WORKSPACE",
    tabs: [
      "dashboard",
      "employees",
      "today-attendance",
      "leave",
      "salary",
      "factory",
    ],
  },
  {
    label: "PEOPLE OPERATIONS",
    tabs: [
      "people",
      "recruitment",
      "performance",
      "hr-setup",
      "shifts",
      "devices-logs",
      "notices",
    ],
  },
  {
    label: "SELF SERVICE",
    tabs: ["attendance", "requests", "loans", "outwork"],
  },
  {
    label: "BUSINESS",
    tabs: ["accounting", "commission", "snd", "sfm", "settings"],
  },
];

export function Sidebar({
  activeTab,
  activeSubOption,
  onTabChange,
  employeeId = "",
  employeeName = "",
  department = "",
  permissions,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {},
  );
  const drawer = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const isSearching = searchQuery.trim().length > 0;
  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return NAV_MODULES.filter(
      (module) =>
        permissions?.[`module.${module.id}`] !== false &&
        (!query ||
          [
            module.label,
            module.sub,
            ...(module.subItems?.map((item) => item.label) || []),
          ].some((value) => value?.toLowerCase().includes(query))),
    );
  }, [permissions, searchQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
      if (event.key !== "Tab") return;
      const elements = Array.from(
        drawer.current?.querySelectorAll<HTMLElement>(
          'button, input, [tabindex="0"]',
        ) || [],
      ).filter((element) => element.getClientRects().length);
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [isOpen, onClose]);

  const navigate = (tab: NavTab, sub?: string) => {
    onTabChange(tab, sub);
    onClose?.();
  };
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}
      <aside
        ref={drawer}
        aria-label="Main navigation"
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? true : undefined}
        className={cn(
          "hrm-sidebar fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] max-w-[calc(100vw-40px)] shrink-0 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-30 lg:max-w-none",
          isOpen
            ? "translate-x-0"
            : "invisible -translate-x-full lg:visible lg:translate-x-0",
        )}
      >
        <div className="flex h-20 shrink-0 items-center gap-3 px-6">
          <BrandMark />
          <div className="flex-1">
            <Text className="!text-lg !font-semibold !tracking-tight">
              Smart HRM<span className="text-teal-700">.</span>
            </Text>
            <Text
              variant="caption"
              className="!text-[10px] !font-normal !text-slate-500"
            >
              PEOPLE & FACTORY OPERATIONS
            </Text>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 pb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Find a module…"
            aria-label="Search navigation"
            className="!h-9 !text-xs !bg-slate-50"
          />
        </div>
        <nav
          className="flex-1 overflow-y-auto px-4 pb-5"
          aria-label="Workspace modules"
        >
          {NAV_GROUPS.map((group) => {
            const modules = group.tabs
              .map((id) => filteredModules.find((module) => module.id === id))
              .filter((item): item is NavModule => Boolean(item));
            if (!modules.length) return null;
            return (
              <div key={group.label} className="mb-5">
                <Text
                  variant="caption"
                  className="px-3 pb-2 !text-[10px] !font-medium !tracking-[.12em] !text-slate-400"
                >
                  {group.label}
                </Text>
                <div className="space-y-1">
                  {modules.map((module) => {
                    const active = activeTab === module.id;
                    const expanded = openAccordions[module.id] ?? active;
                    const showChildren =
                      module.subItems && (expanded || isSearching);
                    const Icon = module.icon;
                    return (
                      <div key={module.id}>
                        <div
                          className={cn(
                            "flex items-center rounded-xl transition-colors",
                            active
                              ? "bg-teal-50 text-teal-800"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => navigate(module.id)}
                            aria-current={active ? "page" : undefined}
                            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium"
                          >
                            <Icon
                              className={cn(
                                "size-[18px] shrink-0",
                                active ? "text-teal-700" : "text-slate-400",
                              )}
                            />
                            <span className="truncate">{module.label}</span>
                            {module.id === "factory" && (
                              <span className="ml-auto rounded bg-teal-100 px-1.5 py-0.5 text-[9px] font-semibold text-teal-800">
                                RMG
                              </span>
                            )}
                          </button>
                          {module.subItems && (
                            <button
                              type="button"
                              aria-label={`${expanded ? "Collapse" : "Expand"} ${module.label}`}
                              aria-expanded={expanded || isSearching}
                              onClick={() =>
                                setOpenAccordions((previous) => ({
                                  ...previous,
                                  [module.id]: !expanded,
                                }))
                              }
                              className="mr-1 rounded-lg p-2 hover:bg-teal-100/50"
                            >
                              <ChevronDown
                                className={cn(
                                  "size-3.5 transition-transform",
                                  showChildren && "rotate-180",
                                )}
                              />
                            </button>
                          )}
                        </div>
                        {showChildren && (
                          <div className="ml-[21px] mt-1 border-l border-slate-200 pl-3">
                            {module.subItems
                              ?.filter(
                                (item) =>
                                  !isSearching ||
                                  module.label
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                  item.label
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()),
                              )
                              .map((item) => (
                                <button
                                  type="button"
                                  key={item.id}
                                  aria-current={
                                    active && activeSubOption === item.id
                                      ? "page"
                                      : undefined
                                  }
                                  onClick={() => navigate(module.id, item.id)}
                                  className={cn(
                                    "my-0.5 block w-full rounded-lg px-3 py-2 text-left text-xs leading-relaxed",
                                    active && activeSubOption === item.id
                                      ? "bg-teal-50 font-medium text-teal-800"
                                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                  )}
                                >
                                  {item.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!filteredModules.length && (
            <Text variant="muted" className="p-3 !text-xs">
              No modules match your search.
            </Text>
          )}
        </nav>
        <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">
            {employeeName
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0">
            <Text className="truncate !text-xs !font-semibold">
              {employeeName}
            </Text>
            <Text
              variant="caption"
              className="mt-1 truncate !text-[10px] !font-normal !text-slate-500"
            >
              {department || employeeId}
            </Text>
          </div>
        </div>
      </aside>
    </>
  );
}
