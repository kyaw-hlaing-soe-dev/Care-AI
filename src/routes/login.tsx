import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginPanel, LoginVisual } from "@/components/auth/LoginExperience";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AICare" },
      {
        name: "description",
        content: "Sign in to AICare to log vitals and view your AI health analysis.",
      },
      { property: "og:title", content: "Sign in — AICare" },
      {
        property: "og:description",
        content: "Sign in to AICare to log vitals and view your AI health analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

export function LoginPage() {
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
    <main className="auth-page grid min-h-dvh overflow-x-clip lg:grid-cols-[minmax(0,1.18fr)_minmax(420px,.82fr)]">
      <LoginVisual />
      <LoginPanel onSignIn={() => void handleSignIn()} pending={pending} error={error} />
    </main>
  );
}
