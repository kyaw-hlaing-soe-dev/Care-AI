import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Film, Play, X } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { useTranslation } from "react-i18next";

const DEMO_VIDEO_SOURCES = [
  "/videos/careai-demo.mp4",
  "/__l5e/assets-v1/ef8e430f-b37b-438f-b5b6-6543d3de76fb/careai-demo.mp4",
] as const;

export function WatchDemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause();
      setVideoUnavailable(false);
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
            <div className="relative aspect-video overflow-hidden bg-slate-950">
              {!videoUnavailable ? (
                <video
                  ref={videoRef}
                  controls
                  playsInline
                  muted
                  autoPlay
                  preload="metadata"
                  className="absolute inset-0 size-full"
                  aria-label={t("landing.demoModal.description")}
                  onError={() => setVideoUnavailable(true)}
                >
                  {DEMO_VIDEO_SOURCES.map((source) => (
                    <source key={source} src={source} type="video/mp4" />
                  ))}
                </video>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(14,165,233,0.25),transparent_38%),linear-gradient(135deg,#061226,#0f2547_52%,#092d3d)] px-6 text-center text-white">
                  <span className="grid size-16 place-items-center rounded-full bg-white/12 ring-1 ring-white/20">
                    <Film className="size-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight">
                    {t("landing.demoModal.title")}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                    {t("landing.demoModal.description")}
                  </p>
                  <a
                    href={DEMO_VIDEO_SOURCES[0]}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 text-sm font-bold text-white transition-colors hover:bg-white/18 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200/40"
                  >
                    <Play className="size-4" fill="currentColor" aria-hidden="true" />
                    {t("landing.hero.watchDemo")}
                  </a>
                </div>
              )}
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
