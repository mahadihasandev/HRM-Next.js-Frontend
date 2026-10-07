import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  as?: ElementType;
  children: React.ReactNode;
}

const levelStyles: Record<1 | 2 | 3 | 4, string> = {
  1: "text-3xl font-semibold tracking-tight sm:text-4xl text-slate-900 dark:text-slate-100",
  2: "text-2xl font-semibold tracking-tight sm:text-3xl text-slate-900 dark:text-slate-100",
  3: "text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100",
  4: "text-lg font-semibold tracking-normal text-slate-900 dark:text-slate-100",
};

export function Title({
  level = 1,
  as,
  className,
  children,
  ...props
}: TitleProps) {
  const Component = as || (`h${level}` as ElementType);

  return (
    <Component
      className={cn(levelStyles[level], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
