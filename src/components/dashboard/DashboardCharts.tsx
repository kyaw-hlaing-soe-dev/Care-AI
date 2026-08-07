import { useMemo, useId } from "react";
import { useReducedMotion } from "motion/react";
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
  type TooltipProps,
} from "recharts";
import { GlassCard } from "@/components/glass/GlassCard";
import type { VitalRecord } from "@/lib/vitals";

type ChartPoint = {
  label: string;
  fullDate: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  oxygen: number;
  temperature: number;
};

type NumericTooltipPayload = TooltipProps<number, string>["payload"];

function useChartData(records: VitalRecord[]) {
  return useMemo<ChartPoint[]>(
    () =>
      records
        .slice(0, 7)
        .reverse()
        .map((record) => {
          const date = new Date(record.recordedAt);
          return {
            label: date.toLocaleDateString(undefined, { weekday: "short" }),
            fullDate: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
            heartRate: record.heartRate,
            systolic: record.systolic,
            diastolic: record.diastolic,
            oxygen: record.oxygen,
            temperature: record.temperature,
          };
        }),
    [records],
  );
}

function ChartTooltip({
  active,
  payload,
  valueFormatter,
}: {
  active?: boolean | undefined;
  payload?: NumericTooltipPayload | undefined;
  valueFormatter: (name: string, value: number) => string;
}) {
  const point = payload?.[0]?.payload as ChartPoint | undefined;
  if (!active || !payload?.length || !point) return null;

  return (
    <div className="rounded-[13px] border border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-[0_12px_28px_rgba(44,83,130,0.14)] backdrop-blur-md">
      <p className="text-xs font-bold text-slate-900">{point.fullDate}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <p key={entry.dataKey?.toString()} className="text-xs font-semibold" style={{ color: entry.color }}>
            {valueFormatter(entry.name?.toString() ?? "Reading", Number(entry.value))}
          </p>
        ))}
      </div>
    </div>
  );
}

function MoreDataMessage({ count }: { count: number }) {
  if (count !== 1) return null;
  return (
    <p className="pointer-events-none absolute inset-x-4 bottom-3 text-center text-[11px] font-semibold text-slate-400">
      Add more readings to build your trend.
    </p>
  );
}

const axisTick = { fill: "#64748b", fontSize: 11, fontWeight: 500 };
const gridColor = "#dbe7f5";

export function HeartRateTrendCard({ records }: { records: VitalRecord[] }) {
  const data = useChartData(records);
  const reducedMotion = Boolean(useReducedMotion());
  const gradientId = `heart-area-${useId().replace(/:/g, "")}`;
  const values = data.map((point) => point.heartRate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const domain: [number, number] = [Math.max(0, Math.floor(min - 8)), Math.ceil(max + 8)];

  return (
    <GlassCard className="app-card min-w-0 p-4 sm:p-5 lg:p-6">
      <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">Heart Rate — 7 day trend</h2>
      <div
        className="relative mt-3 h-[240px] w-full sm:h-[270px] lg:h-[286px]"
        role="img"
        aria-label={`Heart rate trend for the last ${data.length} ${data.length === 1 ? "reading" : "readings"}: ${values.join(", ")} beats per minute.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }} accessibilityLayer>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisTick} dy={8} />
            <YAxis domain={domain} axisLine={false} tickLine={false} tick={axisTick} width={42} allowDecimals={false} />
            <Tooltip
              content={(props) => (
                <ChartTooltip
                  active={props.active}
                  payload={props.payload as NumericTooltipPayload}
                  valueFormatter={(_, value) => `${value} bpm`}
                />
              )}
              cursor={{ stroke: "#bfdbfe", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="heartRate"
              name="Heart rate"
              stroke="#3b82f6"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
              dot={data.length <= 3 ? { r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 } : false}
              isAnimationActive={!reducedMotion}
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
        <MoreDataMessage count={data.length} />
      </div>
    </GlassCard>
  );
}

function BloodPressureChart({ data, reducedMotion }: { data: ChartPoint[]; reducedMotion: boolean }) {
  const lowest = Math.min(...data.map((point) => point.diastolic));
  const highest = Math.max(...data.map((point) => point.systolic));
  return (
    <>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-500" /> Systolic</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-cyan-400" /> Diastolic</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 4, left: -22, bottom: 0 }} accessibilityLayer>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisTick} dy={7} />
          <YAxis domain={[Math.max(0, Math.floor(lowest - 20)), Math.ceil(highest + 20)]} axisLine={false} tickLine={false} tick={axisTick} width={42} />
          <Tooltip
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as NumericTooltipPayload}
                valueFormatter={(name, value) => `${name}: ${value} mmHg`}
              />
            )}
            cursor={{ fill: "#eff6ff" }}
          />
          <Bar dataKey="systolic" name="Systolic" fill="#3b82f6" radius={[6, 6, 2, 2]} maxBarSize={16} isAnimationActive={!reducedMotion} />
          <Bar dataKey="diastolic" name="Diastolic" fill="#22d3ee" radius={[6, 6, 2, 2]} maxBarSize={16} isAnimationActive={!reducedMotion} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

function OxygenChart({ data, reducedMotion }: { data: ChartPoint[]; reducedMotion: boolean }) {
  const lowest = Math.min(...data.map((point) => point.oxygen));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 18, right: 8, left: -22, bottom: 0 }} accessibilityLayer>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisTick} dy={7} />
        <YAxis domain={[Math.max(0, Math.floor(lowest - 3)), 100]} axisLine={false} tickLine={false} tick={axisTick} width={42} />
        <Tooltip
          content={(props) => (
            <ChartTooltip
              active={props.active}
              payload={props.payload as NumericTooltipPayload}
              valueFormatter={(_, value) => `${value}%`}
            />
          )}
          cursor={{ stroke: "#a5f3fc" }}
        />
        <Line type="monotone" dataKey="oxygen" name="Oxygen" stroke="#2dbdb8" strokeWidth={2.75} dot={{ r: 3.5, fill: "#fff", stroke: "#2dbdb8", strokeWidth: 2.5 }} activeDot={{ r: 5 }} isAnimationActive={!reducedMotion} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TemperatureChart({ data, reducedMotion }: { data: ChartPoint[]; reducedMotion: boolean }) {
  const values = data.map((point) => point.temperature);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 18, right: 8, left: -22, bottom: 0 }} accessibilityLayer>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 6" vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisTick} dy={7} />
        <YAxis domain={[Math.floor((min - 0.5) * 10) / 10, Math.ceil((max + 0.5) * 10) / 10]} axisLine={false} tickLine={false} tick={axisTick} width={42} tickFormatter={(value) => Number(value).toFixed(1)} />
        <Tooltip
          content={(props) => (
            <ChartTooltip
              active={props.active}
              payload={props.payload as NumericTooltipPayload}
              valueFormatter={(_, value) => `${value}°C`}
            />
          )}
          cursor={{ stroke: "#ddd6fe" }}
        />
        <Line type="monotone" dataKey="temperature" name="Temperature" stroke="#9b7bea" strokeWidth={2.75} dot={{ r: 3.5, fill: "#fff", stroke: "#9b7bea", strokeWidth: 2.5 }} activeDot={{ r: 5 }} isAnimationActive={!reducedMotion} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SecondaryTrendCharts({ records }: { records: VitalRecord[] }) {
  const data = useChartData(records);
  const reducedMotion = Boolean(useReducedMotion());
  const cards = [
    {
      title: "Blood Pressure",
      aria: `Blood pressure trend for the last ${data.length} readings.`,
      chart: <BloodPressureChart data={data} reducedMotion={reducedMotion} />,
    },
    {
      title: "Oxygen Saturation",
      aria: `Oxygen saturation trend for the last ${data.length} readings: ${data.map((point) => point.oxygen).join(", ")} percent.`,
      chart: <OxygenChart data={data} reducedMotion={reducedMotion} />,
    },
    {
      title: "Temperature",
      aria: `Temperature trend for the last ${data.length} readings: ${data.map((point) => point.temperature).join(", ")} degrees Celsius.`,
      chart: <TemperatureChart data={data} reducedMotion={reducedMotion} />,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Vital trends">
      {cards.map((card, index) => (
        <GlassCard key={card.title} delay={index * 50} className="app-card min-w-0 p-4 sm:p-5">
          <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">{card.title}</h2>
          <div className="relative mt-2 h-[230px] w-full sm:h-[245px]" role="img" aria-label={card.aria}>
            {card.chart}
            <MoreDataMessage count={data.length} />
          </div>
        </GlassCard>
      ))}
    </section>
  );
}
