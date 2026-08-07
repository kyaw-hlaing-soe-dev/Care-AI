import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  HeartPulse,
  Lightbulb,
  Sparkles,
  Thermometer,
} from "lucide-react";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { HealthOverviewCard } from "@/components/dashboard/HealthOverviewCard";
import { TrendPreview } from "@/components/dashboard/TrendPreview";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { VitalSummaryGrid } from "@/components/VitalSummaryGrid";
import { Reveal, SectionHeading } from "./Reveal";
import { LANDING_DEMO_ANALYSIS, LANDING_DEMO_RECORDS } from "./demo-data";

const latest = LANDING_DEMO_RECORDS[0]!;
const previous = LANDING_DEMO_RECORDS[1]!;

const MOBILE_VITALS = [
  {
    Icon: Droplets,
    label: "Blood Pressure",
    value: "120/76",
    unit: "mmHg",
    status: "Good" as const,
  },
  { Icon: HeartPulse, label: "Heart Rate", value: "72", unit: "bpm", status: "Good" as const },
  { Icon: Activity, label: "Oxygen", value: "98", unit: "%", status: "Good" as const },
  {
    Icon: Thermometer,
    label: "Temperature",
    value: "39.2",
    unit: "°C",
    status: "Attention Needed" as const,
  },
];

export function DashboardPreview() {
  return (
    <section
      id="dashboard"
      className="mx-auto max-w-[1250px] scroll-mt-28 px-5 py-20 sm:py-24 lg:py-28"
    >
      <SectionHeading
        eyebrow="Your health at a glance"
        title={
          <>
            Everything that matters,
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">in one clear dashboard.</span>
          </>
        }
        subtitle="See your latest readings, health score, AI insights and trends without digging through complicated health data."
      />

      <Reveal delay={0.08} className="mt-10 sm:mt-14">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-[10%] bottom-0 top-[8%] -z-10 rounded-full bg-cyan-300/20 blur-[90px]" />

          <div className="hidden overflow-hidden rounded-[32px] border border-white/90 bg-[#f8fbff]/92 p-5 shadow-[0_38px_90px_-42px_rgba(35,79,137,0.38)] backdrop-blur-xl md:block lg:p-7">
            <ProductFrameHeader />
            <div className="mt-5 space-y-5 lg:space-y-6">
              <HealthOverviewCard record={latest} />
              <VitalSummaryGrid record={latest} previousRecord={previous} />
              <AIInsightPanel
                analysis={LANDING_DEMO_ANALYSIS}
                panelId="landing-dashboard-insight"
              />
              <TrendPreview records={LANDING_DEMO_RECORDS} limit={3} />
            </div>
          </div>

          <MobileDashboardPreview />
        </div>
      </Reveal>
    </section>
  );
}

function ProductFrameHeader() {
  return (
    <div className="flex items-center justify-between border-b border-blue-100/80 pb-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-[13px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
          <HeartPulse className="size-4" />
        </span>
        <span className="font-extrabold tracking-[-0.025em] text-slate-950">CareAI</span>
      </div>
      <div className="flex items-center gap-2 rounded-[16px] border border-slate-200/80 bg-white/75 p-1 text-xs font-bold text-slate-500">
        <span className="rounded-[11px] bg-blue-50 px-3 py-2 text-blue-600">Dashboard</span>
        <span className="px-3 py-2">Vital Tracker</span>
        <span className="px-3 py-2">History</span>
      </div>
      <span className="rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 px-3 py-2 text-xs font-extrabold text-white">
        Demo
      </span>
    </div>
  );
}

function MobileDashboardPreview() {
  return (
    <div className="mx-auto max-w-[430px] overflow-hidden rounded-[28px] border border-white/90 bg-[#f8fbff]/94 p-4 shadow-[0_30px_72px_-38px_rgba(35,79,137,0.4)] backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-between border-b border-blue-100/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[11px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
            <HeartPulse className="size-3.5" />
          </span>
          <span className="text-sm font-extrabold text-slate-950">CareAI</span>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold text-blue-600">
          Dashboard
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-[20px] border border-blue-100/80 bg-white/85 p-4 shadow-[0_12px_28px_rgba(44,83,130,0.08)]">
        <HealthScoreRing score={88} hasData size={94} />
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-600">
            Latest overview
          </p>
          <p className="mt-1 text-lg font-extrabold tracking-tight text-slate-950">Health Score</p>
          <div className="mt-2">
            <StatusBadge status="Attention Needed" />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {MOBILE_VITALS.map(({ Icon, label, value, unit, status }) => (
          <div
            key={label}
            className="min-w-0 rounded-[18px] border border-slate-200/80 bg-white/88 p-3.5 shadow-[0_10px_24px_rgba(44,83,130,0.07)]"
          >
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.04em] text-slate-500">
              <span className="grid size-7 shrink-0 place-items-center rounded-[10px] bg-blue-50 text-blue-500">
                <Icon className="size-3.5" />
              </span>
              <span className="min-w-0 leading-4">{label}</span>
            </div>
            <p className="mt-3 flex flex-wrap items-baseline gap-1 text-slate-950">
              <span className="text-xl font-extrabold tracking-[-0.04em] tabular-nums">
                {value}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">{unit}</span>
            </p>
            <div className="mt-2">
              <StatusBadge status={status} className="px-2 py-0.5 text-[9px]" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-[20px] border border-blue-100/80 bg-white/88">
        <div className="flex items-center gap-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3">
          <span className="grid size-8 place-items-center rounded-[11px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-xs font-extrabold text-slate-950">CareAI Health Insight</p>
            <p className="mt-0.5 text-[10px] text-slate-500">1 reading needs attention today.</p>
          </div>
        </div>
        <div className="space-y-2.5 p-4">
          <InsightLine
            Icon={CheckCircle2}
            tone="text-emerald-600"
            text="Heart rate and oxygen are within range."
          />
          <InsightLine
            Icon={AlertTriangle}
            tone="text-amber-600"
            text="Temperature is above the typical range."
          />
          <InsightLine
            Icon={Lightbulb}
            tone="text-blue-600"
            text="Rest, hydrate, and re-check later."
          />
        </div>
      </div>

      <div className="mt-3 rounded-[20px] border border-blue-100/80 bg-white/88 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold text-slate-950">Heart Rate trend</p>
          <span className="text-xs font-extrabold text-slate-950">72 bpm</span>
        </div>
        <svg
          viewBox="0 0 300 76"
          className="mt-2 h-[76px] w-full"
          role="img"
          aria-label="Illustrative heart-rate trend"
        >
          <defs>
            <linearGradient id="mobile-dashboard-line" x1="0" x2="1">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <path
            d="M5 53 C42 31, 76 37, 106 45 S164 57, 196 32 S252 28, 295 42"
            fill="none"
            stroke="url(#mobile-dashboard-line)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {["5,53", "106,45", "196,32", "295,42"].map((point) => {
            const [x, y] = point.split(",");
            return (
              <circle
                key={point}
                cx={x}
                cy={y}
                r="3"
                fill="white"
                stroke="#2563eb"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function InsightLine({
  Icon,
  tone,
  text,
}: {
  Icon: typeof CheckCircle2;
  tone: string;
  text: string;
}) {
  return (
    <p className="flex items-start gap-2 text-[11px] leading-5 text-slate-600">
      <Icon className={`mt-0.5 size-3.5 shrink-0 ${tone}`} />
      {text}
    </p>
  );
}
