import { Activity, Droplets, HeartPulse, Thermometer } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import type { VitalRecord } from "@/lib/vitals";

export function DashboardVitalCards({ record }: { record: VitalRecord }) {
  const items = [
    {
      label: "Heart Rate",
      Icon: HeartPulse,
      value: record.heartRate,
      unit: "bpm",
      iconClass: "bg-rose-50 text-rose-500",
    },
    {
      label: "Blood Pressure",
      Icon: Droplets,
      value: `${record.systolic}/${record.diastolic}`,
      unit: "mmHg",
      iconClass: "bg-blue-50 text-blue-500",
    },
    {
      label: "Oxygen",
      Icon: Activity,
      value: record.oxygen,
      unit: "%",
      iconClass: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "Temperature",
      Icon: Thermometer,
      value: record.temperature,
      unit: "°C",
      iconClass: "bg-orange-50 text-orange-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 min-[341px]:grid-cols-2 sm:gap-4 lg:grid-cols-4" aria-label="Latest vital readings">
      {items.map(({ label, Icon, value, unit, iconClass }, index) => (
        <GlassCard key={label} delay={index * 45} className="app-card min-h-[136px] p-4 sm:min-h-[144px] sm:p-5">
          <span className={`grid size-10 place-items-center rounded-[14px] ${iconClass}`}>
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-500 sm:text-xs">{label}</p>
          <p className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-1.5">
            <span className="text-[clamp(1.65rem,6vw,2.1rem)] font-extrabold leading-none tracking-[-0.045em] tabular-nums text-slate-950">
              {value}
            </span>
            <span className="text-sm font-semibold text-slate-500">{unit}</span>
          </p>
        </GlassCard>
      ))}
    </section>
  );
}
