import { motion } from "motion/react";
import {
  Activity,
  BrainCircuit,
  Cloud,
  History,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: "Google Authentication",
    body: "One tap to sign in. Your identity is verified by Google — no passwords to remember or leak.",
    tint: "from-primary to-sky",
  },
  {
    Icon: Activity,
    title: "Vital Tracking",
    body: "Blood pressure, heart rate, oxygen and temperature captured in under a minute.",
    tint: "from-rose-400 to-orange-400",
  },
  {
    Icon: BrainCircuit,
    title: "AI Health Analysis",
    body: "Every reading is reviewed instantly and turned into clear, plain-language guidance.",
    tint: "from-violet to-primary",
  },
  {
    Icon: LayoutDashboard,
    title: "Health Dashboard",
    body: "One calm surface showing your score, trends and what needs attention right now.",
    tint: "from-cyan to-teal",
  },
  {
    Icon: History,
    title: "Health History",
    body: "Scroll back through every reading you've logged with its full analysis attached.",
    tint: "from-amber-400 to-rose-400",
  },
  {
    Icon: Cloud,
    title: "Secure Cloud Storage",
    body: "Encrypted end to end and tied to your account only. Yours to export or delete anytime.",
    tint: "from-sky to-violet",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Features"
        title="Everything You Need for Better Healthcare"
        subtitle="A complete companion — from the first reading to the insight that changes your day."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal as="li" key={f.title} delay={i * 0.07}>
            <motion.article
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="glass-surface glass-glare gradient-ring h-full rounded-3xl p-7"
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
