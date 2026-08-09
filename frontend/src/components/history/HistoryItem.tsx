import { Link } from "@tanstack/react-router";
import { ChevronDown, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { VitalRecord } from "@/lib/vitals";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useLocalizedRecordedAt } from "@/i18n/useLocalizedDate";

export function HistoryItem({
  record,
  open,
  onOpenChange,
}: {
  record: VitalRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const formatRecordedAt = useLocalizedRecordedAt();
  return (
    <div className="relative sm:pl-8">
      <span className="absolute left-[3px] top-8 hidden size-3 rounded-full border-[3px] border-blue-100 bg-blue-500 sm:block" aria-hidden="true" />
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <GlassCard className="app-card overflow-hidden p-0">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="w-full px-4 py-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-200 sm:px-5"
              aria-label={t(open ? "history.hideDetails" : "history.showDetails", { date: formatRecordedAt(record.recordedAt) })}
            >
              <span className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <span className="min-w-0">
                  <span className="app-card-title block text-base font-extrabold text-slate-950">{formatRecordedAt(record.recordedAt)}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-2.5">
                    <StatusBadge status={record.analysis.status} />
                    <span className="text-xs font-semibold text-slate-500">
                      {record.analysis.concerns.length === 0
                        ? t("history.allTypical")
                        : t("history.attention", { count: record.analysis.concerns.length })}
                    </span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{t("history.healthScore")}</span>
                    <span className="block text-2xl font-extrabold tabular-nums text-blue-600">{record.analysis.score}</span>
                  </span>
                  <ChevronDown className={cn("size-5 text-slate-400 transition-transform", open && "rotate-180")} aria-hidden="true" />
                </span>
              </span>

              <span className="mt-4 grid grid-cols-2 gap-2 min-[430px]:grid-cols-4">
                {[
                  [t("dashboard.bloodPressure"), `${record.systolic}/${record.diastolic}`],
                  [t("dashboard.heartRate"), `${record.heartRate} bpm`],
                  [t("dashboard.oxygen"), `${record.oxygen}%`],
                  [t("dashboard.temperature"), `${record.temperature}°C`],
                ].map(([label, value]) => (
                  <span key={label} className="rounded-[13px] border border-slate-100 bg-slate-50/75 px-3 py-2.5">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.07em] text-slate-400">{label}</span>
                    <span className="mt-1 block text-sm font-extrabold text-slate-900">{value}</span>
                  </span>
                ))}
              </span>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="border-t border-slate-100 bg-blue-50/30 px-4 py-5 sm:px-5">
              <div className="flex gap-2.5">
                <Sparkles className="mt-1 size-4 shrink-0 text-blue-500" aria-hidden="true" />
                <p className="text-sm leading-6 text-slate-600">{record.analysis.summary}</p>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {[
                  [t("dashboard.whatLooksGood"), record.analysis.good],
                  [t("dashboard.areasToWatch"), record.analysis.concerns],
                  [t("dashboard.recommendations"), record.analysis.recommendations],
                ].map(([title, items]) => (
                  <section key={title as string}>
                    <h3 className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-700">{title as string}</h3>
                    <ul className="mt-2 space-y-1.5">
                      {(items as string[]).map((item) => (
                        <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <Link
                to="/history/$id"
                params={{ id: record.id }}
                className="mt-5 inline-flex min-h-11 items-center rounded-[12px] border border-blue-100 bg-white px-4 text-sm font-bold text-blue-600 shadow-sm transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
              >
                {t("history.viewFullRecord")}
              </Link>
            </div>
          </CollapsibleContent>
        </GlassCard>
      </Collapsible>
    </div>
  );
}
