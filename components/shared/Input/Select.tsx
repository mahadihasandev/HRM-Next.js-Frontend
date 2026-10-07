import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Select({
  label,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-slate-600">
      <span>{label}</span>
      <select
        {...props}
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
          className,
        )}
      >
        {children}
      </select>
    </label>
  );
}
