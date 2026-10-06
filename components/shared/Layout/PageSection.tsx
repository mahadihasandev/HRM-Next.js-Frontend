import React from "react";
import { cn } from "@/lib/utils";
import { Title } from "../Typography/Title";
import { Subtitle } from "../Typography/Subtitle";

export interface PageSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  card?: boolean;
}

export function PageSection({
  title,
  subtitle,
  badge,
  icon,
  action,
  card = false,
  children,
  className,
  ...props
}: PageSectionProps) {
  const hasHeader = title || subtitle || badge || action || icon;

  const content = (
    <>
      {hasHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                {title && (
                  <Title level={3} className="text-base font-bold text-slate-800 dark:text-slate-800">
                    {title}
                  </Title>
                )}
                {badge}
              </div>
              {subtitle && (
                <Subtitle className="text-xs text-slate-700 font-medium mt-0.5">
                  {subtitle}
                </Subtitle>
              )}
            </div>
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </>
  );

  if (card) {
    return (
      <section
        className={cn(
          "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900",
          className
        )}
        {...props}
      >
        {content}
      </section>
    );
  }

  return (
    <section className={cn("space-y-4", className)} {...props}>
      {content}
    </section>
  );
}
