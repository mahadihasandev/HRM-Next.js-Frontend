"use client";

import React, { useState, useMemo } from "react";
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
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Store,
  Compass,
  X,
  Search,
  Sliders,
  UserPlus,
  Coins,
  Server,
  Award,
  Factory,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    sub: "All 68 Staff Live Roster",
    icon: CalendarCheck,
    badge: "Live",
    badgeVariant: "success",
  },
  {
    id: "employees",
    label: "Employee Directory & Profiles",
    sub: "Workforce & Profiles",
    icon: Users,
    badge: "68 Staff",
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
    label: "Enterprise HR Setup & Compliance",
    sub: "17 Master Modules",
    icon: Sliders,
    badge: "Master",
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
    label: "Recruitment & ATS",
    sub: "Job Openings & Candidates",
    icon: UserPlus,
    badge: "ATS",
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
    badge: "Incentives",
    badgeVariant: "success",
    subItems: [
      { id: "generate", label: "Commission Calculation" },
      { id: "slabs", label: "Achievement Slabs" },
      { id: "list", label: "Disbursement List" },
    ],
  },
  {
    id: "devices-logs",
    label: "Biometric & Machines",
    sub: "ADMS Push & Terminals",
    icon: Server,
    badge: "153k Logs",
    badgeVariant: "default",
    subItems: [
      { id: "devices", label: "Networked Machine Devices" },
      { id: "logs", label: "Biometric Punch Audit Logs" },
    ],
  },
  {
    id: "attendance",
    label: "My Attendance & Bio",
    sub: "Personal Punch Card & Logs",
    icon: Clock,
  },
  {
    id: "leave",
    label: "Leave Management",
    sub: "BLA 2006 Statutory Leaves",
    icon: CalendarRange,
    badge: "3 Pending",
    badgeVariant: "warning",
  },
  {
    id: "salary",
    label: "Salary & Payroll",
    sub: "Imports, Approval & Bank Letters",
    icon: Banknote,
    badge: "Payroll",
    badgeVariant: "success",
  },
  {
    id: "factory",
    label: "Factory Operations",
    sub: "Lines, Shifts & Production",
    icon: Factory,
  },
  {
    id: "performance",
    label: "Performance & Letters",
    sub: "Discipline, Awards & Letters",
    icon: Award,
    badge: "Letters",
    badgeVariant: "default",
    subItems: [
      { id: "letters", label: "Official Letters Generator" },
      { id: "awards", label: "Awards & Disciplinary" },
      { id: "training", label: "Training & Development" },
    ],
  },
  {
    id: "accounting",
    label: "Accounting & Finance",
    sub: "Ledgers & Vouchers",
    icon: Landmark,
    badge: "NBR",
    badgeVariant: "success",
  },
  {
    id: "snd",
    label: "SND Distribution",
    sub: "Dealers & Outlets Network",
    icon: Store,
    badge: "Live",
    badgeVariant: "default",
  },
  {
    id: "sfm",
    label: "SFM Field Force",
    sub: "Territories & Targets",
    icon: Compass,
    badge: "New",
    badgeVariant: "success",
  },
  {
    id: "requests",
    label: "Short Leave & IOM",
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
    label: "Loans & Advance",
    sub: "Company Advances & EMI",
    icon: PiggyBank,
  },
  {
    id: "notices",
    label: "Circulars & Notices",
    sub: "Company Bulletin Board",
    icon: Bell,
    badge: "8",
  },
  {
    id: "settings",
    label: "API & Device Sync",
    sub: "Connection & Credentials",
    icon: Settings,
  },
];

export function Sidebar({
  activeTab,
  activeSubOption,
  onTabChange,
  employeeId = "SMT-0051",
  employeeName = "Abdul Halim",
  permissions,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // Track open accordions in sidebar
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    "hr-setup": false,
    employees: true,
    recruitment: false,
    commission: false,
    "devices-logs": false,
    performance: false,
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    NAV_MODULES.forEach((m) => {
      if (m.subItems) allOpen[m.id] = true;
    });
    setOpenAccordions(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenAccordions({});
  };

  // Filter modules based on search and permissions
  const filteredModules = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return NAV_MODULES.filter((module) => {
      // RBAC check
      if (permissions) {
        const permKey = `module.${module.id}`;
        if (permKey in permissions && !permissions[permKey]) {
          return false;
        }
      }

      if (!query) return true;

      // Check module label and sub
      if (
        module.label.toLowerCase().includes(query) ||
        (module.sub && module.sub.toLowerCase().includes(query))
      ) {
        return true;
      }

      // Check sub items
      if (module.subItems) {
        return module.subItems.some((sub) =>
          sub.label.toLowerCase().includes(query)
        );
      }

      return false;
    });
  }, [searchQuery, permissions]);

  // Auto-expand accordions if search query is active
  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Navigation Sidebar */}
      <aside
        className={cn(
          "w-72 sm:w-80 lg:w-64 bg-[#0b1329] border-r border-slate-800 flex flex-col shrink-0 h-screen select-none text-white transition-transform duration-300 ease-in-out overflow-hidden",
          "fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:z-30 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#080e1e] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/40 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-white text-sm leading-tight tracking-tight flex items-center gap-1.5">
                Smart HRM <span className="text-[9px] px-1 py-0.2 bg-blue-600 text-white font-black rounded">BD</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase truncate">
                People & factory operations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-1"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Accordion Controls */}
        <div className="px-3 pt-3 pb-2 border-b border-slate-800/80 bg-[#091024] shrink-0 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people & factory tools…"
              className="w-full bg-slate-900/90 text-white placeholder:text-slate-500 border border-slate-700/80 rounded-lg pl-8 pr-2.5 py-1.5 text-[11px] font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-semibold">
            <span>ENTERPRISE NAVIGATOR</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExpandAll}
                className="hover:text-blue-400 transition-colors cursor-pointer"
                title="Expand All Accordions"
              >
                Expand
              </button>
              <span>&bull;</span>
              <button
                onClick={handleCollapseAll}
                className="hover:text-blue-400 transition-colors cursor-pointer"
                title="Collapse All Accordions"
              >
                Collapse
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Accordion Scroll Area */}
        <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto sidebar-scrollbar">
          {filteredModules.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center my-4 mx-1">
              <p className="text-xs font-bold text-slate-300 mb-1">No matching menus</p>
              <p className="text-[11px] text-slate-500">
                Try searching for keywords like &ldquo;bank&rdquo;, &ldquo;salary&rdquo;, or &ldquo;probation&rdquo;.
              </p>
            </div>
          ) : (
            filteredModules.map((item) => {
              const Icon = item.icon;
              const hasSub = Boolean(item.subItems && item.subItems.length > 0);
              const isAccordionOpen = isSearchActive || Boolean(openAccordions[item.id]);
              const isParentActive = activeTab === item.id;

              return (
                <div key={item.id} className="space-y-0.5">
                  {/* Module Header / Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      if (hasSub) {
                        setOpenAccordions((prev) => ({
                          ...prev,
                          [item.id]: isParentActive ? !prev[item.id] : true,
                        }));
                        const defaultSub = item.id === "employees" ? "directory" : item.subItems?.[0]?.id;
                        onTabChange(item.id, defaultSub);
                      } else {
                        onTabChange(item.id);
                        if (onClose) onClose();
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all group cursor-pointer text-left",
                      isParentActive && !hasSub
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : isParentActive && hasSub
                        ? "bg-slate-800/90 text-white border border-slate-700/60"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          isParentActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800/80 text-slate-400 group-hover:text-white group-hover:bg-slate-700"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold text-xs leading-tight">
                          {item.label}
                        </div>
                        {item.sub && (
                          <div
                            className={cn(
                              "text-[9px] leading-none truncate mt-0.5",
                              isParentActive ? "text-blue-200" : "text-slate-400 group-hover:text-slate-300"
                            )}
                          >
                            {item.sub}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-extrabold leading-none",
                            item.badgeVariant === "warning"
                              ? "bg-amber-500 text-slate-950 font-black"
                              : item.badgeVariant === "success"
                              ? "bg-emerald-500 text-slate-950 font-black"
                              : "bg-slate-800 text-slate-200 border border-slate-700"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}

                      {hasSub ? (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccordion(item.id);
                          }}
                          className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform duration-200",
                              isAccordionOpen && "rotate-180 text-blue-400"
                            )}
                          />
                        </div>
                      ) : (
                        isParentActive && (
                          <ChevronRight className="h-3.5 w-3.5 text-white shrink-0" />
                        )
                      )}
                    </div>
                  </button>

                  {/* Accordion Sub-Items with Tree Indentation */}
                  {hasSub && isAccordionOpen && (
                    <div className="ml-5 pl-2.5 border-l-2 border-slate-700/60 space-y-0.5 py-1 animate-in fade-in duration-150">
                      {item.subItems?.map((sub) => {
                        const isSubActive =
                          isParentActive &&
                          (activeSubOption === sub.id ||
                            (!activeSubOption &&
                              (sub.id === "directory" || sub.id === item.subItems?.[0]?.id)));

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onTabChange(item.id, sub.id);
                              if (onClose) onClose();
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-left group",
                              isSubActive
                                ? "bg-blue-600 text-white font-extrabold shadow-xs"
                                : item.id === "hr-setup"
                                ? "text-gray-700 hover:text-white hover:bg-slate-800/50"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                          >
                            <span className={cn("truncate flex items-center gap-2", item.id === "hr-setup" && !isSubActive && "text-gray-700")}>
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                                  isSubActive
                                    ? "bg-white"
                                    : "bg-slate-600 group-hover:bg-slate-300"
                                )}
                              />
                              {sub.label}
                            </span>
                            {sub.badge && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* User Info Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#070c1a] shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md shrink-0">
              {employeeId.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {employeeName}
              </p>
              <p className="text-[9px] text-slate-400 truncate font-mono font-semibold">
                {employeeId} &bull; Senior HR Exec
              </p>
            </div>
            <div
              className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-950 shrink-0"
              title="Connected to ZKTeco"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
