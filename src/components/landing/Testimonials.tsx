import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const STORIES = [
  {
    name: "Amara Osei",
    role: "Marathon runner",
    initials: "AO",
    tint: "from-primary to-sky",
    quote:
      "CareAI caught a slow climb in my resting heart rate two weeks before I felt anything. It reads like a friend, not a chart.",
  },
  {
    name: "Daniel Reyes",
    role: "Type 2 diabetic",
    initials: "DR",
    tint: "from-cyan to-teal",
    quote:
      "Logging takes forty seconds and the summary is in plain English. My doctor now asks me to bring the history to appointments.",
  },
  {
    name: "Priya Nandakumar",
    role: "Caring for her father",
    initials: "PN",
    tint: "from-violet to-primary",
    quote:
      "I track Dad's blood pressure from two cities away. The urgent alert once sent us straight to the clinic — it was the right call.",
  },
];

export function Testimonials() {
  return (
    <section id="stories" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Stories"
        title="Trusted in Everyday Life"
        subtitle="People use CareAI between appointments — the long stretch where health actually happens."
      />

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {STORIES.map((s, i) => (
          <Reveal as="li" key={s.name} delay={i * 0.08}>
            <motion.figure
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="glass-surface glass-glare gradient-ring h-full rounded-3xl p-7"
            >
              <span className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-4 fill-current" />
                ))}
              </span>
              <blockquote className="mt-5 text-sm leading-relaxed text-foreground/85">
                “{s.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${s.tint} text-sm font-bold text-white shadow-md`}
                >
                  {s.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{s.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{s.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
