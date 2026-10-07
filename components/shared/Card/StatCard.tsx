import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { Text } from "../Typography/Text";

export type StatCardVariant =
  "blue" | "emerald" | "indigo" | "purple" | "amber" | "rose" | "slate";
export interface StatCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: StatCardVariant;
  trend?: { value: string | number; isPositive?: boolean; label?: string };
  action?: React.ReactNode;
}
const colors: Record<StatCardVariant, string> = {
  blue: "bg-sky-50 text-sky-700",
  emerald: "bg-teal-50 text-teal-700",
  indigo: "bg-indigo-50 text-indigo-600",
  purple: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
};
export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "emerald",
  trend,
  action,
  className,
  onClick,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative p-4 sm:p-5",
        onClick && "cursor-pointer hover:border-teal-300",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.currentTarget.click();
              }
            }
          : undefined
      }
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <Text variant="caption" className="!text-xs !font-medium">
          {title}
        </Text>
        {icon && (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              colors[variant],
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <Text className="mt-4 !text-2xl sm:!text-[28px] !font-semibold !leading-tight !tracking-tight !text-slate-800 tabular-nums">
        {value}
      </Text>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {subtitle && (
          <Text variant="caption" className="!text-[11px]">
            {subtitle}
          </Text>
        )}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-medium",
              trend.isPositive === true
                ? "text-teal-700"
                : trend.isPositive === false
                  ? "text-amber-700"
                  : "text-slate-500",
            )}
          >
            {trend.isPositive === true ? (
              <TrendingUp className="size-3" />
            ) : trend.isPositive === false ? (
              <TrendingDown className="size-3" />
            ) : (
              <Minus className="size-3" />
            )}
            {trend.value}
            {trend.label && ` ${trend.label}`}
          </span>
        )}
        {action}
      </div>
    </Card>
  );
}
