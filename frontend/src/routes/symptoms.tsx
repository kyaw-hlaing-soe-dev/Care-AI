import { createFileRoute } from "@tanstack/react-router";
import SeniorSymptomChecker from "@/components/SeniorSymptomChecker.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/symptoms")({
  head: () => ({
    meta: [
      { title: "Symptom Check — CareAI" },
      {
        name: "description",
        content: "A clear, accessible symptom questionnaire with informational next steps.",
      },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <SeniorSymptomChecker />
    </ProtectedRoute>
  ),
});
