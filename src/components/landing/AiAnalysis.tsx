import { motion } from "motion/react";
import { ArrowDown, ClipboardList, Sparkles, TrendingUp } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const STEPS = [
  {
    Icon: ClipboardList,
    title: "Input health data",
    body: "Log temperature, blood pressure, heart rate and oxygen in under a minute.",
    tint: "from-primary to-sky",
  },
  {
    Icon: TrendingUp,
    title: "AI analyzes trends",
    body: "CareAI compares today against your history and flags anything drifting.",
    tint: "from-cyan to-teal",
  },
  {
    Icon: Sparkles,
    title: "Receive recommendations",
    body: "Personalised, plain-language guidance — and a nudge if you should see a doctor.",
    tint: "from-violet to-primary",
  },
];

export function AiAnalysis() {
  return (
    <section id="ai" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="How it works"
        title="Intelligence That Reads Between Your Readings"
        subtitle="Three quiet steps between a number on a cuff and knowing what to do about it."
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="glass-surface glass-glare glass-strong rounded-[2rem] p-6">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-400" />
              <span className="size-2.5 rounded-full bg-amber-400" />
              <span className="size-2.5 rounded-full bg-good" />
              <span className="ml-3 text-xs font-semibold text-muted-foreground">
                careai.app/dashboard
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-primary/12 to-cyan/12 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  AI Health Insight
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Your vitals look strong this week. Resting heart rate dropped 4 bpm — keep the
                  evening walks going and stay hydrated.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Systolic", "120"],
                  ["Diastolic", "80"],
                  ["Heart Rate", "72"],
                  ["Oxygen", "98%"],
                ].map(([k, v]) => (
                  <div key={k} className="glass-surface rounded-2xl p-4">
                    <p className="text-xs font-semibold text-muted-foreground">{k}</p>
                    <p className="mt-1 text-xl font-extrabold tabular-nums">{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-good-bg px-5 py-4">
                <span className="text-2xl font-extrabold text-good-text tabular-nums">92</span>
                <span className="text-sm font-semibold text-good-text">
                  Excellent — no concerns detected
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="glass-surface glass-glare gradient-ring flex items-start gap-4 rounded-3xl p-6"
              >
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${s.tint} text-white shadow-[0_16px_28px_-14px_rgba(30,64,140,0.75)]`}
                >
                  <s.Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold">{s.title}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </span>
                </span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <span className="my-1 flex justify-center text-primary/60">
                  <ArrowDown className="size-4" />
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
