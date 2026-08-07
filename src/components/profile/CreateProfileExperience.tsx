import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  LockKeyhole,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AICareLogo } from "@/components/auth/AICareLogo";
import { useAuth, type AppUser } from "@/lib/auth-context";
import {
  useProfile,
  type BloodType,
  type ProfileInput,
  type ProfileSex,
} from "@/lib/profile-context";
import profileDoctor from "@/assets/profile-doctor-clipboard.png";

type FieldErrors = Partial<Record<keyof ProfileDraft, string>>;

type ProfileDraft = {
  displayName: string;
  dateOfBirth: string;
  sex: ProfileSex | "";
  heightCm: string;
  weightKg: string;
  bloodType: BloodType | "";
};

const SEX_OPTIONS: Array<{ value: ProfileSex; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const BLOOD_TYPES: Array<{ value: BloodType; label: string }> = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A−" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B−" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB−" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O−" },
  { value: "unknown", label: "Unknown" },
];

const fieldClassName =
  "h-[50px] w-full rounded-[13px] border border-slate-200 bg-white px-4 text-base font-medium text-slate-950 outline-none transition-[border-color,box-shadow] placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-cyan-100/80 disabled:cursor-not-allowed disabled:bg-slate-50";

function validateProfile(draft: ProfileDraft): FieldErrors {
  const errors: FieldErrors = {};
  const displayName = draft.displayName.trim();
  const height = Number(draft.heightCm);
  const weight = Number(draft.weightKg);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (!displayName) errors.displayName = "Please enter your display name.";
  else if (displayName.length < 2 || displayName.length > 50) {
    errors.displayName = "Display name should be between 2 and 50 characters.";
  }

  if (!draft.dateOfBirth) errors.dateOfBirth = "Please enter your date of birth.";
  else if (Number.isNaN(Date.parse(`${draft.dateOfBirth}T00:00:00`))) {
    errors.dateOfBirth = "Please enter a valid date of birth.";
  } else if (new Date(`${draft.dateOfBirth}T00:00:00`) > today) {
    errors.dateOfBirth = "Date of birth cannot be in the future.";
  }

  if (!draft.sex) errors.sex = "Please select an option.";

  if (!draft.heightCm || !Number.isFinite(height) || height < 50 || height > 250) {
    errors.heightCm = "Please enter a valid height between 50 and 250 cm.";
  }

  if (!draft.weightKg || !Number.isFinite(weight) || weight < 2 || weight > 500) {
    errors.weightKg = "Please enter a valid weight between 2 and 500 kg.";
  }

  return errors;
}

function FieldLabel({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label className="text-[13px] font-bold uppercase tracking-[0.09em] text-slate-600">
        {children}
      </label>
      {optional && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          Optional
        </span>
      )}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] font-medium text-rose-600" role="alert">
      {message}
    </p>
  );
}

function ProfileInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  max,
  autoComplete,
  onBlur,
}: {
  id: keyof ProfileDraft;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "date";
  placeholder?: string;
  max?: string;
  autoComplete?: string;
  onBlur: () => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        max={max}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`${fieldClassName} ${error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : ""}`}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function UnitInput({
  id,
  label,
  value,
  unit,
  placeholder,
  error,
  onChange,
  decimal = false,
  onBlur,
}: {
  id: "heightCm" | "weightKg";
  label: string;
  value: string;
  unit: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
  decimal?: boolean;
  onBlur: () => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <input
          id={id}
          name={id}
          type="number"
          inputMode={decimal ? "decimal" : "numeric"}
          step={decimal ? "0.1" : "1"}
          min={id === "heightCm" ? "50" : "2"}
          max={id === "heightCm" ? "250" : "500"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${fieldClassName} pr-14 ${error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : ""}`}
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">
          {unit}
        </span>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function SexSelector({
  value,
  onChange,
  error,
}: {
  value: ProfileSex | "";
  onChange: (value: ProfileSex) => void;
  error?: string;
}) {
  return (
    <fieldset id="sex" tabIndex={-1} className="min-w-0" aria-describedby={error ? "sex-error" : undefined}>
      <legend className="mb-2 text-[13px] font-bold uppercase tracking-[0.09em] text-slate-600">Sex</legend>
      <div className="flex flex-wrap gap-1.5 rounded-[14px] border border-slate-200 bg-slate-50/90 p-1.5 md:flex-nowrap md:gap-1">
        {SEX_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`min-h-[36px] min-w-[82px] flex-1 rounded-[10px] border px-1.5 text-[12px] font-semibold leading-tight transition-[background-color,border-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 active:scale-[0.98] md:min-w-0 md:text-[11px] xl:text-[12px] ${
                selected
                  ? "border-blue-200 bg-blue-50 text-slate-900 shadow-[0_2px_10px_rgba(59,130,246,0.11)]"
                  : "border-transparent text-slate-600 hover:bg-white/70 hover:text-slate-900"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <FieldError id="sex-error" message={error} />
    </fieldset>
  );
}

function BloodTypeSelector({
  value,
  onChange,
}: {
  value: BloodType | "";
  onChange: (value: BloodType | "") => void;
}) {
  return (
    <div>
      <FieldLabel optional>Blood type</FieldLabel>
      <div className="relative">
        <select
          id="bloodType"
          name="bloodType"
          value={value}
          onChange={(event) => onChange(event.target.value as BloodType | "")}
          className={`${fieldClassName} appearance-none pr-11`}
        >
          <option value="">Select if known</option>
          {BLOOD_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

function GoogleAccountPreview({ user }: { user: AppUser }) {
  const initials = useMemo(
    () =>
      user.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "AI",
    [user.name],
  );

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[15px] border border-sky-100 bg-sky-50/65 px-3 py-2.5">
      <div className="relative size-11 shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="size-11 rounded-full border-2 border-white object-cover shadow-sm"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-bold text-white shadow-sm">
            {initials}
          </span>
        )}
        <span className="absolute -bottom-0.5 -right-0.5 grid size-[18px] place-items-center rounded-full border-2 border-white bg-white text-[10px] font-extrabold text-blue-600 shadow-sm">
          G
        </span>
      </div>
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
      </div>
      <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 sm:flex">
        <Check className="size-3.5" /> Google account
      </span>
      <CheckCircle2 className="size-5 shrink-0 text-emerald-500 sm:hidden" aria-label="Google account verified" />
    </div>
  );
}

function ProfileBenefitCard({
  icon,
  title,
  detail,
  className,
  primary = false,
  delay = 0,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  className: string;
  primary?: boolean;
  delay?: number;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <motion.div
      data-profile-benefit={title}
      className={`absolute z-20 flex w-[168px] items-center gap-2.5 rounded-[16px] border border-white/90 bg-white/85 px-3 py-2.5 text-slate-900 shadow-[0_14px_34px_rgba(50,95,145,0.12)] backdrop-blur-lg ${className} ${primary ? "ring-1 ring-cyan-100" : ""}`}
      initial={{ opacity: 0, y: 7 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -3, 0] }}
      transition={
        reducedMotion
          ? { duration: 0.2, delay }
          : {
              opacity: { duration: 0.4, delay },
              y: { duration: primary ? 7.4 : 8.2, repeat: Infinity, ease: "easeInOut", delay },
            }
      }
    >
      <span
        className={`grid size-8 shrink-0 place-items-center rounded-full ${primary ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white" : "bg-sky-50 text-blue-500"}`}
      >
        {icon}
      </span>
      <span className="leading-tight">
        <span className="block whitespace-nowrap text-xs font-bold">{title}</span>
        <span className="mt-0.5 block whitespace-nowrap text-[10px] font-medium text-slate-500">
          {detail}
        </span>
      </span>
    </motion.div>
  );
}

function DoctorIllustration({ mobile = false }: { mobile?: boolean }) {
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <motion.img
      data-profile-doctor
      src={profileDoctor}
      alt="AICare doctor welcoming you to create your health profile"
      draggable="false"
      loading="eager"
      className={
        mobile
          ? "relative z-10 h-[170px] w-auto max-w-[80%] select-none object-contain"
          : "relative z-10 h-[clamp(350px,43vh,405px)] w-auto max-h-full max-w-full select-none object-contain"
      }
      initial={{ opacity: 0, y: 8 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -4, 0] }}
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : { opacity: { duration: 0.5 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }
      }
    />
  );
}

function ProfileVisual() {
  return (
    <section className="hidden min-w-0 flex-col justify-center lg:flex" aria-labelledby="profile-welcome-title">
      <div className="max-w-[480px]">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/75 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600 shadow-sm backdrop-blur-md">
          <Sparkles className="size-3.5 text-cyan-500" /> Personalized for you
        </span>
        <h1
          id="profile-welcome-title"
          className="mt-5 text-[clamp(42px,4vw,58px)] font-extrabold leading-[0.98] tracking-[-0.055em] text-slate-950"
        >
          Let&apos;s get to
          <br />
          <span className="text-gradient">know you.</span>
        </h1>
        <p className="mt-5 max-w-[430px] text-[15px] leading-7 text-slate-600 xl:text-base">
          A few details help AICare personalize your health insights and experience.
        </p>
      </div>

      <div className="profile-doctor-scene relative mt-3 flex h-[410px] max-w-[560px] items-center justify-center overflow-visible pl-[8%]">
        <div className="profile-doctor-glow pointer-events-none absolute left-1/2 top-1/2 h-[390px] w-[440px] -translate-x-1/2 -translate-y-1/2" />
        <DoctorIllustration />
        <ProfileBenefitCard
          icon={<Sparkles className="size-4" />}
          title="Personalized insights"
          detail="Tailored to you"
          className="left-[0%] top-[7%]"
          primary
          delay={0.15}
        />
        <ProfileBenefitCard
          icon={<ShieldCheck className="size-4" />}
          title="Private & secure"
          detail="Your data, protected"
          className="bottom-[7%] right-[0%]"
          delay={0.3}
        />
      </div>
    </section>
  );
}

function MobileWelcomeVisual() {
  return (
    <div className="profile-mobile-scene relative mt-3 flex h-[178px] items-end justify-center overflow-hidden rounded-[20px] lg:hidden">
      <div className="profile-doctor-glow pointer-events-none absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2" />
      <div className="translate-x-[32%]">
        <DoctorIllustration mobile />
      </div>
      <ProfileBenefitCard
        icon={<Sparkles className="size-3.5" />}
        title="Personalized for you"
        detail="A healthier experience"
        className="left-[1%] top-[4%] origin-top-left scale-[0.84]"
        primary
        delay={0.15}
      />
    </div>
  );
}

function ProfileSuccess() {
  const reducedMotion = Boolean(useReducedMotion());
  return (
    <motion.div
      className="flex min-h-[520px] flex-col items-center justify-center px-4 text-center"
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.35 }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_22px_55px_rgba(34,211,238,0.28)]"
        initial={{ scale: reducedMotion ? 1 : 0.75 }}
        animate={{ scale: 1 }}
        transition={{ duration: reducedMotion ? 0.15 : 0.45, type: "spring", bounce: 0.25 }}
      >
        <Check className="size-9" strokeWidth={2.5} />
      </motion.div>
      <h2 className="mt-7 text-3xl font-extrabold tracking-[-0.04em] text-slate-950">Profile created!</h2>
      <p className="mt-2 text-base text-slate-500">Welcome to AICare.</p>
      <div className="mt-8 h-1.5 w-32 overflow-hidden rounded-full bg-sky-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: reducedMotion ? 0.1 : 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function ProfileForm({ user, onSuccess }: { user: AppUser; onSuccess: () => void }) {
  const { createProfile } = useProfile();
  const reducedMotion = Boolean(useReducedMotion());
  const [draft, setDraft] = useState<ProfileDraft>({
    displayName: user.name,
    dateOfBirth: "",
    sex: "",
    heightCm: "",
    weightKg: "",
    bloodType: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileDraft, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitLock = useRef(false);
  const today = new Date().toISOString().slice(0, 10);
  const validationErrors = useMemo(() => validateProfile(draft), [draft]);

  function updateField<K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: keyof ProfileDraft) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function visibleError(field: keyof ProfileDraft) {
    return touched[field] || hasSubmitted ? validationErrors[field] : undefined;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;

    setHasSubmitted(true);
    setSubmitError(null);
    if (Object.keys(validationErrors).length > 0) {
      const firstInvalid = Object.keys(validationErrors)[0];
      window.requestAnimationFrame(() => document.getElementById(firstInvalid)?.focus());
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    const input: ProfileInput = {
      displayName: draft.displayName.trim(),
      dateOfBirth: draft.dateOfBirth,
      sex: draft.sex as ProfileSex,
      heightCm: Number(draft.heightCm),
      weightKg: Number(draft.weightKg),
      ...(draft.bloodType ? { bloodType: draft.bloodType } : {}),
    };

    try {
      await createProfile(input);
      onSuccess();
    } catch {
      submitLock.current = false;
      setSubmitting(false);
      setSubmitError("We couldn't create your profile. Please try again.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.15 : 0.5, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-4">
        <AICareLogo compact />
        <div className="pt-1 text-right">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-blue-600">Profile setup</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-400">Step 1 of 1</p>
        </div>
      </div>

      <div className="profile-form-heading mt-6 lg:mt-4">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.045em] text-slate-950 sm:text-[34px] lg:text-[36px]">
          Create your profile
        </h1>
        <p className="mt-2.5 max-w-[500px] text-sm leading-6 text-slate-500 sm:text-[15px] lg:mt-1.5">
          <span className="lg:hidden">Let&apos;s personalize your experience.</span>
          <span className="hidden lg:inline">
            Tell us a little about yourself so we can personalize your AICare experience.
          </span>
        </p>
      </div>

      <MobileWelcomeVisual />

      <div className="mt-4 lg:mt-3">
        <GoogleAccountPreview user={user} />
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} noValidate className="mt-5 space-y-4 lg:mt-3 lg:space-y-3">
        <ProfileInput
          id="displayName"
          label="Display name"
          value={draft.displayName}
          onChange={(value) => updateField("displayName", value)}
          onBlur={() => markTouched("displayName")}
          placeholder="How should we address you?"
          autoComplete="name"
          error={visibleError("displayName")}
        />

        <div className="grid gap-5 md:grid-cols-[0.78fr_1.22fr]">
          <ProfileInput
            id="dateOfBirth"
            label="Date of birth"
            value={draft.dateOfBirth}
            onChange={(value) => updateField("dateOfBirth", value)}
            onBlur={() => markTouched("dateOfBirth")}
            type="date"
            max={today}
            autoComplete="bday"
            error={visibleError("dateOfBirth")}
          />
          <SexSelector
            value={draft.sex}
            onChange={(value) => {
              updateField("sex", value);
              markTouched("sex");
            }}
            error={visibleError("sex")}
          />
        </div>

        <div className="profile-measurement-grid grid grid-cols-1 gap-4 md:grid-cols-2">
          <UnitInput
            id="heightCm"
            label="Height"
            value={draft.heightCm}
            unit="cm"
            placeholder="170"
            onChange={(value) => updateField("heightCm", value)}
            onBlur={() => markTouched("heightCm")}
            error={visibleError("heightCm")}
          />
          <UnitInput
            id="weightKg"
            label="Weight"
            value={draft.weightKg}
            unit="kg"
            placeholder="65"
            decimal
            onChange={(value) => updateField("weightKg", value)}
            onBlur={() => markTouched("weightKg")}
            error={visibleError("weightKg")}
          />
        </div>

        <BloodTypeSelector
          value={draft.bloodType}
          onChange={(value) => updateField("bloodType", value)}
        />

        {submitError && (
          <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
            {submitError}
          </p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-[15px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-5 text-[15px] font-bold text-white shadow-[0_14px_32px_rgba(37,99,235,0.24)] transition-[transform,box-shadow,filter] duration-200 hover:-translate-y-px hover:shadow-[0_18px_38px_rgba(37,99,235,0.3)] hover:brightness-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-75"
          >
            {submitting ? (
              <>
                <LoaderCircle className="size-5 animate-spin" /> Creating your profile...
              </>
            ) : (
              <>
                Create Profile &amp; Continue
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
          <p className="mt-3.5 flex items-start justify-center gap-2 px-1 text-center text-[11px] leading-[1.55] text-slate-500 sm:text-xs">
            <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-blue-500" />
            <span>
              Your information is used to personalize your AICare experience and is handled according to our privacy practices.
            </span>
          </p>
        </div>
      </form>
    </motion.div>
  );
}

export function CreateProfileExperience({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timeout = window.setTimeout(onComplete, 850);
    return () => window.clearTimeout(timeout);
  }, [success, onComplete]);

  if (!user) return null;

  return (
    <main className="profile-page min-h-[100dvh] overflow-x-clip">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 items-center gap-10 px-4 py-5 sm:px-7 sm:py-7 md:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-8 lg:py-6 xl:gap-16 xl:px-12">
        <ProfileVisual />
        <section
          className="profile-form-panel relative mx-auto w-full max-w-[600px] rounded-[24px] border border-white/85 bg-white/[0.82] p-5 shadow-[0_24px_70px_rgba(44,83,130,0.13)] backdrop-blur-xl sm:rounded-[28px] sm:p-8 lg:p-7"
          aria-label="Create your AICare profile"
        >
          {success ? <ProfileSuccess /> : <ProfileForm user={user} onSuccess={() => setSuccess(true)} />}
        </section>
      </div>
    </main>
  );
}
