import { motion } from "motion/react";
import { Activity, BrainCircuit, ChartNoAxesCombined, History } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const FEATURES = [
  {
    Icon: Activity,
    number: "01",
    title: "Track Your Vitals",
    body: "Blood pressure, heart rate, oxygen saturation and temperature.",
    tint: "from-primary to-sky",
  },
  {
    number: "02",
    Icon: BrainCircuit,
    title: "AI Health Insights",
    body: "CareAI turns your readings into simple, understandable information.",
    tint: "from-violet to-primary",
  },
  {
    number: "03",
    Icon: ChartNoAxesCombined,
    title: "Understand Your Trends",
    body: "See how your readings change over time.",
    tint: "from-cyan to-teal",
  },
  {
    number: "04",
    Icon: History,
    title: "Your Health History",
    body: "Review previous readings and health scores whenever you need them.",
    tint: "from-amber-400 to-rose-400",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to understand your vitals."
        subtitle="Four focused tools that carry your readings from the tracker into a clear, useful health history."
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal as="li" key={f.title} delay={i * 0.07}>
            <motion.article
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="glass-surface glass-glare gradient-ring h-full rounded-3xl p-6 sm:p-7"
            >
              <span
                className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${f.tint} text-white shadow-[0_18px_32px_-14px_rgba(30,64,140,0.7)]`}
              >
                <f.Icon className="size-6" />
              </span>
              <span className="absolute right-6 top-6 text-xs font-extrabold tracking-[0.16em] text-primary/55">
                {f.number}
              </span>
              <h3 className="mt-6 text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
