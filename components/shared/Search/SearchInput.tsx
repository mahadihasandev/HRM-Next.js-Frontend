"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
  shortcutHint?: string;
  onClear?: () => void;
}

export function SearchInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onDebouncedChange,
  debounceMs = 300,
  isLoading = false,
  shortcutHint,
  placeholder = "Search...",
  className,
  onClear,
  ...props
}: SearchInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const value = isControlled ? controlledValue : internalValue;
  const inputRef = useRef<HTMLInputElement>(null);
  const onDebouncedChangeRef = useRef(onDebouncedChange);
  const prevValueRef = useRef(value);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  // Debounce effect: only triggers when input value actually changes
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (prevValueRef.current === value) {
      return;
    }
    prevValueRef.current = value;

    if (!onDebouncedChangeRef.current) return;

    const timer = setTimeout(() => {
      onDebouncedChangeRef.current?.(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    onChange?.("");
    onDebouncedChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search
        className="absolute left-3.5 h-4 w-4 text-slate-600 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border-2 border-slate-300 bg-white pl-10 pr-10 text-sm font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all shadow-xs",
          className
        )}
        {...props}
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
        )}
        {!isLoading && value && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-0.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {!isLoading && !value && shortcutHint && (
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-300 bg-slate-100 px-1.5 font-mono text-[10px] font-bold text-slate-700">
            {shortcutHint}
          </kbd>
        )}
      </div>
    </div>
  );
}
