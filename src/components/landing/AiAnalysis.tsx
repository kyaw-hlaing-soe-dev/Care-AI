import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const GROUPS = [
  {
    Icon: CheckCircle2,
    title: "What Looks Good",
    tone: "text-emerald-700",
    iconBg: "bg-emerald-50",
    dot: "bg-emerald-500",
    items: [
      "Heart rate is within the typical range at 72 bpm.",
      "Oxygen saturation is steady at 98%.",
    ],
  },
  {
    Icon: AlertTriangle,
    title: "Areas to Watch",
    tone: "text-amber-700",
    iconBg: "bg-amber-50",
    dot: "bg-amber-500",
    items: [
      "Watch for meaningful changes in your blood pressure over time.",
      "One reading matters less than a consistent trend.",
    ],
  },
  {
    Icon: Lightbulb,
    title: "Recommendations",
    tone: "text-blue-700",
    iconBg: "bg-blue-50",
    dot: "bg-blue-500",
    items: [
      "Keep logging at a similar time each day for clearer trends.",
      "Discuss unexpected or concerning readings with a healthcare professional.",
    ],
  },
];

export function AiAnalysis() {
  return (
    <section id="insights" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="CareAI Insight"
        title={
          <>
            Health data is useful.
            <br className="hidden sm:block" /> Understanding it is better.
          </>
        }
        subtitle="CareAI turns your vital readings into clear, simple insights."
      />

      <Reveal delay={0.1} className="mt-12 sm:mt-14">
        <div className="overflow-hidden rounded-[30px] border border-white/90 bg-white/88 shadow-[0_34px_84px_-42px_rgba(35,79,137,0.44)] backdrop-blur-xl">
          <div className="border-b border-blue-100/80 bg-gradient-to-r from-blue-50/90 via-white/80 to-cyan-50/85 p-5 sm:px-7 sm:py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-gradient-to-br from-primary to-cyan text-white shadow-[0_12px_26px_-12px_rgba(37,99,235,0.7)]">
                  <Sparkles className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">
                    CareAI Health Insight
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Informational analysis of your latest readings
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-blue-100 bg-white/85 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary">
                Health Score 92
              </span>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-foreground/75">
              Your latest values are generally within their typical ranges. Continue tracking
              regularly so CareAI can help you see meaningful changes over time.
            </p>
          </div>

          <div className="grid lg:grid-cols-3">
            {GROUPS.map(({ Icon, title, tone, iconBg, dot, items }, index) => (
              <article
                key={title}
                className={`p-5 sm:p-7 ${index > 0 ? "border-t border-blue-100/70 lg:border-l lg:border-t-0" : ""}`}
              >
                <h4 className={`flex items-center gap-2.5 text-sm font-extrabold ${tone}`}>
                  <span className={`grid size-8 place-items-center rounded-[11px] ${iconBg}`}>
                    <Icon className="size-4" />
                  </span>
                  {title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                      <span className={`mt-2.5 size-1.5 shrink-0 rounded-full ${dot}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-muted-foreground">
        CareAI provides informational health insights and is not a substitute for professional
        medical advice.
      </p>
    </section>
  );
}
