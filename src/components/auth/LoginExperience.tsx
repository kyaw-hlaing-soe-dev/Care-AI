import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowLeft,
  Check,
  Droplets,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import doctorImage from "@/assets/login-doctor-seated.png";

type VitalCardProps = {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  status: string;
  tone: "rose" | "cyan" | "blue" | "violet";
  className?: string;
  delay?: number;
  float?: number;
  rotate?: number;
  compact?: boolean;
};

const vitalCards: Array<Omit<VitalCardProps, "className"> & { position: string }> = [
  {
    icon: HeartPulse,
    label: "Heart rate",
    value: "72 BPM",
    status: "Normal",
    tone: "rose",
    position: "left-[1%] top-[28%] xl:left-[5%]",
    delay: 0.22,
    float: 5,
    rotate: -1,
  },
  {
    icon: Activity,
    label: "Oxygen",
    value: "98%",
    status: "Excellent",
    tone: "cyan",
    position: "right-[0%] top-[22%] xl:right-[2%]",
    delay: 0.36,
    float: -4,
    rotate: 0.6,
  },
  {
    icon: Droplets,
    label: "Blood pressure",
    value: "120/80",
    status: "Normal",
    tone: "blue",
    position: "bottom-[20%] left-[0%] xl:left-[4%]",
    delay: 0.5,
    float: -5,
    rotate: 0.8,
  },
  {
    icon: Sparkles,
    label: "AI health score",
    value: "92",
    status: "Great",
    tone: "violet",
    position: "bottom-[39%] right-[-1%] xl:right-[2%]",
    delay: 0.64,
    float: 4,
    rotate: -0.7,
  },
];

const toneClasses = {
  rose: "bg-rose-50 text-rose-500 ring-rose-100",
  cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
};

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-3" aria-label="AICare">
      <span
        className={`${compact ? "size-10 rounded-[13px]" : "size-11 rounded-[15px]"} brand-logo-mark relative grid shrink-0 place-items-center`}
        aria-hidden="true"
      >
        <Activity className={compact ? "size-5" : "size-[22px]"} strokeWidth={2.5} />
      </span>
      <span
        className={`${compact ? "text-[1.15rem]" : "text-xl"} font-extrabold tracking-[-0.04em] text-slate-900`}
      >
        AI<span className="text-primary">Care</span>
      </span>
    </div>
  );
}

export function FloatingVitalCard({
  icon: Icon,
  label,
  value,
  status,
  tone,
  className = "",
  delay = 0,
  float = 4,
  rotate = 0,
  compact = false,
}: VitalCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.94 }}
      animate={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: [0, float, 0],
              rotate: [rotate, rotate * -0.65, rotate],
              scale: 1,
            }
      }
      transition={{
        opacity: { duration: 0.55, delay },
        scale: { duration: 0.55, delay },
        y: { duration: 5.8 + delay * 2, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 7.2 + delay, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`vital-card absolute z-30 flex items-center ${
        compact
          ? "mobile-vital-card min-w-[112px] gap-2 rounded-2xl px-2 py-2"
          : "min-w-[148px] gap-2.5 rounded-[19px] px-3 py-2.5"
      } ${className}`}
    >
      <span
        className={`grid shrink-0 place-items-center rounded-xl ring-1 ${compact ? "size-8" : "size-9"} ${toneClasses[tone]}`}
      >
        <Icon className={compact ? "size-3.5" : "size-[17px]"} strokeWidth={2.3} />
      </span>
      <span className="min-w-0 leading-none">
        <span
          className={`block font-bold uppercase tracking-[0.1em] text-slate-400 ${compact ? "text-[7px]" : "text-[9px]"}`}
        >
          {label}
        </span>
        <span className="mt-1.5 flex items-baseline gap-1.5 whitespace-nowrap">
          <span
            className={`${compact ? "text-xs" : "text-sm"} font-extrabold tracking-tight text-slate-800 tabular-nums`}
          >
            {value}
          </span>
          <span
            className={`${compact ? "text-[7px]" : "text-[9px]"} font-semibold text-emerald-600`}
          >
            {status}
          </span>
        </span>
      </span>
    </motion.div>
  );
}

export function DoctorIllustration({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={compact ? "relative h-full w-full" : "relative h-full w-full"}>
      <div
        className={`${compact ? "size-[150px]" : "size-[62%]"} absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/30 blur-[52px]`}
        aria-hidden="true"
      />
      <div
        className={`${compact ? "bottom-[8%] h-4 w-[130px]" : "bottom-[4%] h-10 w-[46%]"} absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-blue-950/10 blur-xl`}
        aria-hidden="true"
      />
      <motion.img
        src={doctorImage}
        alt="Friendly AICare 3D doctor using a health tablet"
        width={1694}
        height={928}
        loading="eager"
        decoding="async"
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: [0, -5, 0], scale: 1 }}
        transition={{
          opacity: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          y: { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 },
        }}
        className={`${compact ? "h-[154px]" : "h-[92%]"} login-doctor-image absolute bottom-0 left-1/2 z-20 w-auto max-w-none -translate-x-1/2 object-contain`}
      />
      <div
        className={`${compact ? "bottom-[43%] left-[43%] size-10 blur-xl" : "bottom-[43%] left-[42%] size-24 blur-2xl"} pointer-events-none absolute z-20 rounded-full bg-cyan-300/40`}
        aria-hidden="true"
      />
    </div>
  );
}

function DecorativeField() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.span
        animate={reduceMotion ? undefined : { x: [0, 8, 0], y: [0, -7, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[7%] top-[19%] size-7 rounded-full border border-white/80 bg-gradient-to-br from-white/70 to-cyan-200/30 shadow-[0_10px_24px_rgba(45,135,190,.12)]"
      />
      <motion.span
        animate={reduceMotion ? undefined : { x: [0, -10, 0], y: [0, 8, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute bottom-[12%] right-[7%] size-12 rounded-full border border-white/70 bg-gradient-to-br from-blue-100/50 to-violet-200/20 blur-[1px]"
      />
      <span className="absolute left-[13%] top-[48%] text-xl font-light text-cyan-500/20">+</span>
      <span className="absolute right-[10%] top-[44%] text-2xl font-light text-blue-500/15">+</span>
      <span className="absolute bottom-[17%] left-[25%] size-1.5 rounded-full bg-cyan-400/30" />
      <span className="absolute right-[20%] top-[14%] size-1 rounded-full bg-blue-400/30" />
    </div>
  );
}

export function LoginVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="auth-visual relative hidden min-h-dvh overflow-hidden lg:block"
      aria-label="AICare health insights preview"
    >
      <DecorativeField />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[7%] top-[5.5%] z-40 max-w-[430px]"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/60 px-3 py-1.5 text-[11px] font-bold tracking-wide text-primary-dark shadow-sm backdrop-blur-md">
          <Sparkles className="size-3.5 text-cyan-500" />
          AI-powered health companion
        </span>
        <h2 className="mt-4 text-[clamp(2rem,3.1vw,3.35rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-slate-900">
          Your health,
          <br />
          <span className="text-gradient">understood.</span>
        </h2>
        <p className="mt-3 max-w-[385px] text-[13px] leading-6 text-slate-500 xl:text-sm">
          Track your vitals and get AI-powered insights that help you understand your health better.
        </p>
      </motion.div>

      <div className="absolute inset-x-[4%] bottom-[2%] top-[18%] z-10 mx-auto max-w-[760px]">
        <svg
          viewBox="0 0 760 680"
          fill="none"
          className="absolute inset-0 z-10 h-full w-full opacity-60"
          aria-hidden="true"
        >
          <path
            d="M352 365C267 350 204 320 156 286"
            stroke="url(#line-a)"
            strokeWidth="1.2"
            strokeDasharray="4 7"
          />
          <path
            d="M385 360C477 348 530 303 584 259"
            stroke="url(#line-b)"
            strokeWidth="1.2"
            strokeDasharray="4 7"
          />
          <defs>
            <linearGradient
              id="line-a"
              x1="352"
              y1="438"
              x2="156"
              y2="286"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#22D3EE" stopOpacity=".7" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity=".08" />
            </linearGradient>
            <linearGradient
              id="line-b"
              x1="385"
              y1="432"
              x2="584"
              y2="259"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#22D3EE" stopOpacity=".7" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity=".08" />
            </linearGradient>
          </defs>
        </svg>

        <DoctorIllustration />

        {vitalCards.map((card, index) => (
          <FloatingVitalCard
            key={card.label}
            {...card}
            className={`${card.position} ${index === 2 ? "hidden xl:flex" : ""}`}
          />
        ))}

        <div className="absolute bottom-[44%] left-[39%] z-30 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_3px_rgba(34,211,238,.35)]" />
        <div className="absolute bottom-[48%] left-[35%] z-30 size-1 rounded-full bg-blue-400/80" />
        <div className="absolute bottom-[50%] right-[37%] z-30 size-1 rounded-full bg-cyan-400/70" />
      </div>

      <motion.figure
        initial={reduceMotion ? false : { opacity: 0, x: -10 }}
        animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="testimonial-chip absolute bottom-[4.5%] left-[6%] z-40 hidden max-w-[260px] rounded-2xl px-4 py-3 2xl:block"
      >
        <blockquote className="text-[11px] font-medium leading-[1.55] text-slate-600">
          “Understanding my daily health has never been this simple.”
        </blockquote>
        <figcaption
          className="mt-1.5 text-[10px] tracking-[0.18em] text-amber-400"
          aria-label="5 out of 5 stars"
        >
          ★★★★★
        </figcaption>
      </motion.figure>
    </section>
  );
}

export function MobileDoctorVisual() {
  return (
    <div
      className="login-mobile-visual relative mx-auto mt-4 h-[168px] w-full max-w-[300px] lg:hidden"
      aria-hidden="true"
    >
      <DoctorIllustration compact />
      <FloatingVitalCard
        icon={HeartPulse}
        label="Heart rate"
        value="72"
        status="Normal"
        tone="rose"
        className="left-0 top-[24%]"
        float={3}
        delay={0.2}
        compact
      />
      <FloatingVitalCard
        icon={Sparkles}
        label="Health score"
        value="92"
        status="Great"
        tone="violet"
        className="right-0 top-[44%]"
        float={-3}
        delay={0.35}
        compact
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.25-2.52c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.88A6.02 6.02 0 0 1 6.08 12c0-.65.11-1.28.31-1.88v-2.6H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.48l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.99c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.6C7.18 7.75 9.39 5.99 12 5.99Z"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  onClick,
  pending,
}: {
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={pending ? "Signing you in with Google" : "Continue with Google"}
      aria-busy={pending}
      className="google-sign-in group relative flex h-14 w-full items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 text-[15px] font-semibold text-slate-700 shadow-[0_8px_28px_-12px_rgba(26,73,119,.28),0_2px_6px_rgba(36,76,120,.04)] transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_16px_34px_-14px_rgba(37,99,235,.3),0_4px_9px_rgba(36,76,120,.06)] active:scale-[.98] disabled:pointer-events-none disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
    >
      <span className="absolute left-5 grid size-6 place-items-center">
        {pending ? (
          <span
            className="size-[18px] animate-spin rounded-full border-2 border-blue-100 border-t-primary"
            aria-hidden="true"
          />
        ) : (
          <GoogleIcon />
        )}
      </span>
      {pending ? "Signing you in..." : "Continue with Google"}
    </button>
  );
}

export function TrustIndicators() {
  return (
    <div className="mt-5">
      <p className="flex items-center justify-center gap-1.5 text-center text-[12px] font-medium text-slate-500">
        <LockKeyhole className="size-3.5 text-primary" aria-hidden="true" />
        Secure sign-in <span aria-hidden="true">•</span> Your health data stays private
      </p>
      <ul className="mt-4 flex items-center justify-center gap-5" aria-label="Sign-in benefits">
        {["Secure", "Private", "Fast"].map((item) => (
          <li
            key={item}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"
          >
            <span className="grid size-4 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LoginPanel({
  onSignIn,
  pending,
  error,
}: {
  onSignIn: () => void;
  pending: boolean;
  error: string | null;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="auth-panel relative z-40 flex min-h-dvh items-center justify-center border-white/70 lg:border-l"
      aria-labelledby="login-heading"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 22 }}
        animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="auth-panel-content w-full max-w-[460px] px-5 py-7 sm:px-8 lg:px-10"
      >
        <BrandLogo />

        <div className="login-heading-block mt-9 sm:mt-11">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Private by design
          </p>
          <h1
            id="login-heading"
            className="text-[2rem] font-extrabold leading-tight tracking-[-0.045em] text-slate-900 sm:text-[2.35rem]"
          >
            Welcome back
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-slate-500 sm:text-[15px]">
            Sign in to continue your health journey.
          </p>
        </div>

        <MobileDoctorVisual />

        <div className="login-actions mt-8 lg:mt-10">
          <GoogleSignInButton onClick={onSignIn} pending={pending} />
          {error && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-rose-100 bg-rose-50/80 px-3 py-2.5 text-center text-xs font-medium text-rose-700"
            >
              {error}
            </p>
          )}
          <TrustIndicators />
        </div>

        <div className="login-footer mt-8 border-t border-slate-200/70 pt-5">
          <p className="text-[11px] leading-[1.65] text-slate-400">
            AICare provides informational health insights only and is not a substitute for
            professional medical advice.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-slate-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
