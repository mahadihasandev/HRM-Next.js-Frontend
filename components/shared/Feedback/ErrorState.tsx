import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Title } from "../Typography/Title";
import { Subtitle } from "../Typography/Subtitle";
import { Button } from "../Button/Button";

export interface ErrorStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | Error | null;
  onRetry?: () => void;
  action?: React.ReactNode;
}

export function ErrorState({
  icon,
  title = "Something went wrong",
  description = "An error occurred while loading this section. Please try again.",
  error,
  onRetry,
  action,
  className,
  ...props
}: ErrorStateProps) {
  const errorMessage =
    typeof error === "string" ? error : error?.message || null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
        {icon || <AlertTriangle className="h-6 w-6" />}
      </div>
      <Title level={4} className="mb-1 text-rose-950 dark:text-rose-100">
        {title}
      </Title>
      {description && (
        <Subtitle className="max-w-md text-sm mb-3 text-rose-800/80 dark:text-rose-300">
          {description}
        </Subtitle>
      )}
      {errorMessage && (
        <div className="max-w-md mb-4 p-2.5 rounded-lg bg-rose-100/60 dark:bg-rose-900/40 text-xs font-mono text-rose-800 dark:text-rose-200 break-words">
          {errorMessage}
        </div>
      )}
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="border-rose-300 text-rose-700 hover:bg-rose-100/50 dark:border-rose-800 dark:text-rose-200"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}
