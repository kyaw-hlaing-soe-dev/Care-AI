import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  HeartPulse,
  Droplets,
  Thermometer,
  Activity,
  ChartNoAxesCombined,
  CheckCircle2,
  Gauge,
  Sparkles,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heart = DAYS.map((d, i) => ({ d, v: [72, 76, 70, 74, 68, 73, 71][i] }));
const bp = DAYS.map((d, i) => ({
  d,
  sys: [120, 124, 118, 122, 119, 121, 120][i],
  dia: [80, 82, 78, 81, 79, 80, 78][i],
}));
const oxygen = DAYS.map((d, i) => ({ d, v: [98, 97, 99, 98, 98, 97, 99][i] }));
const temp = DAYS.map((d, i) => ({ d, v: [36.6, 36.8, 36.7, 36.9, 36.6, 36.7, 36.7][i] }));

const STATS = [
  {
    Icon: HeartPulse,
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    tint: "from-rose-400 to-orange-400",
  },
  {
    Icon: Droplets,
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    tint: "from-primary to-sky",
  },
  { Icon: Activity, label: "Oxygen", value: "98", unit: "%", tint: "from-cyan to-teal" },
  {
    Icon: Thermometer,
    label: "Temperature",
    value: "36.7",
    unit: "°C",
    tint: "from-amber-400 to-rose-400",
  },
];

const HIGHLIGHTS = [
  {
    Icon: Gauge,
    title: "Health Score",
    body: "Understand your latest readings at a glance.",
    tint: "from-primary to-sky",
  },
  {
    Icon: ChartNoAxesCombined,
    title: "Vital Trends",
    body: "See how your heart rate, blood pressure, oxygen, and temperature change over time.",
    tint: "from-cyan to-teal",
  },
  {
    Icon: Sparkles,
    title: "CareAI Insight",
    body: "Get simple explanations of what looks good, what to watch, and what you can do next.",
    tint: "from-violet to-primary",
  },
];

const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false };
const tip = {
  contentStyle: {
    borderRadius: 14,
    border: "1px solid var(--glass-border)",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    fontSize: 12,
  },
};

export function DashboardPreview() {
  return (
    <section id="dashboard" className="mx-auto max-w-[1240px] scroll-mt-28 px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Your health at a glance"
        title={
          <>
            Everything that matters,
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">in one clear dashboard.</span>
          </>
        }
        subtitle="See your latest vitals, health score, trends, and CareAI insights in one simple view."
      />

      <Reveal delay={0.1} className="mt-10 sm:mt-14">
        <div className="hidden rounded-[2rem] border border-white/90 bg-white/88 p-5 shadow-[0_36px_90px_-42px_rgba(35,79,137,0.42)] backdrop-blur-xl md:block lg:p-7">
          <div className="mb-5 flex items-center justify-between border-b border-blue-100/80 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-cyan text-white">
                <Activity className="size-4" />
              </span>
              <span className="font-extrabold tracking-tight">CareAI</span>
            </div>
            <div className="flex items-center gap-5 text-xs font-semibold text-muted-foreground">
              <span className="text-primary">Dashboard</span>
              <span>Vital Tracker</span>
              <span>History</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass-surface rounded-2xl p-4">
                <span
                  className={`grid size-9 place-items-center rounded-xl bg-gradient-to-br ${s.tint} text-white shadow-md`}
                >
                  <s.Icon className="size-4" />
                </span>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums">
                  {s.value}
                  <span className="ml-1 text-sm font-semibold text-muted-foreground">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="glass-surface flex flex-col items-center justify-center rounded-2xl p-6">
              <ScoreRing score={92} />
              <p className="mt-4 text-sm font-semibold text-good-text">Excellent</p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Your latest readings are within their typical ranges.
              </p>
            </div>

            <div className="glass-surface rounded-2xl p-5">
              <h3 className="text-sm font-bold">Heart Rate — 7 day trend</h3>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heart} margin={{ left: -18, right: 6, top: 6 }}>
                    <defs>
                      <linearGradient id="hr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="d" {...axis} />
                    <YAxis domain={[60, 85]} {...axis} />
                    <Tooltip {...tip} />
                    <Area
                      type="monotone"
                      dataKey="v"
                      name="bpm"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      fill="url(#hr)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <ChartCard title="Blood Pressure">
              <BarChart data={bp} margin={{ left: -22, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" {...axis} />
                <YAxis domain={[60, 140]} {...axis} />
                <Tooltip {...tip} />
                <Bar dataKey="sys" name="systolic" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                <Bar
                  dataKey="dia"
                  name="diastolic"
                  fill="var(--brand-cyan)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartCard>

            <ChartCard title="Oxygen Saturation">
              <LineChart data={oxygen} margin={{ left: -22, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" {...axis} />
                <YAxis domain={[94, 100]} {...axis} />
                <Tooltip {...tip} />
                <Line
                  type="monotone"
                  dataKey="v"
                  name="%"
                  stroke="var(--brand-teal)"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartCard>

            <ChartCard title="Temperature">
              <LineChart data={temp} margin={{ left: -22, right: 6, top: 6 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" {...axis} />
                <YAxis domain={[36, 37.5]} {...axis} />
                <Tooltip {...tip} />
                <Line
                  type="monotone"
                  dataKey="v"
                  name="°C"
                  stroke="var(--brand-violet)"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartCard>
          </div>
        </div>

        <MobileDashboard />
      </Reveal>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {HIGHLIGHTS.map(({ Icon, title, body, tint }, index) => (
          <Reveal as="li" key={title} delay={index * 0.07}>
            <div className="glass-surface h-full rounded-[22px] p-5 sm:p-6">
              <span
                className={`grid size-10 place-items-center rounded-[14px] bg-gradient-to-br ${tint} text-white shadow-sm`}
              >
                <Icon className="size-4.5" />
              </span>
              <h3 className="mt-4 text-base font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function MobileDashboard() {
  return (
    <div className="mx-auto max-w-[430px] rounded-[28px] border border-white/90 bg-white/90 p-4 shadow-[0_28px_70px_-36px_rgba(35,79,137,0.42)] backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-between border-b border-blue-100/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[11px] bg-gradient-to-br from-primary to-cyan text-white">
            <Activity className="size-3.5" />
          </span>
          <span className="text-sm font-extrabold">CareAI</span>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-primary">
          Dashboard
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[112px_minmax(0,1fr)] items-center gap-3 rounded-[20px] border border-blue-100/70 bg-gradient-to-br from-blue-50/80 to-cyan-50/70 p-3">
        <ScoreRing score={92} compact />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            Latest overview
          </p>
          <p className="mt-1 text-base font-extrabold">Excellent</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Your readings look consistent today.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <MobileVital Icon={HeartPulse} label="Heart rate" value="72" unit="bpm" />
        <MobileVital Icon={Droplets} label="Blood pressure" value="120/80" unit="mmHg" />
      </div>

      <div className="mt-3 rounded-[20px] border border-blue-100/70 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold">Heart Rate — 7 day trend</p>
          <span className="text-[10px] font-bold text-good-text">Stable</span>
        </div>
        <svg
          viewBox="0 0 300 92"
          className="mt-3 h-[92px] w-full"
          role="img"
          aria-label="Stable seven-day heart-rate trend"
        >
          <defs>
            <linearGradient id="mobile-heart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M4 72 C38 54, 58 47, 86 60 S130 74, 158 48 S205 43, 230 56 S270 52, 296 60 L296 88 L4 88 Z"
            fill="url(#mobile-heart-fill)"
          />
          <path
            d="M4 72 C38 54, 58 47, 86 60 S130 74, 158 48 S205 43, 230 56 S270 52, 296 60"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mt-3 flex gap-3 rounded-[20px] border border-blue-100/70 bg-blue-50/60 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-cyan text-white">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-xs font-extrabold">CareAI Insight</p>
          <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-good-text" /> Your latest
            readings are within their typical ranges.
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileVital({
  Icon,
  label,
  value,
  unit,
}: {
  Icon: typeof HeartPulse;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-[18px] border border-blue-100/70 bg-white p-3.5">
      <Icon className="size-4 text-primary" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-lg font-extrabold tabular-nums">
        {value}
        <span className="ml-1 text-[10px] font-semibold text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="glass-surface rounded-2xl p-5">
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-4 h-44">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ScoreRing({ score, compact = false }: { score: number; compact?: boolean }) {
  const r = 62;
  const c = 2 * Math.PI * r;
  return (
    <div className={`relative grid place-items-center ${compact ? "size-[104px]" : "size-40"}`}>
      <svg viewBox="0 0 150 150" className={`${compact ? "size-[104px]" : "size-40"} -rotate-90`}>
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--brand-cyan)" />
          </linearGradient>
        </defs>
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--border)" strokeWidth="12" />
        <circle
          cx="75"
          cy="75"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (score / 100) * c}
        />
      </svg>
      <span className="absolute text-center">
        <span className={`block font-extrabold tabular-nums ${compact ? "text-2xl" : "text-4xl"}`}>
          {score}
        </span>
        <span
          className={`block font-semibold text-muted-foreground ${compact ? "text-[9px]" : "text-xs"}`}
        >
          Health Score
        </span>
      </span>
    </div>
  );
}
