import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GlassCard } from "@/components/glass/GlassCard";
import { VitalForm } from "@/components/VitalForm";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title: "Log New Vitals — AICare" },
      { name: "description", content: "Enter temperature, blood pressure, heart rate and oxygen saturation for instant AI analysis." },
      { property: "og:title", content: "Log New Vitals — AICare" },
      { property: "og:description", content: "Enter temperature, blood pressure, heart rate and oxygen saturation for instant AI analysis." },
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

function AddVitalPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold tracking-tight">Enter Your Readings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Take each measurement while seated and calm for the most accurate analysis.
      </p>

      <GlassCard strong delay={80} className="mt-6 p-6 sm:p-8">
        <VitalForm
          submitLabel="Analyze My Vitals"
          onSaved={() => void navigate({ to: "/dashboard" })}
        />
      </GlassCard>
    </div>
  );
}
