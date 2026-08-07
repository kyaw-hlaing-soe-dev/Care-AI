import { GlassCard } from "@/components/glass/GlassCard";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import type { VitalRecord } from "@/lib/vitals";
import { cn } from "@/lib/utils";

function scoreStatus(record: VitalRecord) {
  if (record.analysis.status === "Good") return { label: "Good condition", className: "text-emerald-700" };
  if (record.analysis.status === "Urgent") return { label: "Urgent attention", className: "text-rose-700" };
  if (record.analysis.status === "Pending") return { label: "Analysis pending", className: "text-slate-600" };
  return { label: "Needs attention", className: "text-amber-700" };
}

export function HealthOverviewCard({ record }: { record: VitalRecord }) {
  const status = scoreStatus(record);

  return (
    <GlassCard strong className="app-card flex min-h-[190px] items-center gap-5 p-5 sm:min-h-[210px] sm:p-6 lg:min-h-[338px] lg:flex-col lg:justify-center lg:text-center">
      <div className="lg:hidden">
        <HealthScoreRing score={record.analysis.score} hasData size={108} />
      </div>
      <div className="hidden lg:block">
        <HealthScoreRing score={record.analysis.score} hasData size={154} />
      </div>
      <div className="min-w-0 lg:mt-1">
        <p className="text-xs font-extrabold uppercase tracking-[0.11em] text-blue-600">Health Score</p>
        <p className={cn("mt-2 text-base font-extrabold", status.className)}>{status.label}</p>
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6 lg:mx-auto lg:max-w-[235px]">
          {record.analysis.summary}
        </p>
      </div>
    </GlassCard>
  );
}
