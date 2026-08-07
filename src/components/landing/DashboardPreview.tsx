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
import { HeartPulse, Droplets, Thermometer, Activity } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heart = DAYS.map((d, i) => ({ d, v: [72, 76, 70, 74, 68, 73, 71][i] }));
const bp = DAYS.map((d, i) => ({ d, sys: [120, 124, 118, 122, 119, 121, 120][i], dia: [80, 82, 78, 81, 79, 80, 78][i] }));
const oxygen = DAYS.map((d, i) => ({ d, v: [98, 97, 99, 98, 98, 97, 99][i] }));
const temp = DAYS.map((d, i) => ({ d, v: [36.6, 36.8, 36.7, 36.9, 36.6, 36.7, 36.7][i] }));

const STATS = [
  { Icon: HeartPulse, label: "Heart Rate", value: "72", unit: "bpm", tint: "from-rose-400 to-orange-400" },
  { Icon: Droplets, label: "Blood Pressure", value: "120/80", unit: "mmHg", tint: "from-primary to-sky" },
  { Icon: Activity, label: "Oxygen", value: "98", unit: "%", tint: "from-cyan to-teal" },
  { Icon: Thermometer, label: "Temperature", value: "36.7", unit: "°C", tint: "from-amber-400 to-rose-400" },
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
    <section id="dashboard" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Dashboard"
        title="Your Whole Week, at a Glance"
        subtitle="Realtime analytics with the depth of a clinic and the calm of a well-made app."
      />

      <Reveal delay={0.1} className="mt-14">
        <div className="glass-surface glass-glare glass-strong rounded-[2rem] p-5 sm:p-8">
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
            <div className="glass-surface flex flex-col items-center justify-center rounded-2xl p-7">
              <ScoreRing score={92} />
              <p className="mt-5 text-sm font-semibold text-good-text">Excellent condition</p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                All four vitals sit inside their healthy range this week.
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
                <Bar dataKey="dia" name="diastolic" fill="var(--brand-cyan)" radius={[6, 6, 0, 0]} />
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
      </Reveal>
    </section>
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

function ScoreRing({ score }: { score: number }) {
  const r = 62;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-40 place-items-center">
      <svg viewBox="0 0 150 150" className="size-40 -rotate-90">
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
        <span className="block text-4xl font-extrabold tabular-nums">{score}</span>
        <span className="block text-xs font-semibold text-muted-foreground">Health Score</span>
      </span>
    </div>
  );
}
