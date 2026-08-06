import { Droplets, Heart, Thermometer, Wind } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { StatusBadge, NoDataBadge } from "@/components/StatusBadge";
import { isInRange, type VitalRecord } from "@/lib/vitals";

type Item = {
  label: string;
  Icon: typeof Heart;
  value: string;
  unit: string;
  normal: boolean;
};

export function VitalSummaryGrid({ record }: { record?: VitalRecord }) {
  const items: Item[] = [
    {
      label: "Blood Pressure",
      Icon: Droplets,
      value: record ? `${record.systolic}/${record.diastolic}` : "--",
      unit: "mmHg",
      normal: record ? isInRange("systolic", record.systolic) && isInRange("diastolic", record.diastolic) : false,
    },
    {
      label: "Heart Rate",
      Icon: Heart,
      value: record ? `${record.heartRate}` : "--",
      unit: "bpm",
      normal: record ? isInRange("heartRate", record.heartRate) : false,
    },
    {
      label: "Oxygen Level",
      Icon: Wind,
      value: record ? `${record.oxygen}` : "--",
      unit: "%",
      normal: record ? isInRange("oxygen", record.oxygen) : false,
    },
    {
      label: "Temperature",
      Icon: Thermometer,
      value: record ? `${record.temperature}` : "--",
      unit: "°C",
      normal: record ? isInRange("temperature", record.temperature) : false,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, i) => (
        <GlassCard key={item.label} interactive delay={80 + i * 60} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
              <item.Icon className="size-4 text-primary" />
              {item.label}
            </span>
            {record ? (
              <StatusBadge status={item.normal ? "Good" : "Attention Needed"} />
            ) : (
              <NoDataBadge />
            )}
          </div>
          <p className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight tabular-nums">{item.value}</span>
            <span className="text-sm font-medium text-muted-foreground">{item.unit}</span>
          </p>
        </GlassCard>
      ))}
    </div>
  );
}
