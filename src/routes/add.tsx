import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, ChevronDown, Clock3, HeartPulse, Lightbulb, TimerReset } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { GlassCard } from "@/components/glass/GlassCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StatusBadge } from "@/components/StatusBadge";
import { VitalForm } from "@/components/VitalForm";
import { useVitals } from "@/hooks/use-vitals";
import { formatRecordedAt } from "@/lib/vitals";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title: "Vital Tracker — CareAI" },
      { name: "description", content: "Log your latest readings for CareAI analysis." },
      { property: "og:title", content: "Vital Tracker — CareAI" },
      { property: "og:description", content: "Log your latest readings for CareAI analysis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <AddVitalPage />
    </ProtectedRoute>
  ),
});

const TIPS = [
  "Sit quietly for a few minutes before measuring.",
  "Keep your arm supported for blood pressure.",
  "Use the same device when possible.",
  "Record readings at similar times for clearer trends.",
];

function TipsList() {
  return (
    <ul className="mt-4 space-y-3">
      {TIPS.map((tip) => (
        <li key={tip} className="flex gap-2.5 text-sm leading-6 text-slate-600">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden="true" />
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  );
}

function AddVitalPage() {
  const navigate = useNavigate();
  const { latest, loading } = useVitals();

  if (loading) return <LoadingSpinner fullscreen label="Preparing the vital tracker…" />;

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Takes less than a minute"
        title="Vital Tracker"
        subtitle="Log your latest readings for CareAI analysis."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] lg:gap-6 xl:gap-8">
        <GlassCard strong className="app-card p-5 sm:p-7 lg:p-8">
          <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
              <Activity className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold tracking-[-0.03em] text-slate-950">Your readings</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Use the values shown on your measurement devices.</p>
            </div>
          </div>
          <VitalForm onSaved={() => void navigate({ to: "/dashboard", replace: true })} />
        </GlassCard>

        <aside className="space-y-5 lg:sticky lg:top-24" aria-label="Measurement guidance">
          <details className="app-card group rounded-[20px] border border-white/80 bg-white/82 p-5 shadow-[0_16px_42px_rgba(44,83,130,0.10)] backdrop-blur-lg lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200">
              <span className="inline-flex items-center gap-2">
                <Lightbulb className="size-4 text-blue-500" aria-hidden="true" /> Measurement Tips
              </span>
              <ChevronDown className="size-4 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <TipsList />
          </details>

          <GlassCard className="app-card hidden p-5 lg:block xl:p-6">
            <h2 className="inline-flex items-center gap-2 text-base font-extrabold text-slate-950">
              <Lightbulb className="size-4 text-blue-500" aria-hidden="true" /> Measurement Tips
            </h2>
            <TipsList />
          </GlassCard>

          <GlassCard className="app-card p-5 xl:p-6">
            <h2 className="inline-flex items-center gap-2 text-base font-extrabold text-slate-950">
              <TimerReset className="size-4 text-blue-500" aria-hidden="true" /> Your last reading
            </h2>
            {latest ? (
              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Clock3 className="size-3.5" aria-hidden="true" /> {formatRecordedAt(latest.recordedAt)}
                  </p>
                  <StatusBadge status={latest.analysis.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {[
                    ["Blood pressure", `${latest.systolic}/${latest.diastolic}`],
                    ["Heart rate", `${latest.heartRate} bpm`],
                    ["Oxygen", `${latest.oxygen}%`],
                    ["Temperature", `${latest.temperature}°C`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[14px] border border-blue-100/70 bg-blue-50/55 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-extrabold text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[16px] border border-dashed border-blue-200 bg-blue-50/45 p-4 text-center">
                <HeartPulse className="mx-auto size-5 text-blue-500" aria-hidden="true" />
                <p className="mt-2 text-sm leading-6 text-slate-500">Your first saved reading will appear here.</p>
              </div>
            )}
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
