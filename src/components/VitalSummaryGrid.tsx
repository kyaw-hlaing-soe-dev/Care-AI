import { Activity, Droplets, HeartPulse, Minus, Thermometer, TrendingDown, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { NoDataBadge, StatusBadge } from "@/components/StatusBadge";
import { isInRange, type VitalRecord } from "@/lib/vitals";

type Item = {
  label: string;
  Icon: typeof HeartPulse;
  value: string;
  unit: string;
  normal: boolean;
  current?: number | undefined;
  previous?: number | undefined;
  trendLabel?: string | undefined;
};

function Trend({ item }: { item: Item }) {
  if (item.current === undefined || item.previous === undefined) return null;
  const difference = Number((item.current - item.previous).toFixed(1));
  const Icon = difference > 0 ? TrendingUp : difference < 0 ? TrendingDown : Minus;
  return (
    <p className="mt-3 flex min-h-5 items-center gap-1.5 text-[11px] font-semibold leading-4 text-slate-500 sm:text-xs">
      <Icon className="size-3.5 shrink-0 text-blue-500" aria-hidden="true" />
      {difference === 0
        ? "No change from prior"
        : `${item.trendLabel ?? ""}${difference > 0 ? "+" : ""}${difference} from prior`}
    </p>
  );
}

export function VitalSummaryGrid({
  record,
  previousRecord,
}: {
  record?: VitalRecord;
  previousRecord?: VitalRecord | undefined;
}) {
  const items: Item[] = [
    {
      label: "Blood Pressure",
      Icon: Droplets,
      value: record ? `${record.systolic}/${record.diastolic}` : "--",
      unit: "mmHg",
      normal: record ? isInRange("systolic", record.systolic) && isInRange("diastolic", record.diastolic) : false,
      current: record?.systolic,
      previous: previousRecord?.systolic,
      trendLabel: "Systolic ",
    },
    {
      label: "Heart Rate",
      Icon: HeartPulse,
      value: record ? `${record.heartRate}` : "--",
      unit: "bpm",
      normal: record ? isInRange("heartRate", record.heartRate) : false,
      current: record?.heartRate,
      previous: previousRecord?.heartRate,
    },
    {
      label: "Oxygen",
      Icon: Activity,
      value: record ? `${record.oxygen}` : "--",
      unit: "%",
      normal: record ? isInRange("oxygen", record.oxygen) : false,
      current: record?.oxygen,
      previous: previousRecord?.oxygen,
    },
    {
      label: "Temperature",
      Icon: Thermometer,
      value: record ? `${record.temperature}` : "--",
      unit: "°C",
      normal: record ? isInRange("temperature", record.temperature) : false,
      current: record?.temperature,
      previous: previousRecord?.temperature,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 min-[375px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {items.map((item, index) => (
        <GlassCard key={item.label} interactive delay={60 + index * 45} className="app-card min-w-0 p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-slate-600 sm:text-sm">
            <span className="grid size-8 shrink-0 place-items-center rounded-[11px] bg-blue-50 text-blue-500">
              <item.Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 leading-tight">{item.label}</span>
          </div>
          <p className="mt-4 flex min-w-0 flex-wrap items-baseline gap-x-1.5">
            <span className="text-[clamp(1.45rem,5vw,2rem)] font-extrabold tracking-[-0.04em] tabular-nums text-slate-950">
              {item.value}
            </span>
            <span className="text-xs font-semibold text-slate-500 sm:text-sm">{item.unit}</span>
          </p>
          <div className="mt-3">
            {record ? <StatusBadge status={item.normal ? "Good" : "Attention Needed"} /> : <NoDataBadge />}
          </div>
          <Trend item={item} />
        </GlassCard>
      ))}
    </div>
  );
}
