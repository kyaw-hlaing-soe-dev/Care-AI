import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Activity, ArrowDown, Brain, Check, Droplets, HeartPulse, Play, Thermometer } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { WatchDemoModal } from "@/components/landing/WatchDemoModal";
import doctor from "@/assets/ai-doctor-cutout.png";
import { useTranslation } from "react-i18next";


const PROOF = [
  "landing.hero.proofGoogle",
  "landing.hero.proofInsights",
  "landing.hero.proofHistory",
] as const;

const WIDGETS = [
  {
    Icon: HeartPulse,
    label: "Heart Rate",
    value: "72 BPM",
    tint: "from-rose-400/80 to-rose-500/80",
    pos: "left-[1%] top-[36%] lg:top-[23%]",
    show: "flex",
    delay: 0,
    rotate: -7,
  },
  {
    Icon: Droplets,
    label: "Blood Pressure",
    value: "120 / 76",
    tint: "from-primary/85 to-sky/85",
    pos: "right-[1%] top-[28%] lg:top-[13%]",
    show: "hidden md:flex",
    delay: 0.8,
    rotate: 6,
  },
  {
    Icon: Thermometer,
    label: "Temperature",
    value: "36.7°C",
    tint: "from-amber-400/85 to-orange-400/85",
    pos: "left-[0%] bottom-[20%]",
    show: "hidden lg:flex",
    delay: 1.4,
    rotate: 5,
  },
  {
    Icon: Activity,
    label: "Oxygen",
    value: "98%",
    tint: "from-teal/90 to-cyan/90",
    pos: "right-[1%] bottom-[20%] lg:right-[0%] lg:bottom-[34%]",
    show: "flex",
    delay: 0.4,
    rotate: -5,
  },
  {
    Icon: Brain,
    label: "Health Score",
    value: "88 / 100",
    tint: "from-violet/85 to-primary/85",
    pos: "right-[2%] top-[1%] lg:right-[6%] lg:bottom-[5%] lg:top-auto",
    show: "flex max-[359px]:hidden",
    delay: 1.1,
    rotate: -2,
  },
];

export function Hero() {
  const { t } = useTranslation();
  const [demoOpen, setDemoOpen] = useState(false);
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
    <section className="mx-auto grid max-w-[1380px] items-center gap-4 px-5 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 md:gap-6 lg:min-h-[calc(100dvh-84px)] lg:grid-cols-[minmax(0,.96fr)_minmax(0,1.04fr)] lg:gap-10 lg:px-10 lg:py-10 xl:gap-14 xl:px-12 [@media(max-height:700px)]:pb-8 [@media(max-height:700px)]:pt-5 lg:[@media(max-height:700px)]:py-10">
      <div className="text-center lg:text-left">
        <motion.span
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-surface glass-glare inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-primary-dark"
        >
          <Brain className="size-3.5" />
          {t("landing.hero.badge")}
        </motion.span>

        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="hero-title mt-5 text-balance text-[clamp(2.375rem,11vw,3.25rem)] font-extrabold leading-[1.01] tracking-[-0.055em] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[clamp(3.65rem,5.2vw,4.5rem)] [@media(max-height:700px)]:mt-3 lg:[@media(max-height:700px)]:mt-5"
        >
          {t("landing.hero.title")}{" "}
          <span className="text-gradient">{t("landing.hero.titleAccent")}</span>
        </motion.h1>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-5 max-w-[380px] text-pretty text-[15px] leading-6 text-muted-foreground sm:text-base md:max-w-[580px] md:text-lg lg:mx-0 [@media(max-height:700px)]:mt-3 lg:[@media(max-height:700px)]:mt-5"
        >
          {t("landing.hero.body")}
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start [@media(max-height:700px)]:mt-5 lg:[@media(max-height:700px)]:mt-8"
        >
          <Link to="/login" className="sm:w-auto">
            <GlassButton size="lg" className="w-full sm:w-auto">
              {t("landing.hero.primary")}
            </GlassButton>
          </Link>
          <a href="#how-it-works" className="sm:w-auto">
            <GlassButton variant="glass" size="lg" className="w-full sm:w-auto">
              <ArrowDown className="size-4" />
              {t("landing.hero.secondary")}
            </GlassButton>
          </a>
          <GlassButton
            variant="glass"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setDemoOpen(true)}
          >
            <Play className="size-4" fill="currentColor" />
            {t("landing.hero.watchDemo")}
          </GlassButton>

        </motion.div>

        <motion.ul
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-5 flex max-w-[430px] flex-wrap justify-center gap-2 text-left sm:mt-6 md:max-w-[560px] md:gap-x-4 lg:mx-0 lg:justify-start [@media(max-height:700px)]:mt-4 lg:[@media(max-height:700px)]:mt-5"
        >
          {PROOF.map((key, index) => (
            <li
              key={key}
              className={`flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-2.5 py-1.5 text-[11px] font-semibold text-foreground/75 shadow-sm backdrop-blur-sm max-[340px]:px-2 max-[340px]:text-[10px] md:bg-transparent md:px-0 md:py-0 md:text-sm md:shadow-none ${index === 2 ? "[@media(max-height:700px)]:hidden lg:[@media(max-height:700px)]:flex" : ""}`}
            >
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan text-primary-foreground md:size-5">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {t(key)}
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
        className="relative mx-auto h-[290px] w-full max-w-[430px] min-[400px]:h-[310px] sm:h-[330px] sm:max-w-[540px] md:h-[390px] md:max-w-[620px] lg:h-[clamp(430px,61dvh,560px)] lg:max-w-[560px] [perspective:1400px] [@media(max-height:700px)]:h-[270px] lg:[@media(max-height:700px)]:h-[430px]"
      >
        <motion.div
          style={
            reducedMotion
              ? { transformStyle: "preserve-3d" }
              : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }
          }
          className="absolute inset-0"
        >
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),rgba(34,211,238,0.13)_45%,transparent_72%)] blur-xl lg:h-[84%] lg:w-[74%] lg:bg-gradient-to-br lg:from-primary/22 lg:via-cyan/24 lg:to-sky-100/40 lg:blur-2xl" />
          <div className="glass-surface glass-glare absolute left-1/2 top-1/2 hidden h-[82%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[42%] lg:block" />

          <motion.img
            src={doctor}
            alt={t("landing.hero.doctorAlt")}
            width={1024}
            height={1024}
            loading="eager"
            {...(!reducedMotion ? { animate: { y: [0, -4, 0] } } : {})}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-[14%] bottom-[7%] top-auto m-auto h-[240px] w-auto object-contain drop-shadow-[0_26px_34px_rgba(30,64,140,0.20)] min-[400px]:h-[255px] sm:h-[280px] md:h-[320px] lg:bottom-[3%] lg:top-[2%] lg:h-[96%] lg:drop-shadow-[0_34px_44px_rgba(30,64,140,0.22)] [@media(max-height:700px)]:h-[225px] lg:[@media(max-height:700px)]:h-[96%]"
            style={{ transform: "translateZ(60px)" }}
          />

          {WIDGETS.map((w) => (
            <motion.div
              key={w.label}
              initial={false}
              animate={
                reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -4, 0] }
              }
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + w.delay * 0.3 },
                scale: { duration: 0.6, delay: 0.3 + w.delay * 0.3 },
                y: { duration: 7 + w.delay, repeat: Infinity, ease: "easeInOut", delay: w.delay },
              }}
              style={{ rotate: w.rotate, transform: "translateZ(90px)" }}
              className={`glass-surface glass-glare glass-strong absolute ${w.pos} ${w.show} w-[118px] items-center gap-2 rounded-[15px] px-2 py-2 sm:w-auto sm:gap-3 sm:rounded-[18px] sm:px-3 sm:py-2.5`}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br ${w.tint} text-white shadow-md sm:size-9 sm:rounded-xl sm:shadow-lg`}
              >
                <w.Icon className="size-3.5 sm:size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[9px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[10px]">
                  {w.label}
                </span>
                <span className="block text-sm font-extrabold tabular-nums sm:text-[15px]">
                  {w.value}
                </span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <WatchDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
}

