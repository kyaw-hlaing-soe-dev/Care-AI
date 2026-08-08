import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CalendarDays, ChartNoAxesColumnIncreasing, Clock3, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/glass/GlassCard";
import { glassButtonVariants } from "@/components/glass/GlassButton";
import { HistoryItem } from "@/components/history/HistoryItem";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useVitals } from "@/hooks/use-vitals";
import { useLocalizedRecordedAt } from "@/i18n/useLocalizedDate";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/history/")({
  head: () => ({
    meta: [
      { title: "Health History — CareAI" },
      { name: "description", content: "Review your readings and CareAI insights over time." },
      { property: "og:title", content: "Health History — CareAI" },
      { property: "og:description", content: "Review your readings and CareAI insights over time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  ),
});

type DateFilter = "all" | "7" | "30";
const PAGE_SIZE = 20;

function HistoryPage() {
  const { records, loading } = useVitals();
  const [filter, setFilter] = useState<DateFilter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openId, setOpenId] = useState<string | null>(null);
  const { t } = useTranslation();
  const formatRecordedAt = useLocalizedRecordedAt();

  useEffect(() => setVisible(PAGE_SIZE), [filter]);

  const filteredRecords = useMemo(() => {
    if (filter === "all") return records;
    const cutoff = Date.now() - Number(filter) * 24 * 60 * 60 * 1000;
    return records.filter((record) => new Date(record.recordedAt).getTime() >= cutoff);
  }, [filter, records]);

  if (loading) return <LoadingSpinner fullscreen label={t("history.loading")} />;

  const averageScore = records.length
    ? Math.round(records.reduce((total, record) => total + record.analysis.score, 0) / records.length)
    : 0;
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const thisWeek = records.filter((record) => new Date(record.recordedAt) >= startOfWeek).length;

  return (
    <div className="mx-auto max-w-[1120px] space-y-7 lg:space-y-8">
      <PageHeader title={t("history.title")} subtitle={t("history.subtitle")} />

      {records.length === 0 ? (
        <GlassCard strong className="app-card px-5 py-12 text-center sm:px-8 sm:py-16">
          <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_16px_34px_rgba(37,99,235,0.20)]">
            <CalendarDays className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">{t("history.noHistory")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {t("history.noHistoryBody")}
          </p>
          <Link to="/add" className={glassButtonVariants({ size: "lg", className: "mt-6" })}>
            {t("dashboard.logVitals")}
          </Link>
        </GlassCard>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label={t("history.summaryAria")}>
            {[
              { label: t("history.totalLogs"), value: records.length.toString(), Icon: ListChecks },
              { label: t("history.averageScore"), value: averageScore.toString(), Icon: ChartNoAxesColumnIncreasing },
              { label: t("history.latestReading"), value: records[0] ? formatRecordedAt(records[0].recordedAt) : "—", Icon: Clock3 },
              { label: t("history.thisWeek"), value: thisWeek.toString(), Icon: Activity },
            ].map(({ label, value, Icon }, index) => (
              <GlassCard key={label} delay={index * 45} className="app-card min-w-0 p-4 sm:p-5">
                <span className="grid size-9 place-items-center rounded-[12px] bg-blue-50 text-blue-500">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                <p className={cn("mt-1 font-extrabold tracking-[-0.025em] text-slate-950", label === t("history.latestReading") ? "text-sm leading-5" : "text-2xl")}>
                  {value}
                </p>
              </GlassCard>
            ))}
          </section>

          <section aria-labelledby="timeline-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="timeline-heading" className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-[22px]">{t("history.timeline")}</h2>
                <p className="mt-1 text-sm text-slate-500">{t("history.newestFirst")}</p>
              </div>
              <div className="inline-flex w-full rounded-[15px] border border-slate-200 bg-white/75 p-1 sm:w-auto" role="group" aria-label={t("history.filterAria")}>
                {([
                  ["all", t("history.all")],
                  ["7", t("history.sevenDays")],
                  ["30", t("history.thirtyDays")],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={filter === value}
                    onClick={() => setFilter(value)}
                    className={cn(
                      "min-h-10 flex-1 rounded-[11px] px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 sm:flex-none",
                      filter === value ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <GlassCard className="app-card mt-5 p-8 text-center">
                <p className="text-sm text-slate-500">{t("history.emptyPeriod")}</p>
              </GlassCard>
            ) : (
              <div className="relative mt-5 space-y-4 sm:before:absolute sm:before:bottom-8 sm:before:left-2 sm:before:top-8 sm:before:w-px sm:before:bg-blue-100">
                {filteredRecords.slice(0, visible).map((record) => (
                  <HistoryItem
                    key={record.id}
                    record={record}
                    open={openId === record.id}
                    onOpenChange={(open) => setOpenId(open ? record.id : null)}
                  />
                ))}
              </div>
            )}

            {visible < filteredRecords.length ? (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((current) => current + PAGE_SIZE)}
                  className={glassButtonVariants({ variant: "glass", size: "md" })}
                >
                  {t("history.loadMore")}
                </button>
              </div>
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}
