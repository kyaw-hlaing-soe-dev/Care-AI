import {
  Activity,
  ChartNoAxesColumnIncreasing,
  Droplets,
  HeartPulse,
  Minus,
  Thermometer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { VitalRecord } from "@/lib/vitals";
import { useTranslation } from "react-i18next";

function Sparkline({ values }: { values: number[] }) {
  const { t } = useTranslation();
  const width = 180;
  const height = 46;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - 5 - ((value - min) / spread) * (height - 10);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-12 w-full"
      role="img"
      aria-label={t("dashboard.trendValues", { values: values.join(", ") })}
    >
      <defs>
        <linearGradient id="trend-line" x1="0" x2="1">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="url(#trend-line)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((value, index) => {
        const [x, y] = points.split(" ")[index]?.split(",").map(Number) ?? [0, 0];
        return (
          <circle
            key={`${value}-${index}`}
            cx={x}
            cy={y}
            r="2.5"
            fill="#fff"
            stroke="#2563eb"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

function Delta({
  current,
  previous,
  suffix = "",
}: {
  current: number;
  previous: number;
  suffix?: string;
}) {
  const { t } = useTranslation();
  const difference = Number((current - previous).toFixed(1));
  const Icon = difference > 0 ? TrendingUp : difference < 0 ? TrendingDown : Minus;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
      <Icon className="size-3.5 text-blue-500" aria-hidden="true" />
      {difference === 0
        ? t("dashboard.noChange")
        : t("dashboard.fromPrior", { value: `${difference > 0 ? "+" : ""}${difference}${suffix}` })}
    </span>
  );
}

export function TrendPreview({ records, limit = 4 }: { records: VitalRecord[]; limit?: number }) {
  const { t } = useTranslation();

  if (records.length < 2) {
    const latest = records[0];
    return (
      <section aria-labelledby="trends-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="trends-heading"
              className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-[22px]"
            >
              {t("dashboard.trends")}
            </h2>
          </div>
        </div>
        <GlassCard className="app-card p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-blue-50 text-blue-500">
                <ChartNoAxesColumnIncreasing className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold tracking-[-0.02em] text-slate-950">
                  {t("dashboard.trendUnavailable")}
                </h3>
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  {t("dashboard.trendUnavailableBody")}
                </p>
              </div>
            </div>
            {latest ? (
              <div className="grid grid-cols-2 gap-2 text-xs sm:w-[280px]">
                <span className="rounded-[13px] border border-slate-100 bg-slate-50/80 px-3 py-2">
                  <span className="block font-bold uppercase tracking-[0.08em] text-slate-400">
                    {t("dashboard.heartRate")}
                  </span>
                  <span className="mt-1 block font-extrabold text-slate-950">
                    {latest.heartRate} bpm
                  </span>
                </span>
                <span className="rounded-[13px] border border-slate-100 bg-slate-50/80 px-3 py-2">
                  <span className="block font-bold uppercase tracking-[0.08em] text-slate-400">
                    {t("dashboard.temperature")}
                  </span>
                  <span className="mt-1 block font-extrabold text-slate-950">
                    {latest.temperature}°C
                  </span>
                </span>
              </div>
            ) : null}
          </div>
        </GlassCard>
      </section>
    );
  }

  const recent = records.slice(0, 7).reverse();
  const latest = records[0];
  const previous = records[1];
  if (!latest || !previous) return null;

  const trends = [
    {
      label: t("dashboard.heartRate"),
      Icon: HeartPulse,
      values: recent.map((record) => record.heartRate),
      value: `${latest.heartRate} bpm`,
      current: latest.heartRate,
      previous: previous.heartRate,
      suffix: " bpm",
    },
    {
      label: t("dashboard.bloodPressure"),
      Icon: Droplets,
      values: recent.map((record) => record.systolic),
      value: `${latest.systolic}/${latest.diastolic}`,
      current: latest.systolic,
      previous: previous.systolic,
      suffix: " mmHg",
    },
    {
      label: t("dashboard.oxygen"),
      Icon: Activity,
      values: recent.map((record) => record.oxygen),
      value: `${latest.oxygen}%`,
      current: latest.oxygen,
      previous: previous.oxygen,
      suffix: "%",
    },
    {
      label: t("dashboard.temperature"),
      Icon: Thermometer,
      values: recent.map((record) => record.temperature),
      value: `${latest.temperature}°C`,
      current: latest.temperature,
      previous: previous.temperature,
      suffix: "°C",
    },
  ];

  return (
    <section aria-labelledby="trends-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2
            id="trends-heading"
            className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-[22px]"
          >
            {t("dashboard.trends")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("dashboard.trendsBody", { count: recent.length })}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trends.slice(0, limit).map((trend, index) => (
          <GlassCard key={trend.label} delay={index * 45} className="app-card p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                <trend.Icon className="size-4 text-blue-500" aria-hidden="true" />
                {trend.label}
              </span>
              <span className="text-sm font-extrabold text-slate-950">{trend.value}</span>
            </div>
            <div className="mt-2 rounded-[14px] bg-blue-50/55 px-2 py-1">
              <Sparkline values={trend.values} />
            </div>
            <div className="mt-2">
              <Delta current={trend.current} previous={trend.previous} suffix={trend.suffix} />
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
