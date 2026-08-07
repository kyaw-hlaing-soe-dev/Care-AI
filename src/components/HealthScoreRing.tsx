import { useId } from "react";
import { cn } from "@/lib/utils";

export function HealthScoreRing({
  score,
  hasData,
  size = 112,
}: {
  score: number;
  hasData: boolean;
  size?: number;
}) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = hasData ? Math.min(100, Math.max(0, score)) : 0;
  const gradientId = `score-gradient-${useId().replace(/:/g, "")}`;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-foreground/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          stroke={`url(#${gradientId})`}
          className="transition-[stroke-dashoffset] duration-1000 spring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            hasData ? "text-slate-950" : "text-muted-foreground",
          )}
        >
          {hasData ? score : 0}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
