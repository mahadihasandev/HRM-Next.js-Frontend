"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  fallbackIcon,
  className,
  containerClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-100 dark:bg-slate-800",
        containerClassName
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
      )}

      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            if (fallbackSrc) {
              // will trigger re-render if fallbackSrc handled
            } else {
              setHasError(true);
            }
          }}
          {...props}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4 text-slate-400">
          {fallbackIcon || <ImageOff className="h-6 w-6" />}
        </div>
      )}
    </div>
  );
}
