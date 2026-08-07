import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { ArrowLeft, Check, Droplets, HeartPulse, LockKeyhole, Sparkles } from "lucide-react";
import { CareAILogo } from "@/components/auth/CareAILogo";
import doctorImage from "../../assets/login-doctor-seated.png";

export type LoginExperienceProps = {
  onSignIn: () => void;
  pending?: boolean | undefined;
  error?: string | null | undefined;
};

type FloatingVitalCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  className: string;
  accentClassName: string;
  floatY?: number;
  duration?: number;
  delay?: number;
};

function FloatingVitalCard({
  title,
  value,
  detail,
  icon,
  className,
  accentClassName,
  floatY = -4,
  duration = 7,
  delay = 0,
}: FloatingVitalCardProps) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <motion.div
      className={`absolute z-20 rounded-[16px] border border-white/85 bg-white/[0.82] p-2.5 text-slate-900 shadow-[0_8px_18px_rgba(57,91,125,0.10),0_24px_52px_rgba(56,189,248,0.10)] backdrop-blur-md ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={
        reducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: [0, floatY, 0], rotate: [0, 0.35, 0] }
      }
      transition={
        reducedMotion
          ? { duration: 0.2, delay }
          : {
              opacity: { duration: 0.45, delay },
              y: { duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay },
              rotate: {
                duration: duration + 1.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay,
              },
            }
      }
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${accentClassName}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 sm:text-[10px]">
            {title}
          </span>
          <span className="mt-0.5 block text-[15px] font-bold tracking-[-0.02em] text-slate-950">
            {value}
          </span>
          <span className="mt-0.5 block text-[10px] font-medium text-slate-500">{detail}</span>
        </span>
      </div>
    </motion.div>
  );
}

function DoctorImage({ className }: { className: string }) {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <motion.img
      src={doctorImage}
      alt="Friendly 3D CareAI doctor sitting on a stool and reviewing health data on a tablet"
      className={`doctor-image-blend relative z-10 h-full w-auto max-w-none select-none object-contain ${className}`}
      draggable="false"
      loading="eager"
      initial={{ opacity: 0, y: 10 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -4, 0] }}
      transition={
        reducedMotion
          ? { duration: 0.25 }
          : {
              opacity: { duration: 0.55 },
              y: { duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }
      }
    />
  );
}

function DesktopDoctorScene() {
  return (
    <div className="login-desktop-scene relative h-[clamp(340px,45dvh,410px)] w-full max-w-[620px] bg-[radial-gradient(circle_at_52%_53%,rgba(34,211,238,0.15),rgba(59,130,246,0.06)_43%,transparent_72%)]">
      <div className="relative z-10 mx-auto flex h-full w-full items-center justify-center overflow-hidden">
        <DoctorImage className="" />
      </div>

      <FloatingVitalCard
        title="Heart rate"
        value="72 BPM"
        detail="Normal"
        icon={<HeartPulse className="size-4" />}
        accentClassName="bg-rose-50 text-rose-500"
        className="left-[1%] top-[32%] w-[150px]"
        floatY={-5}
        duration={7.2}
        delay={0.12}
      />
      <FloatingVitalCard
        title="Oxygen"
        value="98%"
        detail="Excellent"
        icon={<Droplets className="size-4" />}
        accentClassName="bg-sky-50 text-sky-500"
        className="right-[1%] top-[18%] w-[142px]"
        floatY={4}
        duration={8.4}
        delay={0.24}
      />
      <FloatingVitalCard
        title="AI health score"
        value="92"
        detail="Great · trending up"
        icon={<Sparkles className="size-4" />}
        accentClassName="bg-cyan-50 text-cyan-600"
        className="bottom-[10%] right-[0%] w-[172px] rounded-[18px] p-3"
        floatY={-6}
        duration={7.8}
        delay={0.36}
      />
    </div>
  );
}

function MobileDoctorScene() {
  return (
    <div className="login-mobile-scene relative mx-auto w-full max-w-[390px] bg-[radial-gradient(circle_at_50%_52%,rgba(34,211,238,0.16),rgba(59,130,246,0.055)_46%,transparent_72%)] md:max-w-[580px]">
      <div className="relative z-10 mx-auto flex h-full w-full items-center justify-center overflow-hidden">
        <DoctorImage className="" />
      </div>

      <FloatingVitalCard
        title="Heart rate"
        value="72 BPM"
        detail="Normal"
        icon={<HeartPulse className="size-3.5" />}
        accentClassName="bg-rose-50 text-rose-500"
        className="left-0 top-[24%] w-[108px] sm:left-[5%] sm:w-[118px] md:left-[12%] md:top-[27%] md:w-[132px]"
        floatY={-3}
        duration={7.2}
        delay={0.14}
      />
      <FloatingVitalCard
        title="AI score"
        value="92"
        detail="Great"
        icon={<Sparkles className="size-3.5" />}
        accentClassName="bg-cyan-50 text-cyan-600"
        className="right-0 top-[51%] w-[108px] sm:right-[5%] sm:w-[118px] md:right-[12%] md:w-[132px]"
        floatY={3}
        duration={8.1}
        delay={0.28}
      />
    </div>
  );
}

export function LoginVisual() {
  return (
    <motion.section
      className="hidden min-w-0 flex-col justify-center gap-3 lg:flex"
      aria-labelledby="login-visual-heading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[540px]">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/75 bg-white/75 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_8px_22px_rgba(14,165,233,0.08)]">
          <Sparkles className="size-3.5" aria-hidden="true" />
          AI-powered health companion
        </div>
        <h1
          id="login-visual-heading"
          className="mt-4 max-w-[11ch] text-[clamp(3rem,4.8vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-slate-950"
        >
          Your health,{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            understood.
          </span>
        </h1>
        <p className="mt-4 max-w-[500px] text-[clamp(1rem,1.25vw,1.125rem)] leading-7 text-slate-600">
          Track your vitals and get AI-powered insights that help you understand your health better.
        </p>
      </div>

      <DesktopDoctorScene />
    </motion.section>
  );
}

function GoogleSignInButton({
  pending,
  onSignIn,
}: Pick<LoginExperienceProps, "pending" | "onSignIn">) {
  return (
    <button
      type="button"
      onClick={onSignIn}
      disabled={pending}
      aria-label={pending ? "Signing you in with Google" : "Continue with Google"}
      aria-busy={pending}
      className="relative inline-flex h-[54px] w-full items-center justify-center rounded-[15px] border border-slate-200 bg-white px-12 text-[15px] font-semibold text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-px hover:border-sky-300 hover:shadow-[0_16px_34px_rgba(14,165,233,0.13)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute left-5 size-5">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.27 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.967 3.038l5.657-5.657C34.012 6.053 29.253 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z"
        />
        <path
          fill="#FF3D00"
          d="m6.306 14.691 6.57 4.809C14.655 15.091 18.977 12 24 12c3.059 0 5.842 1.154 7.967 3.038l5.657-5.657C34.012 6.053 29.253 4 24 4c-7.682 0-14.328 4.337-17.694 10.691Z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.182 0 9.876-1.982 13.412-5.202l-6.19-5.238C29.173 35.091 26.7 36 24 36c-5.248 0-9.623-3.313-11.295-7.946l-6.52 5.02C9.508 39.537 16.227 44 24 44Z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-1.027 2.95-3.022 5.34-5.081 7.02l6.19 5.238C35.974 39.953 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z"
        />
      </svg>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500 motion-reduce:animate-none"
            aria-hidden="true"
          />
          Signing you in...
        </span>
      ) : (
        "Continue with Google"
      )}
    </button>
  );
}

function TrustIndicators() {
  return (
    <div className="space-y-3.5">
      <p className="flex items-center justify-center gap-2 text-center text-[12px] leading-5 text-slate-600">
        <LockKeyhole className="size-3.5 shrink-0 text-cyan-600" aria-hidden="true" />
        <span>Secure sign-in • Your health data stays private</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-slate-600">
        {["Secure", "Private", "Fast"].map((label) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LoginPanel({ onSignIn, pending, error }: LoginExperienceProps) {
  return (
    <motion.section
      className="min-w-0 lg:flex lg:items-center lg:justify-center"
      aria-labelledby="login-heading"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto w-full max-w-[440px] md:max-w-[620px] lg:max-w-[440px]">
        <div className="md:mx-auto md:max-w-[440px] lg:max-w-none">
          <CareAILogo />

          <div className="mt-4 inline-flex rounded-full border border-cyan-200/75 bg-white/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 shadow-[0_8px_18px_rgba(14,165,233,0.07)] sm:mt-5">
            Private by design
          </div>

          <h2
            id="login-heading"
            className="mt-3 text-[clamp(2rem,8vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-slate-950 lg:mt-4 lg:text-[clamp(2.75rem,4vw,3.5rem)]"
          >
            Welcome back
          </h2>
          <p className="mt-2 text-[15px] leading-6 text-slate-600 sm:text-base">
            Sign in to continue your health journey.
          </p>
        </div>

        <div className="mt-2 lg:hidden">
          <MobileDoctorScene />
        </div>

        <div className="mt-3 rounded-[26px] border border-white/85 bg-white/[0.78] p-5 shadow-[0_18px_58px_rgba(31,72,116,0.10)] backdrop-blur-lg sm:mt-5 sm:p-6 md:mx-auto md:max-w-[440px] lg:mt-6 lg:max-w-none lg:p-7">
          <GoogleSignInButton pending={pending} onSignIn={onSignIn} />

          {error ? (
            <p className="mt-3 text-sm font-medium leading-5 text-rose-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-4">
            <TrustIndicators />
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200/80 pt-4 md:mx-auto md:max-w-[440px] lg:max-w-none">
          <p className="text-[12px] leading-[1.55] text-slate-600">
            CareAI provides informational health insights only and is not a substitute for
            professional medical advice.
          </p>

          <Link
            to="/"
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

export function LoginExperience({ onSignIn, pending, error }: LoginExperienceProps) {
  return (
    <main className="login-page min-h-dvh text-slate-900">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1400px] items-center px-4 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,.88fr)] lg:gap-12 lg:px-10 lg:py-6 xl:gap-16 xl:px-12">
        <LoginVisual />
        <LoginPanel onSignIn={onSignIn} pending={pending} error={error} />
      </div>
    </main>
  );
}
