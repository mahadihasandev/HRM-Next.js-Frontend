import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 28 28" fill="none" className="size-6">
        <path d="M5 7h7v7H5zM16 14h7v7h-7z" fill="currentColor" />
        <path
          d="M16 7h7v3h-4v4h-3V7ZM5 18h4v-4h3v7H5v-3Z"
          fill="currentColor"
          opacity=".55"
        />
      </svg>
    </span>
  );
}
