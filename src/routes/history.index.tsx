import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useVitals } from "@/hooks/use-vitals";
import { formatRecordedAt } from "@/lib/vitals";

export const Route = createFileRoute("/history/")({
  head: () => ({
    meta: [
      { title: "Vitals History — AICare" },
      { name: "description", content: "Browse every vitals record you've logged, with status and AI summary for each entry." },
      { property: "og:title", content: "Vitals History — AICare" },
      { property: "og:description", content: "Browse every vitals record you've logged, with status and AI summary for each entry." },
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

const PAGE = 20;

function HistoryPage() {
  const { records, loading } = useVitals();
  const [visible, setVisible] = useState(PAGE);

  if (loading) return <LoadingSpinner fullscreen label="Loading your records…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight">History</h1>
      <p className="mt-2 text-sm text-muted-foreground">Every reading you've logged, newest first.</p>

      {records.length === 0 ? (
        <GlassCard delay={80} className="mt-6 p-10 text-center">
          <p className="text-sm text-muted-foreground">No records yet.</p>
          <Link to="/add" className="mt-5 inline-block">
            <GlassButton>Log your first vitals</GlassButton>
          </Link>
        </GlassCard>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {records.slice(0, visible).map((r, i) => (
              <Link key={r.id} to="/history/$id" params={{ id: r.id }} className="block">
                <GlassCard interactive delay={i * 50} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-sm font-bold">
                      <CalendarDays className="size-4 text-primary" />
                      {formatRecordedAt(r.recordedAt)}
                    </span>
                    <StatusBadge status={r.analysis.status} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {r.analysis.summary}
                  </p>
                </GlassCard>
              </Link>
            ))}
          </div>

          {visible < records.length && (
            <div className="mt-6 text-center">
              <GlassButton variant="glass" onClick={() => setVisible((v) => v + PAGE)}>
                Load More
              </GlassButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
