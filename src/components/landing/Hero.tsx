import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Activity, ArrowDown, Brain, Check, Droplets, HeartPulse, Thermometer } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import doctor from "@/assets/ai-doctor-cutout.png";

const PROOF = ["Google Sign-In", "Clear Health Insights", "Vital Trend History"];

const WIDGETS = [
  {
    Icon: HeartPulse,
    label: "Heart Rate",
    value: "72 BPM",
    tint: "from-rose-400/80 to-rose-500/80",
    pos: "left-[1%] top-[23%]",
    mobile: true,
    delay: 0,
    rotate: -7,
  },
  {
    Icon: Droplets,
    label: "Blood Pressure",
    value: "120 / 76",
    tint: "from-primary/85 to-sky/85",
    pos: "right-[1%] top-[13%]",
    mobile: true,
    delay: 0.8,
    rotate: 6,
  },
  {
    Icon: Thermometer,
    label: "Temperature",
    value: "36.7°C",
    tint: "from-amber-400/85 to-orange-400/85",
    pos: "left-[0%] bottom-[20%]",
    mobile: false,
    delay: 1.4,
    rotate: 5,
  },
  {
    Icon: Activity,
    label: "Oxygen",
    value: "98%",
    tint: "from-teal/90 to-cyan/90",
    pos: "right-[0%] bottom-[34%]",
    mobile: true,
    delay: 0.4,
    rotate: -5,
  },
];

export function Hero() {
  const reducedMotion = Boolean(useReducedMotion());
  const stage = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (reducedMotion) return;
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section className="mx-auto grid max-w-[1380px] items-center gap-10 px-5 pb-16 pt-10 sm:px-6 sm:pt-12 lg:min-h-[calc(100dvh-84px)] lg:grid-cols-[minmax(0,.96fr)_minmax(0,1.04fr)] lg:gap-10 lg:px-10 lg:py-10 xl:gap-14 xl:px-12">
      <div className="text-center lg:text-left">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-surface glass-glare inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-dark"
        >
          <Brain className="size-3.5" />
          Your Personal AI Health Companion
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-balance text-[clamp(2.65rem,12vw,3.75rem)] font-extrabold leading-[1.01] tracking-[-0.055em] sm:text-[clamp(3.5rem,8vw,4.25rem)] lg:text-[clamp(3.65rem,5.2vw,4.5rem)]"
        >
          Understand Your Health. <span className="text-gradient">One Reading at a Time.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-[580px] text-pretty text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0"
        >
          Track your vital signs, understand your trends, and receive clear AI-powered health insights
          — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
        >
          <Link to="/login" className="sm:w-auto">
            <GlassButton size="lg" className="w-full sm:w-auto">
              Start Tracking Free
            </GlassButton>
          </Link>
          <a href="#how-it-works" className="sm:w-auto">
            <GlassButton variant="glass" size="lg" className="w-full sm:w-auto">
              <ArrowDown className="size-4" />
              See How It Works
            </GlassButton>
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-7 flex max-w-[560px] flex-wrap justify-center gap-x-5 gap-y-3 text-left lg:mx-0 lg:justify-start"
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
        className="relative mx-auto h-[350px] w-full max-w-[560px] sm:h-[470px] lg:h-[clamp(430px,61dvh,560px)] [perspective:1400px]"
      >
        <motion.div
          style={
            reducedMotion
              ? { transformStyle: "preserve-3d" }
              : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }
          }
          className="absolute inset-0"
        >
          <div className="absolute left-1/2 top-1/2 h-[84%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/22 via-cyan/24 to-sky-100/40 blur-2xl" />
          <div className="glass-surface glass-glare absolute left-1/2 top-1/2 h-[82%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[42%]" />

          <motion.img
            src={doctor}
            alt="Friendly CareAI health companion"
            width={1024}
            height={1024}
            loading="eager"
            {...(!reducedMotion ? { animate: { y: [0, -4, 0] } } : {})}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-[14%] bottom-[3%] top-[2%] m-auto h-[96%] w-auto object-contain drop-shadow-[0_34px_44px_rgba(30,64,140,0.22)]"
            style={{ transform: "translateZ(60px)" }}
          />

          {WIDGETS.map((w) => (
            <motion.div
              key={w.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={
                reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -4, 0] }
              }
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + w.delay * 0.3 },
                scale: { duration: 0.6, delay: 0.3 + w.delay * 0.3 },
                y: { duration: 7 + w.delay, repeat: Infinity, ease: "easeInOut", delay: w.delay },
              }}
              style={{ rotate: w.rotate, transform: "translateZ(90px)" }}
              className={`glass-surface glass-glare glass-strong absolute ${w.pos} ${w.mobile ? "flex" : "hidden sm:flex"} items-center gap-2.5 rounded-[18px] px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5`}
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
                <span className="block text-[13px] font-extrabold tabular-nums sm:text-[15px]">
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
