"use client";

import React from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Banknote,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavTab } from "./Sidebar";

interface MobileBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMenu: () => void;
  permissions?: Record<string, boolean>;
}

export function MobileBottomNav({
  activeTab,
  onTabChange,
  onOpenMenu,
  permissions,
}: MobileBottomNavProps) {
  const isTabAllowed = (tab: string) => {
    if (!permissions) return true;
    const permKey = `module.${tab}`;
    if (permKey in permissions) {
      return Boolean(permissions[permKey]);
    }
    return true;
  };

  const navItems = [
    {
      id: "dashboard" as NavTab,
      label: "Home",
      icon: LayoutDashboard,
      allowed: true,
    },
    {
      id: "attendance" as NavTab,
      label: "Attendance",
      icon: CalendarCheck,
      allowed: isTabAllowed("attendance"),
    },
    {
      id: "employees" as NavTab,
      label: "Staff",
      icon: Users,
      allowed: isTabAllowed("employees"),
    },
    {
      id: "salary" as NavTab,
      label: "Payroll",
      icon: Banknote,
      allowed: isTabAllowed("salary"),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_8px_rgba(0,0,0,0.02)] px-2 py-1 safe-area-pb"
      aria-label="Smartphone Navigation Dock"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          if (!item.allowed) return null;
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-14 py-1.5 px-1 rounded-xl transition-all select-none cursor-pointer",
                isActive
                  ? "text-teal-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 font-semibold",
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-lg transition-colors relative",
                  isActive ? "bg-teal-50 text-teal-700" : "text-slate-600",
                )}
              >
                <Icon className="h-5 w-5" />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-600" />
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Menu / More Button */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center min-w-14 py-1.5 px-1 rounded-xl text-slate-700 hover:text-slate-950 font-semibold transition-all select-none cursor-pointer"
          aria-label="All Modules & Menu"
        >
          <div className="p-1 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
            <Menu className="h-5 w-5" />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-full">
            Modules
          </span>
        </button>
      </div>
    </nav>
  );
}
