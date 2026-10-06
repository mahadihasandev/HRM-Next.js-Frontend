import React from "react";
import { cn } from "@/lib/utils";

export interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function Subtitle({ className, children, ...props }: SubtitleProps) {
  return (
    <p
      className={cn(
        "text-base sm:text-lg text-slate-700 font-medium leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
