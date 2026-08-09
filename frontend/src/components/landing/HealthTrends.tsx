import { Activity, Droplets, Thermometer } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useTranslation } from "react-i18next";

export function HealthTrends() {
  const { t } = useTranslation();
  return (
    <section
      id="trends"
      className="care-container care-section scroll-mt-28"
    >
      <SectionHeading
        eyebrow={t("landing.trends.eyebrow")}
        title={
          <>
            {t("landing.trends.title")}
          </>
        }
        subtitle={t("landing.trends.subtitle")}
      />

      <Reveal delay={0.1} className="mt-12 sm:mt-14">
        <div className="mx-auto max-w-[1200px] rounded-[28px] border border-white/90 bg-white/88 p-4 shadow-[0_24px_64px_-42px_rgba(35,79,137,0.34)] backdrop-blur-lg sm:p-6 lg:p-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)] lg:gap-5">
            <div className="rounded-[22px] border border-blue-100/75 bg-white/80 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold">{t("landing.trends.sevenDay")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t("landing.trends.lastSeven")}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-slate-950">
                  72 bpm
                </span>
              </div>
              <TrendChart />
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <MiniTrend
                Icon={Droplets}
                title={t("dashboard.bloodPressure")}
                value="120/76"
                color="#3b82f6"
                path="M4 48 C34 43, 48 30, 78 39 S124 50, 150 36 S198 30, 232 42 S270 35, 296 40"
              />
              <MiniTrend
                Icon={Activity}
                title={t("dashboard.oxygen")}
                value="98%"
                color="#14b8a6"
                path="M4 34 C35 50, 56 50, 82 27 S125 48, 154 35 S205 27, 232 43 S270 47, 296 25"
              />
              <MiniTrend
                Icon={Thermometer}
                title={t("dashboard.temperature")}
                value="39.2°C"
                color="#8b5cf6"
                path="M4 54 C35 51, 64 48, 92 46 S149 39, 176 34 S236 22, 296 14"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function TrendChart() {
  const { t } = useTranslation();
  return (
    <svg
      viewBox="0 0 520 180"
      className="mt-4 h-[160px] w-full sm:h-[180px]"
      role="img"
      aria-label={t("landing.trends.aria")}
    >
      <defs>
        <linearGradient id="trend-main-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[36, 82, 128].map((y) => (
        <line key={y} x1="8" x2="512" y1={y} y2={y} stroke="#dbeafe" strokeDasharray="4 7" />
      ))}
      <path
        d="M8 120 C58 90, 100 66, 154 89 S230 123, 286 76 S371 64, 415 94 S471 83, 512 88 L512 158 L8 158 Z"
        fill="url(#trend-main-fill)"
      />
      <path
        d="M8 120 C58 90, 100 66, 154 89 S230 123, 286 76 S371 64, 415 94 S471 83, 512 88"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {[
        [8, 120],
        [154, 89],
        [286, 76],
        [415, 94],
        [512, 88],
      ].map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="4"
          fill="white"
          stroke="#3b82f6"
          strokeWidth="3"
        />
      ))}
      {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map((day, i) => (
        <text key={day} x={8 + i * 84} y="176" fill="#64748b" fontSize="11">
          {t(`landing.trends.${day}`)}
        </text>
      ))}
    </svg>
  );
}

function MiniTrend({
  Icon,
  title,
  value,
  color,
  path,
  className = "",
}: {
  Icon: typeof Activity;
  title: string;
  value: string;
  color: string;
  path: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[22px] border border-blue-100/75 bg-white/80 p-4 sm:p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[11px] bg-blue-50 text-primary">
            <Icon className="size-4" />
          </span>
          <p className="text-xs font-extrabold">{title}</p>
        </div>
        <p className="text-sm font-extrabold tabular-nums">{value}</p>
      </div>
      <svg viewBox="0 0 300 70" className="mt-3 h-[70px] w-full" aria-hidden="true">
        <line x1="4" x2="296" y1="56" y2="56" stroke="#dbeafe" strokeDasharray="4 7" />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
