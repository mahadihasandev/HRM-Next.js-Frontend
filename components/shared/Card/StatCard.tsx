import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

export type StatCardVariant =
  | "blue"
  | "emerald"
  | "indigo"
  | "purple"
  | "amber"
  | "rose"
  | "slate";

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: StatCardVariant;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  action?: React.ReactNode;
}

const colorVariants: Record<
  StatCardVariant,
  {
    iconBg: string;
    iconColor: string;
    badgeBg: string;
  }
> = {
  blue: {
    iconBg: "bg-slate-900 text-white border border-slate-900 shadow-xs",
    iconColor: "text-white",
    badgeBg: "bg-slate-900 text-white font-bold shadow-2xs",
  },
  emerald: {
    iconBg: "bg-emerald-700 text-white border border-emerald-800 shadow-xs",
    iconColor: "text-white",
    badgeBg: "bg-emerald-700 text-white font-bold shadow-2xs",
  },
  indigo: {
    iconBg: "bg-slate-900 text-white border border-slate-900 shadow-xs",
    iconColor: "text-white",
    badgeBg: "bg-slate-900 text-white font-bold shadow-2xs",
  },
  purple: {
    iconBg: "bg-slate-900 text-white border border-slate-900 shadow-xs",
    iconColor: "text-white",
    badgeBg: "bg-slate-900 text-white font-bold shadow-2xs",
  },
  amber: {
    iconBg: "bg-amber-600 text-white border border-amber-700 shadow-xs",
    iconColor: "text-white",
    badgeBg: "bg-amber-600 text-white font-bold shadow-2xs",
  },
  rose: {
    iconBg: "bg-red-700 text-white border border-red-800 shadow-xs",
    iconColor: "text-white",
    badgeBg: "bg-red-700 text-white font-bold shadow-2xs",
  },
  slate: {
    iconBg: "bg-slate-900 text-white border border-slate-900 shadow-xs",
    iconColor: "text-white",
    badgeBg: "bg-white text-slate-950 font-bold border-2 border-slate-900 shadow-2xs",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "blue",
  trend,
  action,
  className,
  ...props
}: StatCardProps) {
  const styles = colorVariants[variant] || colorVariants.blue;

  return (
    <Card
      className={cn(
        "p-4 sm:p-5 hover:shadow-md transition-all relative overflow-hidden bg-white border border-slate-300",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-800 font-mono truncate">
            {value}
          </div>
        </div>

        {icon && (
          <div className={cn("flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl font-bold shrink-0", styles.iconBg)}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend || action) && (
        <div className="mt-3 pt-2.5 sm:pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-bold text-[10px] sm:text-[11px] shadow-2xs shrink-0",
                  trend.isPositive === true
                    ? "bg-emerald-700 text-white"
                    : trend.isPositive === false
                    ? "bg-rose-700 text-white"
                    : "bg-slate-900 text-white"
                )}
              >
                {trend.isPositive === true ? (
                  <TrendingUp className="h-3 w-3 text-white" />
                ) : trend.isPositive === false ? (
                  <TrendingDown className="h-3 w-3 text-white" />
                ) : (
                  <Minus className="h-3 w-3 text-white" />
                )}
                {trend.value}
              </span>
            )}
            {subtitle && (
              <span className="truncate text-slate-700 font-semibold text-[11px] sm:text-xs">
                {subtitle}
              </span>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
    </Card>
  );
}
