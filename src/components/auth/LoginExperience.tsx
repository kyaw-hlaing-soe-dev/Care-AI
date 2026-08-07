import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { ArrowLeft, Check, Droplets, HeartPulse, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import doctorImage from "../../assets/login-doctor-seated.png";

export type LoginExperienceProps = {
  onSignIn: () => void;
  pending?: boolean | undefined;
  error?: string | null | undefined;
};

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-white shadow-[0_18px_40px_rgba(56,189,248,0.25)]">
        <HeartPulse className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <div className="text-[13px] font-semibold uppercase tracking-[0.3em] text-cyan-500">AICare</div>
        <div className="text-lg font-semibold text-slate-900">AICare</div>
      </div>
    </div>
  );
}

function FloatingVitalCard({
  title,
  value,
  detail,
  icon,
  className,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={[
        "absolute rounded-[18px] border border-white/70 bg-white/[0.78] px-3 py-2 text-slate-900 shadow-[0_18px_48px_rgba(125,166,202,0.18)] backdrop-blur-md",
        className ?? "",
      ].join(" ")}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 shadow-inner">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</div>
          <div className="text-sm font-semibold text-slate-900">{value}</div>
          <div className="text-[10px] text-slate-500">{detail}</div>
        </div>
      </div>
    </motion.div>
  );
}

function DoctorIllustration({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[560px]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="absolute left-1/2 top-[28%] h-[310px] w-[310px] -translate-x-1/2 rounded-full bg-cyan-300/16 blur-3xl"
        animate={reducedMotion ? undefined : { scale: [1, 1.03, 1], opacity: [0.65, 0.8, 0.65] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[40%] h-[180px] w-[180px] -translate-x-1/2 rounded-full bg-sky-400/12 blur-2xl"
        animate={reducedMotion ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <FloatingVitalCard
        title="Heart rate"
        value="72 BPM"
        detail="Normal"
        icon={<HeartPulse className="h-4 w-4" aria-hidden="true" />}
        className="left-2 top-[24%] hidden lg:block"
      />
      <FloatingVitalCard
        title="Oxygen"
        value="98%"
        detail="Excellent"
        icon={<Droplets className="h-4 w-4" aria-hidden="true" />}
        className="right-4 top-[20%] hidden xl:block"
      />
      <FloatingVitalCard
        title="AI health score"
        value="92"
        detail="Great"
        icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
        className="right-2 top-[48%] hidden lg:block"
      />
      <FloatingVitalCard
        title="Blood pressure"
        value="120/80"
        detail="Normal"
        icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
        className="left-10 bottom-[12%] hidden xl:block"
      />

      <motion.img
        src={doctorImage}
        alt="Friendly 3D cartoon doctor holding a tablet"
        className="relative z-10 mx-auto h-auto w-[78%] select-none object-contain drop-shadow-[0_28px_50px_rgba(71,122,161,0.18)] sm:w-[74%] lg:w-[70%]"
        draggable="false"
        loading="eager"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={reducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: [0, -4, 0], scale: 1 }}
        transition={reducedMotion ? { duration: 0.4 } : { duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[51%] z-20 h-14 w-28 -translate-x-1/2 rounded-full bg-cyan-300/25 blur-xl"
        animate={reducedMotion ? undefined : { opacity: [0.45, 0.72, 0.45], scale: [1, 1.05, 1] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export function LoginVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative hidden min-h-[760px] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.14),rgba(59,130,246,0.06)_42%,transparent_70%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-8 py-10 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(125,211,252,0.18),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(96,165,250,0.12),transparent_24%),radial-gradient(circle_at_50%_86%,rgba(147,197,253,0.10),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(148,163,184,0.45)_1px,transparent_1px)] [background-size:28px_28px]" />

      <motion.div
        className="relative z-10 max-w-[400px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center rounded-full border border-cyan-200/70 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-600 shadow-[0_10px_30px_rgba(56,189,248,0.12)] backdrop-blur">
          AI-powered health companion
        </div>
        <h1 className="mt-6 max-w-[12ch] text-[clamp(3.25rem,4.5vw,5.3rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-slate-900">
          Your health, <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">understood.</span>
        </h1>
        <p className="mt-5 max-w-[34rem] text-[17px] leading-8 text-slate-600">
          Track your vitals and get AI-powered insights that help you understand your health better.
        </p>
      </motion.div>

      <div className="relative z-10 flex items-end justify-center pb-2">
        <DoctorIllustration reducedMotion={Boolean(reducedMotion)} />
      </div>
    </section>
  );
}

function MobileDoctorVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative mx-auto mt-1 flex h-[220px] w-full max-w-[360px] items-center justify-center overflow-hidden sm:h-[240px]">
      <motion.div
        className="absolute left-1/2 top-[42%] h-[190px] w-[190px] -translate-x-1/2 rounded-full bg-cyan-300/18 blur-3xl sm:h-[220px] sm:w-[220px]"
        animate={reducedMotion ? undefined : { opacity: [0.6, 0.86, 0.6], scale: [1, 1.03, 1] }}
        transition={{ duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.img
        src={doctorImage}
        alt="Friendly 3D cartoon doctor holding a tablet"
        className="relative z-10 h-[176px] w-auto select-none object-contain sm:h-[188px]"
        draggable="false"
        loading="eager"
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={reducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: [0, -3, 0], scale: 1 }}
        transition={reducedMotion ? { duration: 0.45 } : { duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <FloatingVitalCard
        title="Heart rate"
        value="72 BPM"
        detail="Normal"
        icon={<HeartPulse className="h-4 w-4" aria-hidden="true" />}
        className="left-[2%] top-[30%] w-[120px] px-2 py-2 sm:left-[6%] sm:w-[124px]"
      />
      <FloatingVitalCard
        title="AI health score"
        value="92"
        detail="Great"
        icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
        className="right-[1%] top-[48%] w-[120px] px-2 py-2 sm:right-[6%] sm:w-[124px]"
      />
      <motion.div
        className="absolute bottom-[10%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/[0.82] px-3 py-1.5 text-[10px] font-medium text-slate-500 shadow-[0_16px_30px_rgba(125,166,202,0.16)] backdrop-blur"
        animate={reducedMotion ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
          <LockKeyhole className="h-3 w-3" aria-hidden="true" />
        </span>
        AI analyzing vitals
      </motion.div>
    </section>
  );
}

function GoogleSignInButton({
  pending,
  onSignIn,
}: {
  pending?: boolean | undefined;
  onSignIn: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSignIn}
      disabled={pending}
      className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-[16px] border border-slate-200 bg-white px-5 text-[15px] font-semibold text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_18px_36px_rgba(56,189,248,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.27 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.967 3.038l5.657-5.657C34.012 6.053 29.253 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z" />
        <path fill="#FF3D00" d="M6.306 14.691 12.876 19.5C14.655 15.091 18.977 12 24 12c3.059 0 5.842 1.154 7.967 3.038l5.657-5.657C34.012 6.053 29.253 4 24 4c-7.682 0-14.328 4.337-17.694 10.691Z" />
        <path fill="#4CAF50" d="M24 44c5.182 0 9.876-1.982 13.412-5.202l-6.19-5.238C29.173 35.091 26.7 36 24 36c-5.248 0-9.623-3.313-11.295-7.946l-6.52 5.02C9.508 39.537 16.227 44 24 44Z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.027 2.95-3.022 5.34-5.081 7.02l.002-.001 6.19 5.238C35.974 39.953 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z" />
      </svg>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500 motion-reduce:animate-none" />
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
    <div className="space-y-4">
      <p className="flex items-center justify-center gap-2 text-[12px] text-slate-600">
        <LockKeyhole className="h-3.5 w-3.5 text-cyan-500" aria-hidden="true" />
        Secure sign-in • Your health data stays private
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-medium text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          Secure
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          Private
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          Fast
        </span>
      </div>
    </div>
  );
}

export function LoginPanel({
  onSignIn,
  pending,
  error,
}: LoginExperienceProps) {
  return (
    <section className="flex min-h-dvh flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col lg:max-w-[440px]">
        <div className="mb-6 lg:hidden">
          <BrandLogo />
        </div>

        <div className="lg:hidden">
          <div className="inline-flex rounded-full border border-cyan-200/70 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-600 shadow-[0_10px_20px_rgba(56,189,248,0.08)] backdrop-blur">
            Private by design
          </div>
          <h1 className="mt-4 text-[clamp(2rem,8vw,2.25rem)] font-semibold leading-[1.06] tracking-[-0.05em] text-slate-900">
            Welcome back
          </h1>
          <p className="mt-3 max-w-[26rem] text-[15px] leading-7 text-slate-600">
            Sign in to continue your health journey.
          </p>
        </div>

        <div className="mt-5 lg:hidden">
          <MobileDoctorVisual />
        </div>

        <motion.div
          className="mt-5 space-y-5 lg:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="hidden lg:block">
            <BrandLogo />
            <div className="mt-6 inline-flex rounded-full border border-cyan-200/70 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-600 shadow-[0_10px_20px_rgba(56,189,248,0.08)] backdrop-blur">
              Private by design
            </div>
            <h2 className="mt-4 text-[clamp(2.75rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-slate-900">
              Welcome back
            </h2>
            <p className="mt-3 max-w-[26rem] text-[16px] leading-7 text-slate-600">
              Sign in to continue your health journey.
            </p>
          </div>

          <div className="space-y-4 rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:rounded-[30px] lg:p-7">
            <GoogleSignInButton pending={pending} onSignIn={onSignIn} />

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <TrustIndicators />

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <p className="text-[12px] leading-6 text-slate-500 sm:text-sm">
              AICare provides informational health insights only and is not a substitute for professional medical advice.
            </p>
          </div>
        </motion.div>

        <div className="mt-auto pt-5">
          <a
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-1 py-2 text-[13px] font-medium text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/40 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </a>
        </div>
      </div>
    </section>
  );
}

export function LoginExperience({ onSignIn, pending, error }: LoginExperienceProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_50%,#f4faff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(125,211,252,0.16),transparent_30%),radial-gradient(circle_at_74%_44%,rgba(96,165,250,0.10),transparent_28%),radial-gradient(circle_at_50%_86%,rgba(167,139,250,0.06),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(148,163,184,0.45)_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-[1600px] lg:grid-cols-[minmax(0,1.18fr)_minmax(420px,.82fr)]">
        <LoginVisual />
        <LoginPanel onSignIn={onSignIn} pending={pending} error={error} />
      </div>
    </div>
  );
}
