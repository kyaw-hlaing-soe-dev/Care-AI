import { CheckCircle2, AlertTriangle, CircleAlert, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VitalStatus } from "@/lib/vitals";
import { GlassBadge, type GlassBadgeTone } from "@/components/glass/GlassBadge";
import { useTranslation } from "react-i18next";

const MAP: Record<VitalStatus, { tone: GlassBadgeTone; Icon: typeof Circle }> = {
  Good: { tone: "good", Icon: CheckCircle2 },
  "Attention Needed": { tone: "attention", Icon: AlertTriangle },
  Urgent: { tone: "error", Icon: CircleAlert },
  Pending: { tone: "neutral", Icon: Circle },
};

export function StatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: VitalStatus;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { t } = useTranslation();
  const { tone, Icon } = MAP[status];
  const label = {
    Good: t("status.good"),
    "Attention Needed": t("status.needsAttention"),
    Urgent: t("status.urgent"),
    Pending: t("status.pending"),
  }[status];
  return (
    <GlassBadge
      tone={tone}
      icon={<Icon className={size === "lg" ? "size-5" : "size-3.5"} aria-hidden="true" />}
      className={cn(
        "animate-badge-pop",
        size === "lg" ? "px-5 py-2.5 text-base" : "px-3 py-1 text-xs",
        className,
      )}
    >
      {label}
    </GlassBadge>
  );
}

export function NoDataBadge() {
  const { t } = useTranslation();
  return (
    <GlassBadge tone="neutral">
      {t("status.noData")}
    </GlassBadge>
  );
}
