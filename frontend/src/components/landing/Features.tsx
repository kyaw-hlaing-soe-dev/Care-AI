import { motion } from "motion/react";
import { Activity, BrainCircuit, ChartNoAxesCombined, History } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useTranslation } from "react-i18next";

const FEATURES = [
  {
    Icon: Activity,
    number: "01",
    titleKey: "landing.features.track",
    bodyKey: "landing.features.trackBody",
    tint: "from-primary to-sky",
  },
  {
    number: "02",
    Icon: BrainCircuit,
    titleKey: "landing.features.insights",
    bodyKey: "landing.features.insightsBody",
    tint: "from-violet to-primary",
  },
  {
    number: "03",
    Icon: ChartNoAxesCombined,
    titleKey: "landing.features.trends",
    bodyKey: "landing.features.trendsBody",
    tint: "from-cyan to-teal",
  },
  {
    number: "04",
    Icon: History,
    titleKey: "landing.features.history",
    bodyKey: "landing.features.historyBody",
    tint: "from-amber-400 to-rose-400",
  },
];

export function Features() {
  const { t } = useTranslation();
  return (
    <section id="features" className="care-container care-section scroll-mt-28">
      <SectionHeading
        eyebrow={t("landing.features.eyebrow")}
        title={t("landing.features.title")}
        subtitle={t("landing.features.subtitle")}
      />

      <ul className="feature-grid mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:mt-14 xl:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal as="li" key={f.titleKey} delay={i * 0.07}>
            <motion.article
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="gradient-ring relative h-full rounded-[24px] border border-slate-200/75 bg-white/88 p-5 shadow-[0_12px_32px_rgba(44,83,130,0.07)] sm:p-6"
            >
              <span
                className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${f.tint} text-white shadow-[0_18px_32px_-14px_rgba(30,64,140,0.7)]`}
              >
                <f.Icon className="size-6" />
              </span>
              <span className="absolute right-6 top-6 text-xs font-extrabold tracking-[0.16em] text-primary/55">
                {f.number}
              </span>
              <h3 className="landing-card-title mt-6 text-lg font-bold tracking-tight">{t(f.titleKey)}</h3>
              <p className="myanmar-readable mt-2.5 text-sm leading-relaxed text-muted-foreground">{t(f.bodyKey)}</p>
            </motion.article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
