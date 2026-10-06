import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type BannerVariant = "info" | "success" | "warning" | "danger" | "neutral";

export interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: BannerVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  isDismissible?: boolean;
}

const variantStyles: Record<
  BannerVariant,
  {
    container: string;
    iconColor: string;
    titleColor: string;
    descColor: string;
    defaultIcon: React.ReactNode;
  }
> = {
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-200",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-950 dark:text-blue-100",
    descColor: "text-blue-800 dark:text-blue-300",
    defaultIcon: <Info className="h-4 w-4 shrink-0" />,
  },
  success: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-emerald-950 dark:text-emerald-100",
    descColor: "text-emerald-800 dark:text-emerald-300",
    defaultIcon: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-950 dark:text-amber-100",
    descColor: "text-amber-800 dark:text-amber-300",
    defaultIcon: <AlertTriangle className="h-4 w-4 shrink-0" />,
  },
  danger: {
    container: "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-200",
    iconColor: "text-rose-600 dark:text-rose-400",
    titleColor: "text-rose-950 dark:text-rose-100",
    descColor: "text-rose-800 dark:text-rose-300",
    defaultIcon: <AlertCircle className="h-4 w-4 shrink-0" />,
  },
  neutral: {
    container: "bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100",
    iconColor: "text-slate-500 dark:text-slate-400",
    titleColor: "text-slate-900 dark:text-slate-100",
    descColor: "text-slate-600 dark:text-slate-400",
    defaultIcon: <Info className="h-4 w-4 shrink-0" />,
  },
};

export function Banner({
  variant = "info",
  title,
  description,
  icon,
  action,
  onClose,
  isDismissible = !!onClose,
  children,
  className,
  ...props
}: BannerProps) {
  const currentVariant = variantStyles[variant] || variantStyles.info;

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-xl border p-4 text-xs sm:text-sm shadow-xs transition-all",
        currentVariant.container,
        className
      )}
      {...props}
    >
      <div className={cn("mt-0.5 shrink-0", currentVariant.iconColor)}>
        {icon || currentVariant.defaultIcon}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h5 className={cn("font-semibold leading-snug", currentVariant.titleColor)}>
            {title}
          </h5>
        )}
        {(description || children) && (
          <div className={cn(title ? "mt-1" : "", currentVariant.descColor, "leading-relaxed")}>
            {description || children}
          </div>
        )}
      </div>

      {action && <div className="shrink-0 self-center">{action}</div>}

      {isDismissible && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss banner"
          className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
