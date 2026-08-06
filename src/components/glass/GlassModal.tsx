import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { GlassCard } from "./GlassCard";

type GlassModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function GlassModal({ open, onClose, title, description, children }: GlassModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4">
      <button
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/25 backdrop-blur-md"
      />
      <GlassCard
        strong
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-3xl p-6"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </GlassCard>
    </div>
  );
}
