import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ClipboardList, Lock, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AICare — Know Your Health, Instantly" },
      {
        name: "description",
        content:
          "Log your vital signs and get AI-powered health insights in seconds. Blood pressure, heart rate, oxygen and temperature tracking.",
      },
      { property: "og:title", content: "AICare — Know Your Health, Instantly" },
      {
        property: "og:description",
        content: "Log your vital signs and get AI-powered health insights in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    Icon: Lock,
    title: "Secure Sign-In",
    body: "One-click Google authentication. Your readings stay tied to your account only.",
  },
  {
    Icon: ClipboardList,
    title: "Log Vitals",
    body: "Temperature, blood pressure, heart rate and oxygen — captured in under a minute.",
  },
  {
    Icon: Sparkles,
    title: "AI Analysis",
    body: "Every entry is reviewed instantly and turned into plain-language guidance.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <span className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-primary-light text-primary">
            <Activity className="size-4.5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">AICare</span>
        </span>
        <Link to="/login">
          <GlassButton variant="glass" size="sm">
            Sign In
          </GlassButton>
        </Link>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-16 pt-14 text-center sm:pt-24">
        <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/45 px-4 py-1.5 text-xs font-semibold text-primary-dark backdrop-blur-xl dark:border-white/15 dark:bg-white/8">
          <Sparkles className="size-3.5" />
          AI-powered vitals analysis
        </span>
        <h1
          className="animate-rise mt-6 text-5xl font-extrabold tracking-tight text-balance sm:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          Know Your Health, Instantly
        </h1>
        <p
          className="animate-rise mt-5 max-w-xl text-lg text-muted-foreground text-pretty"
          style={{ animationDelay: "160ms" }}
        >
          Log your vital signs and get AI-powered health insights in seconds.
        </p>
        <div className="animate-rise mt-9" style={{ animationDelay: "240ms" }}>
          <Link to="/login">
            <GlassButton size="lg">Get Started Free</GlassButton>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-20 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <GlassCard key={f.title} interactive delay={300 + i * 90} className="p-7">
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-light text-primary">
              <f.Icon className="size-5" />
            </span>
            <h2 className="mt-5 text-base font-bold">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </GlassCard>
        ))}
      </section>

      <footer className="mx-auto max-w-2xl px-5 pb-12 text-center text-xs leading-relaxed text-muted-foreground">
        AICare provides informational insights only and is not a substitute for professional
        medical advice, diagnosis, or treatment.
      </footer>
    </div>
  );
}
