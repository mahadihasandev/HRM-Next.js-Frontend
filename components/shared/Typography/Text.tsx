import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

export type TextVariant = "body" | "lead" | "caption" | "muted" | "code";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: ElementType;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, string> = {
  body: "text-sm sm:text-base text-slate-900 font-medium leading-normal",
  lead: "text-lg text-slate-900 font-bold leading-relaxed",
  caption: "text-xs text-slate-700 font-semibold leading-tight",
  muted: "text-sm text-slate-700 font-medium",
  code: "font-mono text-xs bg-slate-100 text-slate-900 font-bold px-1.5 py-0.5 rounded border border-slate-300",
};

export function Text({
  variant = "body",
  as,
  className,
  children,
  ...props
}: TextProps) {
  const Component = as || (variant === "code" ? "code" : "p");

  return (
    <Component
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
