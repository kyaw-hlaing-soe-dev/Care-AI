import {
  Activity,
  ArrowDown,
  BrainCircuit,
  Check,
  ClipboardList,
  History,
  Lightbulb,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useTranslation } from "react-i18next";

const STEPS = [
  {
    number: "01",
    Icon: ClipboardList,
    titleKey: "landing.how.log",
    bodyKey: "landing.how.logBody",
    items: [
      "vitals.bloodPressure",
      "dashboard.heartRate",
      "dashboard.oxygen",
      "dashboard.temperature",
    ],
  },
  {
    number: "02",
    Icon: BrainCircuit,
    titleKey: "landing.how.analyze",
    bodyKey: "landing.how.analyzeBody",
    items: [
      "dashboard.healthScore",
      "dashboard.aiAnalysis",
      "landing.how.checking",
      "dashboard.trends",
    ],
  },
  {
    number: "03",
    Icon: Lightbulb,
    titleKey: "landing.how.understand",
    bodyKey: "landing.how.understandBody",
    items: [
      "dashboard.whatLooksGood",
      "dashboard.areasToWatch",
      "dashboard.recommendations",
      "nav.history",
    ],
  },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section id="how-it-works" className="care-container care-section scroll-mt-28">
      <SectionHeading
        eyebrow={t("landing.how.eyebrow")}
        title={t("landing.how.title")}
        subtitle={t("landing.how.subtitle")}
      />

      <Reveal delay={0.08} className="mt-12 lg:mt-14">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-[44px] hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block"
          />
          <ol className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.number} className="relative">
                <article className="relative h-full rounded-[24px] border border-slate-200/75 bg-white/88 p-5 shadow-[0_12px_32px_rgba(44,83,130,0.075)] sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-[15px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
                      <step.Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[13px] font-extrabold tracking-[0.16em] text-blue-500">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[22px] font-extrabold tracking-[-0.035em] text-slate-950">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t(step.bodyKey)}</p>

                  <ul className="mt-5 grid gap-2.5">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                          <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span>{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                {index < STEPS.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className="mx-auto flex h-10 w-10 items-center justify-center text-blue-400 lg:hidden"
                  >
                    <span className="absolute h-8 w-px bg-gradient-to-b from-blue-200 to-cyan-300" />
                    <ArrowDown className="relative mt-8 size-4" />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mx-auto mt-8 max-w-3xl">
        <div className="rounded-[22px] border border-blue-100/80 bg-blue-50/55 px-5 py-4 text-center text-sm leading-6 text-slate-600">
          <Activity className="mr-2 inline size-4 text-blue-600" aria-hidden="true" />
          {t("landing.how.insightBody")}
          <span className="mx-2 text-blue-300" aria-hidden="true">/</span>
          <History className="mr-2 inline size-4 text-blue-600" aria-hidden="true" />
          {t("history.newestFirst")}
        </div>
      </Reveal>
    </section>
  );
}
