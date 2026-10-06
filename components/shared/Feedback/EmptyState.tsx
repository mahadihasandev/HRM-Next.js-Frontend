import React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Title } from "../Typography/Title";
import { Subtitle } from "../Typography/Subtitle";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <Title level={4} className="mb-1">
        {title}
      </Title>
      {description && (
        <Subtitle className="max-w-md text-sm mb-5">{description}</Subtitle>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
