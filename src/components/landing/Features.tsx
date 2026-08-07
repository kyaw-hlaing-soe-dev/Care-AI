import { motion } from "motion/react";
import {
  Activity,
  BrainCircuit,
  ChartNoAxesCombined,
  Gauge,
  History,
  ShieldCheck,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const FEATURES = [
  {
    Icon: Activity,
    title: "Vital Tracking",
    body: "Track blood pressure, heart rate, oxygen, and temperature.",
    tint: "from-rose-400 to-orange-400",
  },
  {
    Icon: Gauge,
    title: "Health Score",
    body: "Get a simple score summarizing your latest readings.",
    tint: "from-primary to-sky",
  },
  {
    Icon: BrainCircuit,
    title: "CareAI Insights",
    body: "Understand what looks good and what may need attention.",
    tint: "from-violet to-primary",
  },
  {
    Icon: ChartNoAxesCombined,
    title: "Health Trends",
    body: "See how your vital readings change over time.",
    tint: "from-cyan to-teal",
  },
  {
    Icon: History,
    title: "Health History",
    body: "Review previous readings and their CareAI insights.",
    tint: "from-amber-400 to-rose-400",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Google Sign-In",
    body: "Access your CareAI account quickly with Google sign-in.",
    tint: "from-sky to-primary",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to understand your health"
        subtitle="A focused toolkit for logging readings, seeing patterns, and understanding what your numbers mean."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <h3 className="mt-6 text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
