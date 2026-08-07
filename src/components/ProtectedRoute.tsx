import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/profile-context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TopBar } from "@/components/TopBar";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || (user && profileLoading)) return;
    if (!user) void navigate({ to: "/login", replace: true });
    else if (!profile) void navigate({ to: "/create-profile", replace: true });
  }, [loading, user, profileLoading, profile, navigate]);

  if (loading || (user && profileLoading) || !user || !profile) {
    return <LoadingSpinner fullscreen label="Checking your session…" />;
  }

  return (
    <div className="min-h-dvh">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <DisclaimerFooter />
    </div>
  );
}
