import { motion } from "motion/react";

/** Layered ambient background: gradient blobs, blurred circles, floating particles. */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-blob absolute -left-40 -top-40 size-[42rem] rounded-full bg-primary/25 blur-[120px]" />
      <div
        className="animate-blob absolute -right-52 top-10 size-[38rem] rounded-full bg-cyan/30 blur-[130px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-blob absolute left-1/3 top-[70%] size-[34rem] rounded-full bg-sky/18 blur-[140px]"
        style={{ animationDelay: "-11s" }}
      />

      {/* large transparent rings */}
      <div className="absolute left-1/2 top-24 hidden size-[52rem] -translate-x-1/2 rounded-full border border-white/50 lg:block" />
      <div className="absolute left-1/2 top-48 hidden size-[34rem] -translate-x-1/2 rounded-full border border-white/40 lg:block" />

      {/* floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/70 shadow-[0_0_18px_rgba(59,130,246,0.45)]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -26, 0], opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

const PARTICLES = [
  { left: "8%", top: "22%", size: 8, dur: 7, delay: 0 },
  { left: "22%", top: "68%", size: 6, dur: 9, delay: 1.2 },
  { left: "44%", top: "14%", size: 5, dur: 8, delay: 0.6 },
  { left: "63%", top: "58%", size: 9, dur: 10, delay: 2 },
  { left: "78%", top: "28%", size: 6, dur: 7.5, delay: 1.6 },
  { left: "90%", top: "72%", size: 7, dur: 11, delay: 0.4 },
];
