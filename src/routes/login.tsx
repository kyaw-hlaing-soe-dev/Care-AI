import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AICare" },
      { name: "description", content: "Sign in to AICare to log vitals and view your AI health analysis." },
      { property: "og:title", content: "Sign in — AICare" },
      { property: "og:description", content: "Sign in to AICare to log vitals and view your AI health analysis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) void navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  async function handleSignIn() {
    setPending(true);
    setError(null);
    try {
      await signInWithGoogle();
      void navigate({ to: "/dashboard", replace: true });
    } catch {
      setError("We couldn't sign you in. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <GlassCard strong className="w-full max-w-md rounded-3xl p-9 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary-light text-primary">
          <Activity className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">AICare</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your vitals, analyzed and explained in seconds.
        </p>

        <GlassButton
          size="lg"
          className="mt-8 w-full"
          loading={pending}
          onClick={() => void handleSignIn()}
        >
          {pending ? "Signing you in…" : "Sign in with Google"}
        </GlassButton>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-urgent">
            {error}
          </p>
        )}

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          By continuing you agree that AICare provides informational insights only and is not a
          substitute for professional medical advice.
        </p>
      </GlassCard>
    </div>
  );
}
