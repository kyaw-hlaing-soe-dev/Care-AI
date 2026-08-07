import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Plus } from "lucide-react";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { HealthOverviewCard } from "@/components/dashboard/HealthOverviewCard";
import { RecentLogs } from "@/components/dashboard/RecentLogs";
import { TrendPreview } from "@/components/dashboard/TrendPreview";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { GlassCard } from "@/components/glass/GlassCard";
import { glassButtonVariants } from "@/components/glass/GlassButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VitalSummaryGrid } from "@/components/VitalSummaryGrid";
import { useVitals } from "@/hooks/use-vitals";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Health Overview — CareAI" },
      { name: "description", content: "Review your latest vitals, health score, trends, and CareAI recommendations." },
      { property: "og:title", content: "Your Health Overview — CareAI" },
      { property: "og:description", content: "Review your latest vitals, health score, trends, and CareAI recommendations." },
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
  const { user } = useAuth();
  const { profile } = useProfile();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  if (loading) return <LoadingSpinner fullscreen label="Loading your latest check…" />;

  const displayName = profile?.displayName || user?.name || "there";

  return (
    <div className="space-y-8 lg:space-y-9">
      {latest?.analysis.emergency ? <EmergencyBanner /> : null}

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(1.85rem,4vw,2.25rem)] font-extrabold leading-tight tracking-[-0.045em] text-slate-950">
            {greeting}, {displayName} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[15px]">Here&apos;s your latest health overview.</p>
        </div>
        <Link to="/add" className={glassButtonVariants({ size: "md", className: "w-full sm:w-auto" })}>
          <Plus className="size-4" aria-hidden="true" />
          Log Vitals
        </Link>
      </header>

      {!latest ? (
        <GlassCard strong className="app-card px-5 py-12 text-center sm:px-8 sm:py-16">
          <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_16px_34px_rgba(37,99,235,0.20)]">
            <Activity className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">No health readings yet.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Log your first vitals to start building your health history and receive a CareAI insight.
          </p>
          <Link to="/add" className={glassButtonVariants({ size: "lg", className: "mt-6" })}>
            Log My First Vitals
          </Link>
        </GlassCard>
      ) : (
        <>
          <section aria-label="Health score overview">
            <HealthOverviewCard record={latest} />
          </section>

          <section aria-label="Latest vital metrics">
            <VitalSummaryGrid record={latest} previousRecord={records[1]} />
          </section>

          <AIInsightPanel analysis={latest.analysis} />

          <TrendPreview records={records} />

          <RecentLogs records={records} />
        </>
      )}
    </div>
  );
}
