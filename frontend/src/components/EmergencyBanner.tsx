import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function EmergencyBanner() {
  const { t } = useTranslation();
  return (
    <div
      role="alert"
      className="animate-banner-drop fixed inset-x-0 top-0 z-[1000] border-b border-white/25 bg-urgent/95 px-4 py-3 text-center backdrop-blur-xl"
    >
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-white">
        <AlertTriangle className="size-4 shrink-0" />
        {t("medical.urgent")}
      </p>
    </div>
  );
}
