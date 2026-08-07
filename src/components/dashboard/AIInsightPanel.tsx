import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { VitalAnalysis } from "@/lib/vitals";
import { cn } from "@/lib/utils";

const GROUPS = [
  { key: "good", title: "What looks good", Icon: CheckCircle2, tone: "text-emerald-600", dot: "bg-emerald-500" },
  { key: "concerns", title: "Areas to watch", Icon: AlertTriangle, tone: "text-amber-600", dot: "bg-amber-500" },
  { key: "recommendations", title: "Recommendations", Icon: Lightbulb, tone: "text-blue-600", dot: "bg-blue-500" },
] as const;

export function AIInsightPanel({
  analysis,
  panelId = "careai-insight",
}: {
  analysis: VitalAnalysis;
  panelId?: string;
}) {
  return (
    <GlassCard id={panelId} strong className="app-card scroll-mt-24 overflow-hidden p-0">
      <div className="border-b border-blue-100/80 bg-gradient-to-r from-blue-50/80 via-white/60 to-cyan-50/75 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.025em] text-slate-950 sm:text-[22px]">
            <span className="grid size-9 place-items-center rounded-[13px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            CareAI Health Insight
          </h2>
          <span className="rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-600">
            AI analysis
          </span>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">{analysis.summary}</p>
      </div>

      <div className="grid lg:grid-cols-3">
        {GROUPS.map(({ key, title, Icon, tone, dot }, index) => {
          const items = analysis[key];
          return (
            <section
              key={key}
              className={cn(
                "p-5 sm:p-6",
                index > 0 && "border-t border-slate-100 lg:border-l lg:border-t-0",
              )}
            >
              <h3 className={cn("inline-flex items-center gap-2 text-sm font-bold", tone)}>
                <Icon className="size-4" aria-hidden="true" />
                {title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-600">
                    <span className={cn("mt-2.5 size-1.5 shrink-0 rounded-full", dot)} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </GlassCard>
  );
}
