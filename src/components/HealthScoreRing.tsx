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

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
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
          className="stroke-primary transition-[stroke-dashoffset] duration-1000 spring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-2xl font-bold tabular-nums",
            hasData ? "text-primary" : "text-muted-foreground",
          )}
        >
          {hasData ? score : 0}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
