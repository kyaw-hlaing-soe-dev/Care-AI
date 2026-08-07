import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { Reveal } from "./Reveal";
import { LANDING_DEMO_ANALYSIS } from "./demo-data";

const BENEFITS = [
  { Icon: CheckCircle2, label: "What looks good", tone: "text-emerald-600", bg: "bg-emerald-50" },
  { Icon: AlertTriangle, label: "Areas to watch", tone: "text-amber-600", bg: "bg-amber-50" },
  { Icon: Lightbulb, label: "Practical recommendations", tone: "text-blue-600", bg: "bg-blue-50" },
];

export function AiAnalysis() {
  return (
    <section id="insights" className="mx-auto max-w-[1200px] scroll-mt-28 px-5 py-20 sm:py-24 lg:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] lg:gap-14">
        <Reveal>
          <div className="mx-auto max-w-lg text-center lg:mx-0 lg:text-left">
            <span className="glass-surface inline-flex rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
              CareAI Insight
            </span>
            <h2 className="mt-5 text-balance text-4xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-5xl">
              Health data shouldn&apos;t feel complicated.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
              CareAI converts your latest readings into understandable observations, so you can quickly see what looks typical and what may be worth monitoring.
            </p>

            <ul className="mx-auto mt-7 max-w-md space-y-3 text-left lg:mx-0">
              {BENEFITS.map(({ Icon, label, tone, bg }) => (
                <li key={label} className="flex items-center gap-3 rounded-[16px] border border-white/80 bg-white/65 px-4 py-3 shadow-[0_10px_28px_rgba(44,83,130,0.06)] backdrop-blur-sm">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-[11px] ${bg} ${tone}`}><Icon className="size-4" /></span>
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-xs leading-5 text-slate-500">
              Informational insights only—not a diagnosis or replacement for professional medical advice.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <AIInsightPanel analysis={LANDING_DEMO_ANALYSIS} />
        </Reveal>
      </div>
    </section>
  );
}
