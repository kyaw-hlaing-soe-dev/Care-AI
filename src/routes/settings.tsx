import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings — CareAI" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
});

function SettingsPage() {
  return <Navigate to="/profile" search={{ view: "preferences" }} replace />;
}
