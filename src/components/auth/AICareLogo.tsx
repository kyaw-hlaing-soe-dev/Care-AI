import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export function AICareLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="AICare">
      <span
        className={`brand-logo-mark relative flex shrink-0 items-center justify-center rounded-[14px] ${compact ? "size-10" : "size-10 sm:size-11"}`}
      >
        <HeartPulse className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-[-0.035em] text-slate-950">AICare</span>
    </div>
  );
}
