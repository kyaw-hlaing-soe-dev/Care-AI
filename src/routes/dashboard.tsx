import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { HealthScoreRing } from "@/components/HealthScoreRing";
import { StatusBadge, NoDataBadge } from "@/components/StatusBadge";
import { VitalSummaryGrid } from "@/components/VitalSummaryGrid";
import { VitalForm } from "@/components/VitalForm";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { GoodList, ConcernsList, RecommendationsList } from "@/components/AnalysisLists";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useVitals } from "@/hooks/use-vitals";
import { formatRecordedAt } from "@/lib/vitals";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Latest Health Check — AICare" },
      { name: "description", content: "Review your most recent vitals analysis, health score and AI recommendations." },
      { property: "og:title", content: "Your Latest Health Check — AICare" },
      { property: "og:description", content: "Review your most recent vitals analysis, health score and AI recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

function Dashboard() {
  const { records, loading, latest } = useVitals();
  const analysis = latest?.analysis;

  if (loading) return <LoadingSpinner fullscreen label="Loading your latest check…" />;

  return (
    <>
      {analysis?.emergency && <EmergencyBanner />}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <GlassCard className="flex flex-wrap items-center gap-5 p-6">
            <HealthScoreRing score={analysis?.score ?? 0} hasData={Boolean(analysis)} />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight">Health Score</h1>
              <div className="mt-2">
                {analysis ? <StatusBadge status={analysis.status} /> : <NoDataBadge />}
              </div>
            </div>
            <p className="w-full text-right text-sm text-muted-foreground sm:w-auto">
              {latest ? `Updated: ${formatRecordedAt(latest.recordedAt)}` : "No readings yet"}
            </p>
          </GlassCard>

          <VitalSummaryGrid {...(latest ? { record: latest } : {})} />

          <GlassCard
            delay={320}
            className="border-primary/25 bg-primary-light/55 p-6 dark:bg-primary-light/25"
          >
            <h2 className="inline-flex items-center gap-2.5 text-sm font-bold">
              <span className="grid size-8 place-items-center rounded-full bg-white/70 text-primary dark:bg-white/15">
                <Sparkles className="size-4" />
              </span>
              AI Health Insight
            </h2>
            <p className="mt-3 min-h-12 text-sm leading-relaxed text-foreground/85">
              {analysis?.summary ??
                "Log your first set of readings and your personalised insight will appear here."}
            </p>
          </GlassCard>

          {analysis && (
            <div className="grid gap-5 md:grid-cols-2">
              <GoodList items={analysis.good} delay={380} />
              <ConcernsList items={analysis.concerns} delay={430} />
              <RecommendationsList items={analysis.recommendations} delay={480} />
            </div>
          )}

          <GlassCard delay={420} className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold tracking-tight">Recent Logs</h2>
              <Link to="/history" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {records.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No records yet. Start by logging your vitals.
                </p>
              )}
              {records.slice(0, 5).map((r, i) => (
                <Link
                  key={r.id}
                  to="/history/$id"
                  params={{ id: r.id }}
                  className="animate-rise flex items-center justify-between gap-4 rounded-xl bg-primary-light/60 px-5 py-4 transition-transform duration-500 spring hover:-translate-y-0.5 dark:bg-primary-light/25"
                  style={{ animationDelay: `${460 + i * 50}ms` }}
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold">
                      {formatRecordedAt(r.recordedAt)}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {r.heartRate} bpm, {r.systolic}/{r.diastolic} mmHg, Oxygen {r.oxygen}%,
                      Temperature {r.temperature}°C
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-xs font-semibold text-muted-foreground">Score</span>
                    <span className="block text-2xl font-extrabold text-primary tabular-nums">
                      {r.analysis.score}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard strong delay={120} className="h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-extrabold tracking-tight">Enter Your Readings</h2>
          <div className="mt-5">
            <VitalForm />
          </div>
        </GlassCard>
      </div>

      <Link to="/add" className="fixed bottom-6 right-6 z-40 lg:hidden">
        <GlassButton size="lg" className="shadow-2xl">
          <Plus className="size-5" />
          Add New Record
        </GlassButton>
      </Link>
    </>
  );
}
