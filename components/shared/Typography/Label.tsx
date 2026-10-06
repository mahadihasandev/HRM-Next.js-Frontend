import React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  helperText?: React.ReactNode;
  badge?: React.ReactNode;
}

export function Label({
  children,
  required,
  optional,
  helperText,
  badge,
  className,
  ...props
}: LabelProps) {
  return (
    <div className="flex flex-col gap-0.5 mb-1.5">
      <div className="flex items-center justify-between">
        <label
          className={cn(
            "text-xs font-bold text-slate-900 flex items-center gap-1 select-none",
            className
          )}
          {...props}
        >
          <span>{children}</span>
          {required && (
            <span className="text-rose-600 font-bold text-xs" title="Required">
              *
            </span>
          )}
          {optional && (
            <span className="text-[10px] font-semibold text-slate-600">
              (optional)
            </span>
          )}
        </label>
        {badge && <div>{badge}</div>}
      </div>
      {helperText && (
        <span className="text-[11px] text-slate-700 font-medium leading-tight">
          {helperText}
        </span>
      )}
    </div>
  );
}
