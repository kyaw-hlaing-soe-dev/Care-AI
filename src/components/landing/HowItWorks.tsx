import { Activity, AlertTriangle, ArrowDown, Check, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { Reveal, SectionHeading } from "./Reveal";
import { LANDING_TRACKER_DEMO } from "./demo-data";

const READINGS = [
  ["Systolic", String(LANDING_TRACKER_DEMO.systolic), "mmHg"],
  ["Diastolic", String(LANDING_TRACKER_DEMO.diastolic), "mmHg"],
  ["Heart Rate", String(LANDING_TRACKER_DEMO.heartRate), "bpm"],
  ["Oxygen", String(LANDING_TRACKER_DEMO.oxygen), "%"],
  ["Temperature", String(LANDING_TRACKER_DEMO.temperature), "°C"],
];

const ANALYSIS_ROWS = ["Blood Pressure", "Heart Rate", "Oxygen", "Temperature"];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="How it works"
        title={<>From a reading to an insight<br className="hidden sm:block" /> in three simple steps.</>}
        subtitle="Enter your readings, let CareAI organize the result, then review your score and structured insight."
      />

      <div className="mt-14 space-y-16 sm:space-y-20 lg:space-y-24">
        <StoryStep
          number="01"
          title="Log your vitals"
          description="Enter your blood pressure, heart rate, oxygen saturation, and temperature in less than a minute."
          visual={<VitalTrackerPreview />}
        />

        <JourneyConnector label="CareAI analyzes" />

        <StoryStep
          number="02"
          title="CareAI analyzes your readings"
          description="CareAI reviews your latest readings and compares them with the app's reference ranges and recent health data."
          visual={<AnalysisPreview />}
          reverse
        />

        <JourneyConnector label="Clear insight" />

        <StoryStep
          number="03"
          title="Understand your health"
          description="See your trends, areas to watch, and practical recommendations in your dashboard."
          visual={<InsightPreview />}
        />
      </div>
    </section>
  );
}

function StoryStep({
  number,
  title,
  description,
  visual,
  reverse = false,
}: {
  number: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div id={`how-step-${number}`} className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <Reveal className={reverse ? "lg:order-2" : ""}>
        <div className="mx-auto max-w-lg text-center lg:mx-0 lg:text-left">
          <span className="text-sm font-extrabold tracking-[0.18em] text-primary">
            STEP {number}
          </span>
          <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{title}</h3>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
        </div>
      </Reveal>
      <Reveal delay={0.08} className={reverse ? "lg:order-1" : ""}>
        {visual}
      </Reveal>
    </div>
  );
}

function VitalTrackerPreview() {
  return (
    <div className="glass-surface glass-glare glass-strong mx-auto max-w-[560px] rounded-[28px] p-5 sm:p-7">
      <div className="flex items-start gap-3 border-b border-blue-100/80 pb-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-primary to-cyan text-white">
          <Activity className="size-5" />
        </span>
        <div>
          <p className="font-extrabold">Your readings</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Use the values shown on your measurement devices.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3.5">
        {READINGS.map(([label, value, unit], index) => (
          <div key={label} className={index > 1 ? "col-span-2" : undefined}>
            <p className="mb-1.5 text-xs font-bold text-foreground/80">{label}</p>
            <div className="flex h-12 items-center justify-between rounded-[14px] border border-blue-100 bg-white px-4 text-sm shadow-[0_5px_18px_rgba(48,93,148,0.05)]">
              <span className="font-semibold tabular-nums text-foreground">{value}</span>
              <span className="text-xs font-semibold text-muted-foreground">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex h-13 items-center justify-center gap-2 rounded-[15px] bg-gradient-to-r from-primary to-cyan text-sm font-extrabold text-white shadow-[0_16px_34px_-16px_rgba(37,99,235,0.75)]">
        <Sparkles className="size-4" /> Analyze My Vitals
      </div>
    </div>
  );
}

function AnalysisPreview() {
  return (
    <div className="glass-surface glass-glare glass-strong mx-auto max-w-[540px] overflow-hidden rounded-[28px]">
      <div className="bg-gradient-to-r from-blue-50/90 to-cyan-50/80 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[14px] bg-gradient-to-br from-primary to-cyan text-white">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="font-extrabold">Checking readings...</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Turning readings into a clear overview
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5">
          {ANALYSIS_ROWS.map((row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-[14px] border border-white bg-white/85 px-4 py-3"
            >
              <span className="text-sm font-semibold">{row}</span>
              <span className="grid size-6 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 border-t border-blue-100/80 bg-white/85 p-5 sm:px-7">
        <HealthScoreRing score={88} hasData size={94} />
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
            Health Score
          </p>
          <div className="mt-2"><StatusBadge status="Attention Needed" /></div>
        </div>
      </div>
    </div>
  );
}

function InsightPreview() {
  const groups = [
    {
      Icon: CheckCircle2,
      title: "What looks good",
      tone: "text-emerald-600",
      bg: "bg-emerald-50",
      items: ["Heart rate is within the typical range.", "Oxygen is within the typical range."],
    },
    {
      Icon: AlertTriangle,
      title: "Areas to watch",
      tone: "text-amber-600",
      bg: "bg-amber-50",
      items: ["Temperature is above the typical range."],
    },
    {
      Icon: Lightbulb,
      title: "Recommendations",
      tone: "text-primary",
      bg: "bg-blue-50",
      items: ["Rest, stay hydrated, and re-check your temperature later."],
    },
  ];

  return (
    <div className="glass-surface glass-glare glass-strong mx-auto max-w-[560px] overflow-hidden rounded-[28px]">
      <div className="flex items-center gap-3 border-b border-blue-100/80 bg-gradient-to-r from-blue-50/80 to-cyan-50/70 p-5 sm:px-6">
        <span className="grid size-10 place-items-center rounded-[14px] bg-gradient-to-br from-primary to-cyan text-white">
          <Sparkles className="size-5" />
        </span>
        <div>
          <p className="font-extrabold">CareAI Health Insight</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            A simple view of what your readings mean
          </p>
        </div>
      </div>
      <div className="divide-y divide-blue-100/70">
        {groups.map(({ Icon, title, tone, bg, items }) => (
          <div key={title} className="p-4 sm:px-6 sm:py-5">
            <p
              className={`inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] ${tone}`}
            >
              <span className={`grid size-7 place-items-center rounded-lg ${bg}`}>
                <Icon className="size-3.5" />
              </span>
              {title}
            </p>
            <ul className="mt-2.5 space-y-2">
              {items.map((item) => (
                <li key={item} className="text-sm leading-6 text-muted-foreground">
                  → {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <a href="#dashboard" className="flex min-h-12 items-center justify-center border-t border-blue-100/70 bg-blue-50/55 text-sm font-extrabold text-blue-600 transition-colors hover:bg-blue-50">
        View Dashboard →
      </a>
    </div>
  );
}

function JourneyConnector({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="-my-8 flex flex-col items-center text-blue-400 sm:-my-10">
      <span className="h-8 w-px bg-gradient-to-b from-blue-200 to-cyan-300" />
      <span className="my-2 rounded-full border border-blue-100 bg-white/75 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-500 backdrop-blur-sm">{label}</span>
      <ArrowDown className="size-4" />
    </div>
  );
}
