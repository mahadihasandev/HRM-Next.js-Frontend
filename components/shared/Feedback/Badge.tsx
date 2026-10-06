import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white font-bold shadow-2xs border border-slate-900 dark:bg-slate-100 dark:text-slate-950",
        secondary:
          "bg-white text-slate-950 border-2 border-slate-900 font-bold shadow-2xs dark:bg-slate-900 dark:text-white dark:border-slate-400",
        success:
          "bg-emerald-700 text-white font-bold border border-emerald-800 shadow-2xs dark:bg-emerald-600 dark:text-white",
        warning:
          "bg-amber-600 text-white font-bold border border-amber-700 shadow-2xs dark:bg-amber-500 dark:text-slate-950",
        destructive:
          "bg-red-700 text-white font-bold border border-red-800 shadow-2xs dark:bg-red-600 dark:text-white",
        outline:
          "bg-white text-slate-950 border-2 border-slate-900 font-bold shadow-2xs dark:text-white dark:border-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
