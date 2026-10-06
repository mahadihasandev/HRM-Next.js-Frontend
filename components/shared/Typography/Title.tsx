import React, { ElementType } from "react";
import { cn } from "@/lib/utils";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  as?: ElementType;
  children: React.ReactNode;
}

const levelStyles: Record<1 | 2 | 3 | 4, string> = {
  1: "text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-700 dark:text-gray-700",
  2: "text-2xl font-bold tracking-tight sm:text-3xl text-gray-700 dark:text-gray-700",
  3: "text-xl font-bold tracking-tight text-gray-700 dark:text-gray-700",
  4: "text-lg font-semibold tracking-normal text-gray-700 dark:text-gray-700",
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
