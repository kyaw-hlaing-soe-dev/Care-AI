import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { VitalSummaryGrid } from "@/components/VitalSummaryGrid";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useVital } from "@/hooks/use-vitals";
import { useTranslation } from "react-i18next";
import { useLocalizedRecordedAt } from "@/i18n/useLocalizedDate";

export const Route = createFileRoute("/history/$id")({
  head: () => ({
    meta: [
      { title: "Record Detail — CareAI" },
      {
        name: "description",
        content: "A deterministic range-based insight for one saved vitals record.",
      },
      { property: "og:title", content: "Record Detail — CareAI" },
      {
        property: "og:description",
        content: "A deterministic range-based insight for one saved vitals record.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <VitalDetailPage />
    </ProtectedRoute>
  ),
});

function VitalDetailPage() {
  const { id } = useParams({ from: "/history/$id" });
  const { data: record, isLoading: loading } = useVital(id);
  const { t } = useTranslation();
  const formatRecordedAt = useLocalizedRecordedAt();

  if (loading) return <LoadingSpinner fullscreen label={t("history.recordLoading")} />;

  if (!record) {
    return (
      <GlassCard className="app-card mx-auto max-w-lg p-10 text-center">
        <p className="text-sm text-muted-foreground">{t("errors.recordNotFound")}</p>
        <Link to="/history" className="mt-5 inline-block">
          <GlassButton variant="glass">{t("history.back")}</GlassButton>
        </Link>
      </GlassCard>
    );
  }

  const { analysis } = record;

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      {analysis.emergency && <EmergencyBanner />}

      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("history.back")}
      </Link>

      <GlassCard className="app-card flex flex-wrap items-center gap-5 p-5 sm:p-6">
        <HealthScoreRing score={analysis.score} hasData />
        <div className="min-w-0 flex-1">
          <h1 className="app-page-title text-2xl font-extrabold tracking-tight">
            {formatRecordedAt(record.recordedAt)}
          </h1>
          <div className="mt-2">
            <StatusBadge status={analysis.status} />
          </div>
        </div>
      </GlassCard>

      <VitalSummaryGrid record={record} />

      <AIInsightPanel analysis={analysis} />
    </div>
  );
}
