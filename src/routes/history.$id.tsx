import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { VitalSummaryGrid } from "@/components/VitalSummaryGrid";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { GoodList, ConcernsList, RecommendationsList } from "@/components/AnalysisLists";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getVital } from "@/lib/vitals-store";
import { formatRecordedAt, type VitalRecord } from "@/lib/vitals";

export const Route = createFileRoute("/history/$id")({
  head: () => ({
    meta: [
      { title: "Record Detail — AICare" },
      { name: "description", content: "Full AI analysis for a single vitals record, including concerns and recommendations." },
      { property: "og:title", content: "Record Detail — AICare" },
      { property: "og:description", content: "Full AI analysis for a single vitals record, including concerns and recommendations." },
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
  const [record, setRecord] = useState<VitalRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRecord(getVital(id) ?? null);
    setLoading(false);
  }, [id]);

  if (loading) return <LoadingSpinner fullscreen label="Loading this record…" />;

  if (!record) {
    return (
      <GlassCard className="mx-auto max-w-lg p-10 text-center">
        <p className="text-sm text-muted-foreground">We couldn't find that record.</p>
        <Link to="/history" className="mt-5 inline-block">
          <GlassButton variant="glass">Back to history</GlassButton>
        </Link>
      </GlassCard>
    );
  }

  const { analysis } = record;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {analysis.emergency && <EmergencyBanner />}

      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to history
      </Link>

      <GlassCard className="flex flex-wrap items-center gap-5 p-6">
        <HealthScoreRing score={analysis.score} hasData />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {formatRecordedAt(record.recordedAt)}
          </h1>
          <div className="mt-2">
            <StatusBadge status={analysis.status} />
          </div>
        </div>
      </GlassCard>

      <VitalSummaryGrid record={record} />

      <GlassCard
        delay={300}
        className="border-primary/25 bg-primary-light/55 p-6 dark:bg-primary-light/25"
      >
        <h2 className="inline-flex items-center gap-2.5 text-sm font-bold">
          <span className="grid size-8 place-items-center rounded-full bg-white/70 text-primary dark:bg-white/15">
            <Sparkles className="size-4" />
          </span>
          AI Health Insight
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">{analysis.summary}</p>
      </GlassCard>

      <div className="grid gap-5 md:grid-cols-2">
        <GoodList items={analysis.good} delay={360} />
        <ConcernsList items={analysis.concerns} delay={410} />
        <RecommendationsList items={analysis.recommendations} delay={460} />
      </div>
    </div>
  );
}
