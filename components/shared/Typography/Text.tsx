import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

export type TextVariant = "body" | "lead" | "caption" | "muted" | "code";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: ElementType;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, string> = {
  body: "text-sm text-slate-700 font-normal leading-relaxed",
  lead: "text-lg text-slate-700 font-normal leading-relaxed",
  caption: "text-xs text-slate-500 font-normal leading-relaxed",
  muted: "text-sm text-slate-500 font-normal",
  code: "font-mono text-xs bg-slate-100 text-slate-900 font-medium px-1.5 py-0.5 rounded border border-slate-300",
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
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
