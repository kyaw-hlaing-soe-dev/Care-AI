import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import {
  ArrowLeft,
  Check,
  Droplets,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  Phone,
  Sparkles,
} from "lucide-react";
import { CareAILogo } from "@/components/auth/CareAILogo";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/auth-context";
import doctorImage from "../../assets/login-doctor-seated.png";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "@/i18n/languages";

export type LoginExperienceProps = {
  onSignIn: () => void;
  pending?: boolean | undefined;
  error?: string | null | undefined;
};

type PhoneStep = "method" | "phone" | "otp";
type PhoneCountry = {
  iso: string;
  label: string;
  flag: string;
  callingCode: string;
  minDigits: number;
  maxDigits: number;
};

const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "MM", label: "Myanmar", flag: "MM", callingCode: "+95", minDigits: 7, maxDigits: 11 },
];

function normalizePhoneNumber(rawValue: string, country: PhoneCountry) {
  const compact = rawValue.replace(/[\s().-]/g, "");
  if (compact.startsWith("+")) {
    if (!/^\+[1-9]\d{7,14}$/.test(compact)) return null;
    if (!compact.startsWith(country.callingCode)) return null;
    const national = compact.slice(country.callingCode.length);
    if (national.length < country.minDigits || national.length > country.maxDigits) return null;
    return compact;
  }
  if (!/^\d+$/.test(compact)) return null;
  const national = compact.replace(/^0+/, "");
  if (national.length < country.minDigits || national.length > country.maxDigits) return null;
  return `${country.callingCode}${national}`;
}

function logPhoneAuthError(stage: "send" | "verify", error: unknown) {
  const code = (error as { code?: string }).code ?? "unknown";
  console.warn("CareAI phone auth failed", { stage, code });
}

function maskPhoneNumber(phoneNumber: string) {
  const last = phoneNumber.replace(/\D/g, "").slice(-4);
  const prefix = phoneNumber.match(/^\+\d{1,3}/)?.[0] ?? "+";
  return `${prefix} ••• ••• ${last || "••••"}`;
}

function phoneAuthErrorKey(error: unknown) {
  const code = (error as { code?: string }).code;
  if (code === "auth/invalid-phone-number" || code === "auth/missing-phone-number") {
    return "auth.phoneErrors.invalidPhone";
  }
  if (code === "auth/invalid-verification-code" || code === "auth/missing-verification-code") {
    return "auth.phoneErrors.invalidCode";
  }
  if (code === "auth/code-expired" || code === "auth/session-expired") {
    return "auth.phoneErrors.expiredCode";
  }
  if (code === "auth/too-many-requests" || code === "auth/quota-exceeded") {
    return "auth.phoneErrors.tooMany";
  }
  if (code === "auth/captcha-check-failed" || code === "auth/missing-app-credential") {
    return "auth.phoneErrors.recaptcha";
  }
  if (code === "auth/network-request-failed") return "auth.phoneErrors.network";
  if (code === "auth/unauthorized-domain") return "auth.phoneErrors.unauthorizedDomain";
  if (code === "auth/operation-not-allowed") return "auth.phoneErrors.providerDisabled";
  if (code === "auth/billing-not-enabled") return "auth.phoneErrors.billingNotEnabled";
  if (code === "auth/invalid-app-credential") return "auth.phoneErrors.invalidAppCredential";
  if (code === "auth/credential-already-in-use" || code === "auth/provider-already-linked") {
    return "auth.phoneErrors.credentialInUse";
  }
  return "auth.phoneErrors.sendFailed";
}

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
          <span className="block break-words text-[9px] font-bold uppercase leading-tight tracking-[0.08em] text-slate-500 sm:text-[10px]">
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
  const { t } = useTranslation();

  return (
    <motion.img
      src={doctorImage}
      alt={t("auth.doctorAlt")}
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
  const { t } = useTranslation();
  return (
    <div className="login-desktop-scene relative h-[clamp(340px,45dvh,410px)] w-full max-w-[620px] bg-[radial-gradient(circle_at_52%_53%,rgba(34,211,238,0.15),rgba(59,130,246,0.06)_43%,transparent_72%)]">
      <div className="relative z-10 mx-auto flex h-full w-full items-center justify-center overflow-hidden">
        <DoctorImage className="" />
      </div>

      <FloatingVitalCard
        title={t("auth.heartRate")}
        value="72 BPM"
        detail={t("auth.normal")}
        icon={<HeartPulse className="size-4" />}
        accentClassName="bg-rose-50 text-rose-500"
        className="left-[1%] top-[32%] w-[150px]"
        floatY={-5}
        duration={7.2}
        delay={0.12}
      />
      <FloatingVitalCard
        title={t("auth.oxygen")}
        value="98%"
        detail={t("auth.excellent")}
        icon={<Droplets className="size-4" />}
        accentClassName="bg-sky-50 text-sky-500"
        className="right-[1%] top-[18%] w-[142px]"
        floatY={4}
        duration={8.4}
        delay={0.24}
      />
      <FloatingVitalCard
        title={t("auth.aiHealthScore")}
        value="92"
        detail={t("auth.trendingUp")}
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
  const { t } = useTranslation();
  return (
    <div className="login-mobile-scene relative mx-auto w-full max-w-[390px] bg-[radial-gradient(circle_at_50%_52%,rgba(34,211,238,0.16),rgba(59,130,246,0.055)_46%,transparent_72%)] md:max-w-[580px]">
      <div className="relative z-10 mx-auto flex h-full w-full items-center justify-center overflow-hidden">
        <DoctorImage className="" />
      </div>

      <FloatingVitalCard
        title={t("auth.heartRate")}
        value="72 BPM"
        detail={t("auth.normal")}
        icon={<HeartPulse className="size-3.5" />}
        accentClassName="bg-rose-50 text-rose-500"
        className="left-0 top-[24%] w-[126px] sm:left-[5%] sm:w-[132px] md:left-[12%] md:top-[27%] md:w-[140px]"
        floatY={-3}
        duration={7.2}
        delay={0.14}
      />
      <FloatingVitalCard
        title={t("auth.aiScore")}
        value="92"
        detail={t("auth.great")}
        icon={<Sparkles className="size-3.5" />}
        accentClassName="bg-cyan-50 text-cyan-600"
        className="right-0 top-[51%] w-[126px] sm:right-[5%] sm:w-[132px] md:right-[12%] md:w-[140px]"
        floatY={3}
        duration={8.1}
        delay={0.28}
      />
    </div>
  );
}

export function LoginVisual() {
  const { t } = useTranslation();
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
          {t("auth.visualBadge")}
        </div>
        <h1
          id="login-visual-heading"
          className="login-marketing-title mt-4 max-w-[11ch] text-[clamp(3rem,4.8vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-slate-950"
        >
          {t("auth.visualTitle")}{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            {t("auth.visualTitleAccent")}
          </span>
        </h1>
        <p className="mt-4 max-w-[500px] text-[clamp(1rem,1.25vw,1.125rem)] leading-7 text-slate-600">
          {t("auth.visualBody")}
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
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onSignIn}
      disabled={pending}
      aria-label={pending ? t("auth.signingInAria") : t("auth.continueGoogle")}
      aria-busy={pending}
      className="relative inline-flex min-h-[54px] w-full items-center justify-center rounded-[15px] border border-slate-200 bg-white px-12 py-3 text-center text-[15px] font-semibold leading-snug text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-px hover:border-sky-300 hover:shadow-[0_16px_34px_rgba(14,165,233,0.13)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transform-none motion-reduce:transition-none"
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
          {t("auth.signingIn")}
        </span>
      ) : (
        t("auth.continueGoogle")
      )}
    </button>
  );
}

function Divider() {
  const { t } = useTranslation();
  return (
    <div className="my-4 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {t("auth.or")}
      </span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function PhoneMethodButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean | undefined;
}) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative inline-flex min-h-[54px] w-full items-center justify-center rounded-[15px] border border-cyan-100 bg-cyan-50/60 px-12 py-3 text-center text-[15px] font-semibold leading-snug text-slate-900 shadow-[0_10px_28px_rgba(14,165,233,0.07)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-px hover:border-cyan-300 hover:shadow-[0_16px_34px_rgba(14,165,233,0.13)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <Phone className="absolute left-5 size-5 text-cyan-600" aria-hidden="true" />
      {t("auth.continuePhone")}
    </button>
  );
}

function PhoneAuthFlow({ googlePending }: { googlePending?: boolean | undefined }) {
  const { createPhoneRecaptchaVerifier, sendPhoneVerification } = useAuth();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<PhoneStep>("method");
  const [countryIso, setCountryIso] = useState("MM");
  const [phoneInput, setPhoneInput] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const sendLock = useRef(false);
  const verifyLock = useRef(false);
  const country = useMemo(
    () => PHONE_COUNTRIES.find((item) => item.iso === countryIso) ?? PHONE_COUNTRIES[0]!,
    [countryIso],
  );

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timeout = window.setTimeout(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timeout);
  }, [cooldown]);

  useEffect(() => {
    return () => {
      verifierRef.current?.clear();
      verifierRef.current = null;
    };
  }, []);

  function resetVerifier() {
    verifierRef.current?.clear();
    verifierRef.current = null;
  }

  function verifier() {
    verifierRef.current ??= createPhoneRecaptchaVerifier(
      "careai-phone-send-button",
      normalizeLanguage(i18n.resolvedLanguage ?? i18n.language),
    );
    return verifierRef.current;
  }

  async function sendCode(resend = false) {
    if (sendLock.current || sending || (resend && cooldown > 0)) return;
    const nextPhone = normalizePhoneNumber(phoneInput, country);
    setError(null);
    setOtp("");
    if (!nextPhone) {
      setError(t("auth.phoneErrors.invalidPhone"));
      return;
    }

    sendLock.current = true;
    setSending(true);
    try {
      if (resend) resetVerifier();
      const nextConfirmation = await sendPhoneVerification(nextPhone, verifier());
      setConfirmation(nextConfirmation);
      setNormalizedPhone(nextPhone);
      setStep("otp");
      setCooldown(30);
    } catch (sendError) {
      resetVerifier();
      logPhoneAuthError("send", sendError);
      setError(t(phoneAuthErrorKey(sendError)));
    } finally {
      sendLock.current = false;
      setSending(false);
    }
  }

  async function verifyCode() {
    if (verifyLock.current || verifying || !confirmation) return;
    const code = otp.replace(/\D/g, "");
    setError(null);
    if (code.length !== 6) {
      setError(t("auth.phoneErrors.invalidCode"));
      return;
    }
    verifyLock.current = true;
    setVerifying(true);
    try {
      await confirmation.confirm(code);
      setVerified(true);
    } catch (verifyError) {
      logPhoneAuthError("verify", verifyError);
      setError(t(phoneAuthErrorKey(verifyError)));
    } finally {
      verifyLock.current = false;
      setVerifying(false);
    }
  }

  function changePhoneNumber() {
    resetVerifier();
    setStep("phone");
    setConfirmation(null);
    setNormalizedPhone("");
    setOtp("");
    setCooldown(0);
    setError(null);
    setVerified(false);
  }

  if (step === "method") {
    return (
      <>
        <Divider />
        <PhoneMethodButton onClick={() => setStep("phone")} disabled={googlePending} />
      </>
    );
  }

  if (step === "phone") {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            resetVerifier();
            setStep("method");
            setError(null);
          }}
          className="inline-flex min-h-10 items-center gap-1 rounded-[11px] pr-2 text-sm font-bold text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> {t("common.back")}
        </button>
        <div>
          <h3 className="text-xl font-extrabold tracking-[-0.03em] text-slate-950">
            {t("auth.phoneTitle")}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">{t("auth.phoneBody")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[0.95fr_1.3fr]">
          <label className="min-w-0">
            <span className="mb-2 block text-[13px] font-bold text-slate-700">
              {t("auth.country")}
            </span>
            <select
              value={countryIso}
              onChange={(event) => setCountryIso(event.target.value)}
              disabled={sending}
              className="min-h-[52px] w-full rounded-[13px] border border-slate-200 bg-white px-3 py-3 text-base font-semibold text-slate-950 outline-none transition-[border-color,box-shadow] hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-cyan-100/80 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {PHONE_COUNTRIES.map((item) => (
                <option key={item.iso} value={item.iso}>
                  {item.flag} {item.label} {item.callingCode}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-0">
            <span className="mb-2 block text-[13px] font-bold text-slate-700">
              {t("auth.phoneNumber")}
            </span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phoneInput}
              onChange={(event) => setPhoneInput(event.target.value)}
              disabled={sending}
              placeholder="9xxxxxxxxx"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "phone-auth-error" : "phone-auth-helper"}
              className="min-h-[52px] w-full rounded-[13px] border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-950 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-cyan-100/80 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </label>
        </div>
        {error ? (
          <p
            id="phone-auth-error"
            className="text-sm font-medium leading-5 text-rose-600"
            role="alert"
          >
            {error}
          </p>
        ) : (
          <p id="phone-auth-helper" className="text-xs leading-5 text-slate-500">
            {t("auth.phoneRegionNotice")} {t("auth.smsRates")}
          </p>
        )}
        <button
          id="careai-phone-send-button"
          type="button"
          onClick={() => void sendCode()}
          disabled={sending}
          aria-busy={sending}
          className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[15px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-5 py-3 text-center text-[15px] font-bold leading-snug text-white shadow-[0_14px_32px_rgba(37,99,235,0.24)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:shadow-[0_18px_38px_rgba(37,99,235,0.3)] hover:brightness-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-75 motion-reduce:transform-none motion-reduce:transition-none"
        >
          {sending ? (
            <>
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              {t("auth.sendingCode")}
            </>
          ) : (
            t("auth.sendCode")
          )}
        </button>
        <div id="careai-phone-recaptcha" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={changePhoneNumber}
        disabled={verifying}
        className="inline-flex min-h-10 items-center gap-1 rounded-[11px] pr-2 text-sm font-bold text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> {t("auth.changePhone")}
      </button>
      <div>
        <h3 className="text-xl font-extrabold tracking-[-0.03em] text-slate-950">
          {t("auth.verifyPhone")}
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-600">
          {t("auth.sentCodeTo")}{" "}
          <span className="font-bold text-slate-800">{maskPhoneNumber(normalizedPhone)}</span>
        </p>
      </div>
      <div>
        <label htmlFor="phone-otp" className="mb-2 block text-[13px] font-bold text-slate-700">
          {t("auth.verificationCode")}
        </label>
        <InputOTP
          id="phone-otp"
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value.replace(/\D/g, ""))}
          disabled={verifying || verified}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "phone-auth-error" : undefined}
          containerClassName="grid grid-cols-6 gap-1.5 sm:gap-2"
          className="w-full"
        >
          <InputOTPGroup className="contents">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-12 w-full rounded-[12px] border border-slate-200 bg-white text-lg font-extrabold text-slate-950 shadow-sm focus-within:ring-4 focus-within:ring-cyan-100"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      {error ? (
        <p
          id="phone-auth-error"
          className="text-sm font-medium leading-5 text-rose-600"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => void verifyCode()}
        disabled={verifying || verified}
        aria-busy={verifying}
        className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[15px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-5 py-3 text-center text-[15px] font-bold leading-snug text-white shadow-[0_14px_32px_rgba(37,99,235,0.24)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:shadow-[0_18px_38px_rgba(37,99,235,0.3)] hover:brightness-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-75 motion-reduce:transform-none motion-reduce:transition-none"
      >
        {verifying ? (
          <>
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            {t("auth.verifying")}
          </>
        ) : verified ? (
          t("auth.verified")
        ) : (
          t("auth.verifyContinue")
        )}
      </button>
      <div className="text-center text-sm leading-6 text-slate-600">
        <span>{t("auth.didntReceive")} </span>
        <button
          type="button"
          onClick={() => void sendCode(true)}
          disabled={sending || verifying || cooldown > 0}
          className="font-bold text-blue-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
        >
          {cooldown > 0 ? t("auth.resendIn", { seconds: cooldown }) : t("auth.resendCode")}
        </button>
      </div>
      <div id="careai-phone-recaptcha" />
    </div>
  );
}

function TrustIndicators() {
  const { t } = useTranslation();
  const indicators = [t("auth.secure"), t("auth.private"), t("auth.fast")];
  return (
    <div className="space-y-3.5">
      <p className="flex items-center justify-center gap-2 text-center text-[12px] leading-5 text-slate-600">
        <LockKeyhole className="size-3.5 shrink-0 text-cyan-600" aria-hidden="true" />
        <span>{t("auth.secureSignIn")}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-slate-600">
        {indicators.map((label) => (
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
  const { t } = useTranslation();
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
            {t("auth.privateBadge")}
          </div>

          <h2
            id="login-heading"
            className="auth-panel-title mt-3 text-[clamp(2rem,8vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-slate-950 lg:mt-4 lg:text-[clamp(2.75rem,4vw,3.5rem)]"
          >
            {t("auth.welcomeBack")}
          </h2>
          <p className="myanmar-readable mt-2 text-[15px] leading-6 text-slate-600 sm:text-base">
            {t("auth.subtitle")}
          </p>
        </div>

        <div className="mt-2 lg:hidden">
          <MobileDoctorScene />
        </div>

        <div className="mt-3 rounded-[26px] border border-white/85 bg-white/[0.78] p-5 shadow-[0_18px_58px_rgba(31,72,116,0.10)] backdrop-blur-lg sm:mt-5 sm:p-6 md:mx-auto md:max-w-[440px] lg:mt-6 lg:max-w-none lg:p-7">
          <GoogleSignInButton pending={pending} onSignIn={onSignIn} />
          <PhoneAuthFlow googlePending={pending} />

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
          <p className="text-[12px] leading-[1.65] text-slate-600">
            {t("medical.shortDisclaimer")}
          </p>

          <Link
            to="/"
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("common.backToHome")}
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
