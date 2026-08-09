import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { StatusBadge } from "@/components/StatusBadge";
import type { VitalRecord } from "@/lib/vitals";
import { useTranslation } from "react-i18next";
import { useLocalizedRecordedAt } from "@/i18n/useLocalizedDate";

export function RecentLogs({ records }: { records: VitalRecord[] }) {
  const { t } = useTranslation();
  const formatRecordedAt = useLocalizedRecordedAt();
  return (
    <section aria-labelledby="recent-logs-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="recent-logs-heading" className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-[22px]">
          {t("dashboard.recentLogs")}
        </h2>
        <Link
          to="/history"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-bold text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
        >
          {t("dashboard.viewHistory")} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <GlassCard className="app-card divide-y divide-slate-100 overflow-hidden p-0">
        {records.slice(0, 5).map((record) => (
          <Link
            key={record.id}
            to="/history/$id"
            params={{ id: record.id }}
            className="group grid min-h-[92px] gap-3 px-4 py-4 transition-colors hover:bg-blue-50/45 focus-visible:bg-blue-50/60 focus-visible:outline-none sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
          >
            <span className="flex min-w-0 items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CalendarDays className="size-4 shrink-0 text-blue-500" aria-hidden="true" />
                  {formatRecordedAt(record.recordedAt)}
                </span>
                <span className="mt-2 grid grid-cols-2 gap-2 min-[390px]:grid-cols-4 sm:hidden">
                  {[
                    [t("dashboard.bloodPressure"), `${record.systolic}/${record.diastolic}`],
                    [t("dashboard.heartRate"), `${record.heartRate}`],
                    [t("dashboard.oxygen"), `${record.oxygen}%`],
                    [t("dashboard.temperature"), `${record.temperature}°`],
                  ].map(([label, value]) => (
                    <span key={label} className="min-w-0 rounded-[11px] bg-slate-50/85 px-2 py-1.5">
                      <span className="block break-words text-[9px] font-bold uppercase leading-tight tracking-[0.04em] text-slate-400">
                        {label}
                      </span>
                      <span className="mt-0.5 block break-words text-xs font-extrabold leading-tight text-slate-900">
                        {value}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1.5 hidden text-xs leading-5 text-slate-500 sm:block sm:text-[13px]">
                  {record.systolic}/{record.diastolic} mmHg <span aria-hidden="true">•</span> {record.heartRate} bpm <span aria-hidden="true">•</span> {record.oxygen}% <span aria-hidden="true">•</span> {record.temperature}°C
                </span>
              </span>
              <ChevronRight
                className="mt-0.5 size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500 sm:hidden"
                aria-hidden="true"
              />
            </span>
            <span className="flex items-center justify-between gap-3 sm:justify-end">
              <StatusBadge status={record.analysis.status} />
              <span className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{t("common.score")}</span>
                <span className="block text-xl font-extrabold tabular-nums text-blue-600">{record.analysis.score}</span>
              </span>
            </span>
          </Link>
        ))}
      </GlassCard>
    </section>
  );
}
