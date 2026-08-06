import { CheckCircle2, AlertTriangle, CircleAlert, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VitalStatus } from "@/lib/vitals";

const MAP: Record<VitalStatus, { cls: string; Icon: typeof Circle }> = {
  Good: { cls: "bg-good-bg/80 text-good-text border-good/25", Icon: CheckCircle2 },
  "Attention Needed": { cls: "bg-warn-bg/80 text-warn-text border-warn/30", Icon: AlertTriangle },
  Urgent: { cls: "bg-urgent-bg/80 text-urgent-text border-urgent/30", Icon: CircleAlert },
  Pending: { cls: "bg-pending-bg/70 text-pending border-pending/20", Icon: Circle },
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
  const { cls, Icon } = MAP[status];
  return (
    <span
      className={cn(
        "animate-badge-pop inline-flex items-center gap-1.5 rounded-full border font-semibold backdrop-blur-md",
        size === "lg" ? "px-5 py-2.5 text-base" : "px-3 py-1 text-xs",
        cls,
        className,
      )}
    >
      <Icon className={size === "lg" ? "size-5" : "size-3.5"} />
      {status}
    </span>
  );
}

export function NoDataBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-pending-bg/70 px-3 py-1 text-xs font-semibold text-pending backdrop-blur-md">
      No Data
    </span>
  );
}
