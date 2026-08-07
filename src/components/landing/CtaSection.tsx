import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { GlassButton } from "@/components/glass/GlassButton";
import { Reveal } from "./Reveal";
import doctor from "@/assets/ai-doctor-cutout.png";

function SupportCard({
  icon,
  label,
  value,
  className,
  delay,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  className: string;
  delay: number;
}) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      className={`absolute z-20 hidden items-center gap-2.5 rounded-[17px] border border-white/75 bg-white/85 px-3 py-2.5 text-slate-900 shadow-[0_16px_36px_rgba(21,66,125,0.18)] backdrop-blur-md lg:flex ${className}`}
      initial={{ opacity: 0, y: 6 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -3, 0] }}
      transition={
        reducedMotion
          ? { duration: 0.2, delay }
          : {
              opacity: { duration: 0.4, delay },
              y: {
                duration: 7.2 + delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay,
              },
            }
      }
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-[11px] bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
          {label}
        </span>
        <span className="mt-0.5 block text-sm font-extrabold text-slate-950">{value}</span>
      </span>
    </motion.div>
  );
}

export function CtaSection() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section id="start" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-sky to-cyan p-8 shadow-[0_50px_90px_-40px_rgba(30,64,140,0.75)] sm:p-10 lg:px-12 lg:py-10">
          <div className="pointer-events-none absolute -left-16 -top-24 size-80 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-10 size-96 rounded-full bg-white/15 blur-3xl" />

          <div className="relative grid items-center gap-7 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)] md:gap-4 lg:gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-balance text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
                Start understanding your health today.
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                Track your vitals and turn everyday readings into clear, useful insights.
              </p>
              <Link to="/login" className="mt-8 inline-block w-full sm:w-auto">
                <GlassButton
                  variant="glass"
                  size="lg"
                  className="w-full bg-white/90 text-primary-dark hover:bg-white sm:w-auto"
                >
                  Start Tracking Free <ArrowRight className="size-4" />
                </GlassButton>
              </Link>
            </div>

            <div className="relative mx-auto flex h-[220px] w-full max-w-[430px] items-end justify-center sm:h-[240px] md:h-[280px] lg:h-[330px] xl:h-[350px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[46%] h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.24),rgba(165,243,252,0.15)_44%,rgba(59,130,246,0.08)_58%,transparent_73%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[47%] size-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[48%] size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-3xl"
              />

              <motion.div
                aria-hidden="true"
                className="absolute bottom-[3%] left-1/2 z-0 h-5 w-[48%] -translate-x-1/2 rounded-full bg-blue-950/25 blur-xl"
                {...(!reducedMotion
                  ? { animate: { opacity: [0.22, 0.15, 0.22], scaleX: [1, 0.94, 1] } }
                  : {})}
                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              <motion.img
                src={doctor}
                alt="CareAI 3D health companion"
                width={512}
                height={512}
                loading="lazy"
                {...(!reducedMotion ? { animate: { y: [0, -5, 0] } } : {})}
                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="relative z-10 h-[200px] w-auto select-none object-contain drop-shadow-[0_28px_32px_rgba(15,40,90,0.28)] sm:h-[220px] md:h-[260px] lg:h-[320px] xl:h-[340px]"
                draggable="false"
              />

              <SupportCard
                icon={<Sparkles className="size-4" aria-hidden="true" />}
                label="Health score"
                value="88 / 100"
                className="right-[0%] top-[22%]"
                delay={0.45}
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
