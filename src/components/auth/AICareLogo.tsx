import { HeartPulse } from "lucide-react";

export function AICareLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="AICare">
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500 text-white shadow-[0_14px_32px_rgba(14,165,233,0.24)] ${compact ? "size-10" : "size-10 sm:size-11"}`}
      >
        <HeartPulse className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-[-0.035em] text-slate-950">AICare</span>
    </div>
  );
}
