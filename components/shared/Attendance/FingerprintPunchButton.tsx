"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Fingerprint, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./FingerprintPunchButton.module.css";

interface FingerprintPunchButtonProps {
  label: string;
  onPunch: () => Promise<boolean>;
  disabled?: boolean;
  compact?: boolean;
}

export function FingerprintPunchButton({ label, onPunch, disabled, compact = false }: FingerprintPunchButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const pending = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  async function recordPunch() {
    if (pending.current) return;
    pending.current = true;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setState("saving");
    try {
      setState(await onPunch() ? "saved" : "error");
    } catch {
      setState("error");
    } finally {
      pending.current = false;
      resetTimer.current = setTimeout(() => setState("idle"), 2400);
    }
  }

  const Icon = state === "saved" ? Check : state === "error" ? RotateCcw : Fingerprint;
  const message = state === "saving" ? "Recording…" : state === "saved" ? "Recorded" : state === "error" ? "Try again" : label;

  return (
    <button
      type="button"
      onClick={() => void recordPunch()}
      disabled={disabled || state === "saving" || state === "saved"}
      aria-label={state === "idle" ? label : `${label}: ${message}`}
      aria-busy={state === "saving"}
      data-saving={state === "saving"}
      className={cn(styles.button, "group inline-flex shrink-0 items-center gap-2.5 rounded-xl border border-teal-600 bg-[#123f40] py-1.5 pl-1.5 pr-3 text-left text-white shadow-sm transition-colors hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-70 motion-safe:active:scale-[.98]", state === "saved" && "!border-teal-500 !bg-teal-700", state === "error" && "!border-amber-600 !bg-amber-900")}
    >
      <span aria-hidden="true" className={cn(styles.sensor, "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-teal-300/30 bg-black/15 text-teal-100", compact ? "size-7" : "size-8")}>
        <Icon strokeWidth={1.6} className={compact ? "size-5" : "size-6"} />
        {(state === "idle" || state === "saving") && <span className={styles.scan} />}
      </span>
      <span aria-live="polite" className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold leading-tight">{message}</span>
        {!compact && <span className="text-[10px] leading-tight text-teal-100/75">{state === "saving" ? "Saving attendance" : state === "saved" ? "Attendance saved" : state === "error" ? "Could not save" : "Tap to record"}</span>}
      </span>
    </button>
  );
}
