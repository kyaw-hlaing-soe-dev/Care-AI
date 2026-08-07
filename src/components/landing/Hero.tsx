import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Activity, Brain, Check, Droplets, HeartPulse, Play, Thermometer } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import doctor from "@/assets/ai-doctor-cutout.png";

const PROOF = ["Google Login", "AI Health Analysis", "Real-Time Monitoring", "100% Secure"];

const WIDGETS = [
  {
    Icon: HeartPulse,
    label: "Heart Rate",
    value: "72 BPM",
    tint: "from-rose-400/80 to-rose-500/80",
    pos: "left-[-4%] top-[12%]",
    delay: 0,
    rotate: -7,
  },
  {
    Icon: Droplets,
    label: "Blood Pressure",
    value: "120 / 80",
    tint: "from-primary/85 to-sky/85",
    pos: "right-[-6%] top-[6%]",
    delay: 0.8,
    rotate: 6,
  },
  {
    Icon: Thermometer,
    label: "Temperature",
    value: "36.7°C",
    tint: "from-amber-400/85 to-orange-400/85",
    pos: "left-[-8%] bottom-[26%]",
    delay: 1.4,
    rotate: 5,
  },
  {
    Icon: Activity,
    label: "Oxygen",
    value: "98%",
    tint: "from-teal/90 to-cyan/90",
    pos: "right-[-4%] bottom-[30%]",
    delay: 0.4,
    rotate: -5,
  },
  {
    Icon: Brain,
    label: "AI Health Score",
    value: "Excellent",
    tint: "from-violet/85 to-primary/85",
    pos: "left-1/2 bottom-[2%] -translate-x-1/2",
    delay: 1.1,
    rotate: -2,
  },
];

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-20">
      <div className="text-center lg:text-left">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-surface glass-glare inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-dark"
        >
          <Brain className="size-3.5" />
          Your Personal AI Healthcare Companion
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-balance text-5xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Your <span className="text-gradient">AI Doctor</span> That Cares About You
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0"
        >
          Track your health, monitor vital signs, and receive intelligent AI-powered health insights
          anytime, anywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
        >
          <Link to="/login" className="sm:w-auto">
            <GlassButton size="lg" className="w-full sm:w-auto">
              Get Started Free
            </GlassButton>
          </Link>
          <a href="#dashboard" className="sm:w-auto">
            <GlassButton variant="glass" size="lg" className="w-full sm:w-auto">
              <Play className="size-4" />
              Watch Demo
            </GlassButton>
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 grid grid-cols-2 gap-3 text-left sm:mx-auto sm:max-w-md lg:mx-0"
        >
          {PROOF.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Stage */}
      <div
        ref={stage}
        onMouseMove={onMove}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative mx-auto aspect-square w-full max-w-[34rem] [perspective:1400px]"
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="absolute inset-0"
        >
          <div className="absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/25 via-cyan/25 to-violet/20 blur-2xl" />
          <div className="glass-surface glass-glare absolute left-1/2 top-1/2 size-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full" />

          <motion.img
            src={doctor}
            alt="Friendly 3D AI doctor mascot waving"
            width={1024}
            height={1024}
            loading="eager"
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-[14%] bottom-[6%] top-[4%] m-auto h-[92%] w-auto object-contain drop-shadow-[0_40px_50px_rgba(30,64,140,0.28)]"
            style={{ transform: "translateZ(60px)" }}
          />

          {WIDGETS.map((w) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + w.delay * 0.3 },
                scale: { duration: 0.6, delay: 0.3 + w.delay * 0.3 },
                y: { duration: 5 + w.delay, repeat: Infinity, ease: "easeInOut", delay: w.delay },
              }}
              style={{ rotate: w.rotate, transform: "translateZ(90px)" }}
              className={`glass-surface glass-glare glass-strong absolute ${w.pos} flex items-center gap-2.5 rounded-2xl px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3`}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${w.tint} text-white shadow-lg sm:size-9`}
              >
                <w.Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {w.label}
                </span>
                <span className="block text-sm font-extrabold tabular-nums sm:text-base">
                  {w.value}
                </span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
