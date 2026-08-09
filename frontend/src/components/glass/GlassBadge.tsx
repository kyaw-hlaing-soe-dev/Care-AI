import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GlassBadgeTone = "good" | "attention" | "error" | "info" | "neutral";

const toneClass: Record<GlassBadgeTone, string> = {
  good: "border-emerald-200/80 bg-emerald-50/85 text-emerald-800",
  attention: "border-amber-200/85 bg-amber-50/90 text-amber-800",
  error: "border-rose-200/85 bg-rose-50/90 text-rose-800",
  info: "border-blue-200/80 bg-blue-50/88 text-blue-700",
  neutral: "border-slate-200/90 bg-slate-50/88 text-slate-600",
};

export function GlassBadge({
  tone = "neutral",
  icon,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: GlassBadgeTone;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "glass-control inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold leading-none shadow-none",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
