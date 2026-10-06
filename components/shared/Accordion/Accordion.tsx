"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AccordionType = "single" | "multiple";

interface AccordionContextType {
  openValues: string[];
  toggleValue: (value: string) => void;
  type: AccordionType;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
}

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  collapsible = true,
  className,
  children,
  ...props
}: AccordionProps) {
  const initialOpen = (): string[] => {
    if (controlledValue !== undefined) {
      return Array.isArray(controlledValue) ? controlledValue : [controlledValue];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  };

  const [internalValues, setInternalValues] = useState<string[]>(initialOpen);

  const activeValues = controlledValue !== undefined
    ? Array.isArray(controlledValue)
      ? controlledValue
      : [controlledValue]
    : internalValues;

  const toggleValue = (val: string) => {
    let next: string[];
    if (type === "single") {
      if (activeValues.includes(val)) {
        next = collapsible ? [] : [val];
      } else {
        next = [val];
      }
    } else {
      if (activeValues.includes(val)) {
        next = activeValues.filter((v) => v !== val);
      } else {
        next = [...activeValues, val];
      }
    }

    if (controlledValue === undefined) {
      setInternalValues(next);
    }
    if (onValueChange) {
      onValueChange(type === "single" ? (next[0] || "") : next);
    }
  };

  return (
    <AccordionContext.Provider value={{ openValues: activeValues, toggleValue, type }}>
      <div className={cn("space-y-3", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = createContext<{ value: string; isOpen: boolean }>({
  value: "",
  isOpen: false,
});

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within an Accordion");

  const isOpen = ctx.openValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "rounded-2xl border transition-all duration-200 overflow-hidden",
          isOpen
            ? "border-blue-300/80 bg-white shadow-md shadow-blue-500/5 ring-1 ring-blue-500/10"
            : "border-slate-200 bg-white hover:border-slate-300 shadow-xs",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  chevronPosition?: "left" | "right";
}

export function AccordionTrigger({
  icon,
  subtitle,
  badge,
  chevronPosition = "right",
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const itemCtx = useContext(AccordionItemContext);
  const rootCtx = useContext(AccordionContext);
  const id = useId();

  if (!itemCtx || !rootCtx) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }

  const { value, isOpen } = itemCtx;

  return (
    <button
      type="button"
      id={`accordion-trigger-${id}`}
      aria-expanded={isOpen}
      onClick={() => rootCtx.toggleValue(value)}
      className={cn(
        "w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors cursor-pointer select-none group",
        isOpen ? "bg-slate-50/70" : "hover:bg-slate-50/40",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {chevronPosition === "left" && (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-slate-500 transition-transform duration-250 ease-out group-hover:text-slate-800",
              isOpen && "rotate-180 text-blue-600 group-hover:text-blue-700"
            )}
          />
        )}
        {icon && (
          <div
            className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              isOpen
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                : "bg-slate-100 text-slate-700 group-hover:bg-slate-200 group-hover:text-slate-900"
            )}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-sm sm:text-base font-extrabold tracking-tight transition-colors",
                isOpen ? "text-slate-950" : "text-slate-900 group-hover:text-slate-950"
              )}
            >
              {children}
            </span>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate group-hover:text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {chevronPosition === "right" && (
        <div className="shrink-0 ml-3">
          <ChevronDown
            className={cn(
              "h-5 w-5 text-slate-500 transition-transform duration-250 ease-out group-hover:text-slate-800",
              isOpen && "rotate-180 text-blue-600 group-hover:text-blue-700"
            )}
          />
        </div>
      )}
    </button>
  );
}

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const itemCtx = useContext(AccordionItemContext);
  if (!itemCtx) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }

  const { isOpen } = itemCtx;

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "grid transition-all duration-250 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "p-4 sm:p-5 pt-2 sm:pt-3 border-t border-slate-100 text-slate-800 text-sm leading-relaxed",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
