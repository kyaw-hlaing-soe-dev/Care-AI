import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Plus, RefreshCw } from "lucide-react";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { HeartRateTrendCard, SecondaryTrendCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardVitalCards } from "@/components/dashboard/DashboardVitalCards";
import { HealthOverviewCard } from "@/components/dashboard/HealthOverviewCard";
import { RecentLogs } from "@/components/dashboard/RecentLogs";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { GlassCard } from "@/components/glass/GlassCard";
import { glassButtonVariants } from "@/components/glass/GlassButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1280px] animate-pulse space-y-6" aria-label="Loading your health overview" role="status">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-blue-100/80" />
          <div className="h-4 w-48 rounded-lg bg-slate-200/70" />
        </div>
        <div className="hidden h-12 w-32 rounded-[15px] bg-blue-100 sm:block" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-[22px] bg-white/80 shadow-sm" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[310px_1fr]">
        <div className="h-[320px] rounded-[24px] bg-white/80 shadow-sm" />
        <div className="h-[320px] rounded-[24px] bg-white/80 shadow-sm" />
      </div>
      <span className="sr-only">Loading dashboard cards and charts.</span>
    </div>
  );
}

function Dashboard() {
  const { records, loading, latest, error, refresh } = useVitals();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  if (loading) return <DashboardSkeleton />;

  const displayName = profile?.displayName || user?.name || "there";

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 lg:space-y-7">
      {latest?.analysis.emergency ? <EmergencyBanner /> : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(1.75rem,4vw,2.15rem)] font-extrabold leading-tight tracking-[-0.045em] text-slate-950">
            {greeting}, {displayName} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-slate-500 sm:text-[15px]">Here&apos;s your health overview.</p>
        </div>
        <Link to="/add" className={glassButtonVariants({ size: "md", className: "w-full sm:w-auto" })}>
          <Plus className="size-4" aria-hidden="true" />
          Log Vitals
        </Link>
      </header>

      {error ? (
        <GlassCard strong className="app-card px-5 py-12 text-center sm:px-8">
          <h2 className="text-xl font-extrabold text-slate-950">We couldn&apos;t load your health overview.</h2>
          <p className="mt-2 text-sm text-slate-500">Please try loading your saved readings again.</p>
          <button type="button" onClick={refresh} className={glassButtonVariants({ variant: "glass", size: "md", className: "mt-5" })}>
            <RefreshCw className="size-4" aria-hidden="true" /> Try Again
          </button>
        </GlassCard>
      ) : !latest ? (
        <GlassCard strong className="app-card px-5 py-12 text-center sm:px-8 sm:py-16">
          <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_16px_34px_rgba(37,99,235,0.20)]">
            <Activity className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">No readings yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Log your first vitals to start seeing trends and receive a CareAI insight.
          </p>
          <Link to="/add" className={glassButtonVariants({ size: "lg", className: "mt-6" })}>
            Log Vitals
          </Link>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-5 sm:gap-6 lg:gap-7">
          <div className="order-2 md:order-1">
            <DashboardVitalCards record={latest} />
          </div>

          <section className="order-1 grid min-w-0 gap-4 md:order-2 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]" aria-label="Health score and heart rate trend">
            <HealthOverviewCard record={latest} />
            <HeartRateTrendCard records={records} />
          </section>

          <div className="order-3">
            <SecondaryTrendCharts records={records} />
          </div>

          <div className="order-4">
            <AIInsightPanel analysis={latest.analysis} />
          </div>

          <div className="order-5">
            <RecentLogs records={records} />
          </div>
        </div>
      )}
    </div>
  );
}
