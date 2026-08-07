import { ArrowRight, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { formatRecordedAt, type VitalRecord } from "@/lib/vitals";

export function HealthOverviewCard({ record }: { record: VitalRecord }) {
  const attentionCount = record.analysis.concerns.length;

  return (
    <GlassCard strong className="app-card p-5 sm:p-6 lg:p-7">
      <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_minmax(210px,.8fr)_minmax(280px,1.2fr)] lg:gap-7">
        <HealthScoreRing score={record.analysis.score} hasData size={118} />

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-blue-600">Latest overview</p>
          <h2 className="mt-1.5 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">Health Score</h2>
          <div className="mt-2.5">
            <StatusBadge status={record.analysis.status} />
          </div>
          <p className="mt-3 text-xs text-slate-500">Updated {formatRecordedAt(record.recordedAt)}</p>
        </div>

        <div className="rounded-[18px] border border-blue-100/80 bg-gradient-to-br from-blue-50/80 to-cyan-50/70 p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-slate-900">
                {attentionCount === 0
                  ? "Your latest readings are within their typical ranges."
                  : `${attentionCount} ${attentionCount === 1 ? "reading needs" : "readings need"} attention today.`}
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600">{record.analysis.summary}</p>
              <a
                href="#careai-insight"
                className="mt-2.5 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-bold text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
              >
                View full insight <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
