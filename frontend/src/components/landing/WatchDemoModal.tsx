import { useEffect, useId, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { useTranslation } from "react-i18next";

const DEMO_VIDEO_URL = "/__l5e/assets-v1/ef8e430f-b37b-438f-b5b6-6543d3de76fb/careai-demo.mp4";

export function WatchDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("button, video")?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), video, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[900] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label={t("common.closeDialog")}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/25 backdrop-blur-md"
          />
          <GlassCard
            ref={panelRef}
            strong
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl p-0 shadow-[0_40px_80px_-20px_rgba(31,72,116,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-white/60 px-5 py-4">
              <h2 id={titleId} className="text-lg font-bold tracking-tight">
                {t("landing.demoModal.title")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-slate-950">
              <video
                ref={videoRef}
                src={DEMO_VIDEO_URL}
                controls
                playsInline
                preload="metadata"
                className="absolute inset-0 size-full"
                aria-label={t("landing.demoModal.description")}
              >
                <source src={DEMO_VIDEO_URL} type="video/mp4" />
              </video>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-muted-foreground">{t("landing.demoModal.description")}</p>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
