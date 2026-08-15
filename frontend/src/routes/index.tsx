import { createFileRoute } from "@tanstack/react-router";
import { AmbientBackground } from "@/components/landing/AmbientBackground";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { HealthTrends } from "@/components/landing/HealthTrends";
import { AiAnalysis } from "@/components/landing/AiAnalysis";
import { TrustSection } from "@/components/landing/TrustSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

const DESC =
  "CareAI helps you privately track vital signs, understand health trends, and review deterministic informational insights.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareAI — Understand Your Health, One Reading at a Time" },
      { name: "description", content: DESC },
      { property: "og:title", content: "CareAI — Understand Your Health, One Reading at a Time" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="landing-page min-h-dvh overflow-x-clip">
      <AmbientBackground />
      <LandingNav />
      <main>
        <Hero />
        <DashboardPreview />
        <Features />
        <HowItWorks />
        <AiAnalysis />
        <HealthTrends />
        <TrustSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
