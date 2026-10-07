import React from "react";
import { Title } from "../Typography/Title";
import { Subtitle } from "../Typography/Subtitle";
import { cn } from "@/lib/utils";

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  titleClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  action,
  badge,
  titleClassName,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-slate-200 dark:border-slate-800",
        className
      )}
      {...props}
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Title
            level={1}
            className={cn(
              "text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight",
              titleClassName || "text-slate-900 dark:text-slate-100"
            )}
          >
            {title}
          </Title>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtitle && <Subtitle className="text-xs sm:text-sm text-slate-500 font-normal">{subtitle}</Subtitle>}
      </div>
      {action && <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">{action}</div>}
    </div>
  );
}
