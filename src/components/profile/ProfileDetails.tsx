import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Languages,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Pencil,
  Ruler,
  Scale,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { CareAILogo } from "@/components/auth/CareAILogo";
import { GlassCard } from "@/components/glass/GlassCard";
import { glassButtonVariants } from "@/components/glass/GlassButton";
import { useAuth, type AppUser } from "@/lib/auth-context";
import {
  useProfile,
  type PreferredLanguage,
  type ProfileSex,
  type UserProfile,
} from "@/lib/profile-context";
import {
  BLOOD_TYPES,
  SEX_OPTIONS,
  draftToProfileInput,
  profileToDraft,
  validateProfile,
  type ProfileDraft,
} from "@/lib/profile-validation";
import { cn } from "@/lib/utils";

type ProfileSection = "overview" | "edit" | "preferences" | "privacy";

const PROFILE_SECTIONS: Array<{
  id: ProfileSection;
  label: string;
  Icon: typeof UserRound;
}> = [
  { id: "overview", label: "Overview", Icon: CircleUserRound },
  { id: "edit", label: "Edit Profile", Icon: Pencil },
  { id: "preferences", label: "Preferences", Icon: Settings2 },
  { id: "privacy", label: "Account & Privacy", Icon: LockKeyhole },
];

const LANGUAGE_OPTIONS: Array<{
  value: PreferredLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "my", label: "Myanmar", nativeLabel: "မြန်မာ" },
  { value: "zh-CN", label: "Simplified Chinese", nativeLabel: "简体中文" },
];

const SEX_LABELS: Record<ProfileSex, string> = {
  male: "Male",
  female: "Female",
  "prefer-not-to-say": "Prefer not to say",
};

const fieldClassName =
  "h-[52px] w-full rounded-[13px] border border-slate-200 bg-white px-4 text-base font-medium text-slate-950 outline-none transition-[border-color,box-shadow] placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-cyan-100/80 disabled:cursor-not-allowed disabled:bg-slate-50";

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
}

function formatMemberSince(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(date);
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "C"
  );
}

function sectionFromHash(): ProfileSection {
  if (typeof window === "undefined") return "overview";
  const hash = window.location.hash.replace("#", "");
  return PROFILE_SECTIONS.some((section) => section.id === hash)
    ? (hash as ProfileSection)
    : "overview";
}

function ProfileAvatar({ user, name }: { user: AppUser; name: string }) {
  return user.avatar ? (
    <img
      src={user.avatar}
      alt={`${name}'s Google profile avatar`}
      referrerPolicy="no-referrer"
      className="mx-auto size-20 shrink-0 rounded-full border-4 border-white object-cover shadow-[0_14px_34px_rgba(37,99,235,0.18)] sm:size-24"
    />
  ) : (
    <span
      className="mx-auto grid size-20 shrink-0 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-extrabold text-white shadow-[0_14px_34px_rgba(37,99,235,0.18)] sm:size-24"
      role="img"
      aria-label={`${name}'s profile avatar`}
    >
      {initials(name)}
    </span>
  );
}

function completionFor(profile: UserProfile) {
  const required = [
    Boolean(profile.displayName?.trim()),
    Boolean(profile.dateOfBirth),
    Boolean(profile.sex),
    Number.isFinite(profile.heightCm) && profile.heightCm > 0,
    Number.isFinite(profile.weightKg) && profile.weightKg > 0,
  ];
  const complete = required.filter(Boolean).length;
  return {
    complete,
    total: required.length,
    percent: Math.round((complete / required.length) * 100),
  };
}

function ProfileSidebar({
  user,
  profile,
  activeSection,
  onSectionChange,
}: {
  user: AppUser;
  profile: UserProfile;
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
}) {
  const displayName = profile.displayName?.trim() || user.name;
  const completion = completionFor(profile);
  const isComplete = completion.percent === 100;

  return (
    <GlassCard
      strong
      className="app-card overflow-hidden p-4 sm:p-5 lg:sticky lg:top-24 lg:self-start"
    >
      <div className="rounded-[20px] bg-gradient-to-br from-blue-50/90 via-white to-cyan-50/70 px-4 py-5 text-center">
        <ProfileAvatar user={user} name={displayName} />
        <h2 className="mx-auto mt-4 max-w-full break-words text-xl font-extrabold tracking-[-0.03em] text-slate-950">
          {displayName}
        </h2>
        <p className="mt-1 break-all text-xs leading-5 text-slate-500">{user.email}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
          <Check className="size-3.5" aria-hidden="true" /> Google Account
        </span>
      </div>

      <div className="mt-4 rounded-[16px] border border-slate-100 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">
            Profile completion
          </p>
          <span className="text-sm font-extrabold text-blue-600">{completion.percent}%</span>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80"
          role="progressbar"
          aria-label="Profile completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completion.percent}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-500"
            style={{ width: `${completion.percent}%` }}
          />
        </div>
        <div className="mt-3 flex items-start gap-2">
          <CheckCircle2
            className={cn(
              "mt-0.5 size-4 shrink-0",
              isComplete ? "text-emerald-500" : "text-blue-500",
            )}
            aria-hidden="true"
          />
          <p className="text-xs leading-5 text-slate-500">
            {isComplete
              ? "All required profile details are complete."
              : `${completion.total - completion.complete} required ${completion.total - completion.complete === 1 ? "detail" : "details"} remaining.`}
          </p>
        </div>
        {!isComplete ? (
          <button
            type="button"
            onClick={() => onSectionChange("edit")}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[13px] bg-blue-50 px-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            Complete profile <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav
        className="mt-4 grid grid-cols-2 gap-2 lg:flex lg:flex-col"
        aria-label="Profile sections"
      >
        {PROFILE_SECTIONS.map((section) => {
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-11 w-full items-center justify-start gap-2 rounded-[13px] px-3 text-left text-[13px] font-bold leading-4 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 sm:gap-2.5 sm:px-3.5 sm:text-sm",
                active
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              <section.Icon className="size-4.5" aria-hidden="true" />
              {section.label}
            </button>
          );
        })}
      </nav>
    </GlassCard>
  );
}

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function DetailItem({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: typeof UserRound;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-[16px] border border-slate-100 bg-slate-50/65 p-4 sm:p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-blue-50 text-blue-500">
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-base font-semibold text-slate-950 sm:text-[17px]">
          {value}
        </p>
      </div>
    </div>
  );
}

function OverviewSection({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
  const details = [
    { label: "Date of Birth", value: formatDate(profile.dateOfBirth), Icon: CalendarDays },
    {
      label: "Sex",
      value: profile.sex ? SEX_LABELS[profile.sex] : "Not provided",
      Icon: UserRound,
    },
    {
      label: "Height",
      value: Number.isFinite(profile.heightCm) ? `${profile.heightCm} cm` : "Not provided",
      Icon: Ruler,
    },
    {
      label: "Weight",
      value: Number.isFinite(profile.weightKg) ? `${profile.weightKg} kg` : "Not provided",
      Icon: Scale,
    },
    {
      label: "Blood Type",
      value: profile.bloodType
        ? profile.bloodType === "unknown"
          ? "Unknown"
          : profile.bloodType
        : "Not provided",
      Icon: Check,
    },
  ];

  return (
    <GlassCard strong className="app-card p-5 sm:p-7 lg:p-8">
      <SectionHeading
        title="Personal Details"
        description="The information CareAI uses to personalize your health experience."
        action={
          <button
            type="button"
            onClick={onEdit}
            className={glassButtonVariants({
              variant: "glass",
              size: "md",
              className: "w-full sm:w-auto",
            })}
          >
            <Pencil className="size-4" aria-hidden="true" /> Edit Profile
          </button>
        }
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {details.map((detail) => (
          <DetailItem key={detail.label} {...detail} />
        ))}
      </div>
    </GlassCard>
  );
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-bold uppercase tracking-[0.09em] text-slate-600"
      >
        {children}
      </label>
      {optional ? (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          Optional
        </span>
      ) : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[13px] font-medium text-rose-600" role="alert">
      {message}
    </p>
  );
}

function EditProfileSection({ profile, onDone }: { profile: UserProfile; onDone: () => void }) {
  const { updateProfile } = useProfile();
  const [draft, setDraft] = useState<ProfileDraft>(() => profileToDraft(profile));
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileDraft, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);
  const errors = useMemo(() => validateProfile(draft), [draft]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => setDraft(profileToDraft(profile)), [profile]);

  function setField<K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function visibleError(field: keyof ProfileDraft) {
    return touched[field] || submitted ? errors[field] : undefined;
  }

  function cancel() {
    setDraft(profileToDraft(profile));
    setTouched({});
    setSubmitted(false);
    onDone();
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveLock.current) return;
    setSubmitted(true);
    if (Object.keys(errors).length) {
      const first = Object.keys(errors)[0];
      if (first)
        window.requestAnimationFrame(() => document.getElementById(`edit-${first}`)?.focus());
      return;
    }

    saveLock.current = true;
    setSaving(true);
    try {
      await updateProfile(draftToProfileInput(draft));
      toast.success("Profile updated.");
      onDone();
    } catch {
      toast.error("We couldn't update your profile. Please try again.");
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  return (
    <GlassCard strong className="app-card p-5 sm:p-7 lg:p-8">
      <SectionHeading
        title="Edit Profile"
        description="Update the personal details used to personalize your CareAI experience."
      />
      <form className="mt-6 space-y-5" onSubmit={(event) => void submit(event)} noValidate>
        <div>
          <FieldLabel htmlFor="edit-displayName">Display Name</FieldLabel>
          <input
            id="edit-displayName"
            value={draft.displayName}
            onChange={(event) => setField("displayName", event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, displayName: true }))}
            aria-invalid={Boolean(visibleError("displayName"))}
            aria-describedby={visibleError("displayName") ? "edit-displayName-error" : undefined}
            className={fieldClassName}
            autoComplete="name"
            disabled={saving}
          />
          <FieldError id="edit-displayName-error" message={visibleError("displayName")} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="edit-dateOfBirth">Date of Birth</FieldLabel>
            <input
              id="edit-dateOfBirth"
              type="date"
              max={today}
              value={draft.dateOfBirth}
              onChange={(event) => setField("dateOfBirth", event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, dateOfBirth: true }))}
              aria-invalid={Boolean(visibleError("dateOfBirth"))}
              aria-describedby={visibleError("dateOfBirth") ? "edit-dateOfBirth-error" : undefined}
              className={fieldClassName}
              disabled={saving}
            />
            <FieldError id="edit-dateOfBirth-error" message={visibleError("dateOfBirth")} />
          </div>
          <fieldset>
            <legend className="mb-2 text-[13px] font-bold uppercase tracking-[0.09em] text-slate-600">
              Sex
            </legend>
            <div
              className="grid min-h-[52px] grid-cols-3 overflow-hidden rounded-[13px] border border-slate-200 bg-slate-50 p-1"
              aria-describedby={visibleError("sex") ? "edit-sex-error" : undefined}
            >
              {SEX_OPTIONS.map((option) => {
                const selected = draft.sex === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setField("sex", option.value);
                      setTouched((current) => ({ ...current, sex: true }));
                    }}
                    className={cn(
                      "min-h-10 rounded-[10px] px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200",
                      selected
                        ? "border border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                        : "text-slate-500 hover:bg-white hover:text-slate-800",
                    )}
                    aria-pressed={selected}
                    disabled={saving}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <FieldError id="edit-sex-error" message={visibleError("sex")} />
          </fieldset>
        </div>

        <div className="grid gap-5 min-[390px]:grid-cols-2">
          {(
            [
              ["heightCm", "Height", "170", "cm", "numeric"],
              ["weightKg", "Weight", "65", "kg", "decimal"],
            ] as const
          ).map(([field, label, placeholder, unit, inputMode]) => (
            <div key={field}>
              <FieldLabel htmlFor={`edit-${field}`}>{label}</FieldLabel>
              <div className="relative">
                <input
                  id={`edit-${field}`}
                  type="number"
                  inputMode={inputMode}
                  step={field === "weightKg" ? "0.1" : "1"}
                  value={draft[field]}
                  placeholder={placeholder}
                  onChange={(event) => setField(field, event.target.value)}
                  onBlur={() => setTouched((current) => ({ ...current, [field]: true }))}
                  aria-invalid={Boolean(visibleError(field))}
                  aria-describedby={visibleError(field) ? `edit-${field}-error` : undefined}
                  className={cn(fieldClassName, "pr-12")}
                  disabled={saving}
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-bold text-slate-400">
                  {unit}
                </span>
              </div>
              <FieldError id={`edit-${field}-error`} message={visibleError(field)} />
            </div>
          ))}
        </div>

        <div>
          <FieldLabel htmlFor="edit-bloodType" optional>
            Blood Type
          </FieldLabel>
          <select
            id="edit-bloodType"
            value={draft.bloodType}
            onChange={(event) =>
              setField("bloodType", event.target.value as ProfileDraft["bloodType"])
            }
            className={fieldClassName}
            disabled={saving}
          >
            <option value="">Not provided</option>
            {BLOOD_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={cancel}
            disabled={saving}
            className={glassButtonVariants({
              variant: "glass",
              size: "md",
              className: "w-full sm:w-auto",
            })}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={glassButtonVariants({
              size: "md",
              className: "w-full sm:min-w-40 sm:w-auto",
            })}
          >
            {saving ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Saving changes…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </GlassCard>
  );
}

function PreferencesSection({ profile }: { profile: UserProfile }) {
  const { updatePreferredLanguage } = useProfile();
  const savedLanguage = profile.preferredLanguage ?? "en";
  const [selectedLanguage, setSelectedLanguage] = useState<PreferredLanguage>(savedLanguage);
  const [saving, setSaving] = useState(false);

  useEffect(() => setSelectedLanguage(savedLanguage), [savedLanguage]);

  async function savePreferences() {
    if (selectedLanguage === savedLanguage || saving) return;
    setSaving(true);
    try {
      await updatePreferredLanguage(selectedLanguage);
      toast.success("Preferences saved.");
    } catch {
      toast.error("We couldn't save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <GlassCard strong className="app-card p-5 sm:p-7 lg:p-8">
      <SectionHeading
        title="Preferences"
        description="Choose how CareAI presents your account experience."
      />
      <fieldset className="mt-6">
        <legend className="flex items-center gap-2 text-base font-extrabold text-slate-950">
          <Languages className="size-5 text-blue-500" aria-hidden="true" /> Preferred language
        </legend>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Choose from the languages currently supported by CareAI.
        </p>
        <div
          className="mt-4 grid gap-3 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Preferred language"
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const selected = selectedLanguage === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSelectedLanguage(option.value)}
                className={cn(
                  "min-h-24 rounded-[16px] border p-4 text-left transition-[border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200",
                  selected
                    ? "border-blue-300 bg-blue-50 shadow-[0_8px_22px_rgba(37,99,235,0.1)]"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-950">{option.label}</span>
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full border",
                      selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300",
                    )}
                  >
                    {selected ? <Check className="size-3" aria-hidden="true" /> : null}
                  </span>
                </span>
                <span className="mt-2 block text-sm text-slate-500" lang={option.value}>
                  {option.nativeLabel}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
        <p className="text-xs leading-5 text-slate-500">
          Your preference is saved to your CareAI profile.
        </p>
        <button
          type="button"
          onClick={() => void savePreferences()}
          disabled={saving || selectedLanguage === savedLanguage}
          className={glassButtonVariants({ size: "md", className: "w-full sm:w-auto" })}
        >
          {saving ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Saving…
            </>
          ) : (
            "Save Preferences"
          )}
        </button>
      </div>
    </GlassCard>
  );
}

function PrivacySection({ user }: { user: AppUser }) {
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    await signOut();
  }

  return (
    <div className="space-y-5">
      <GlassCard strong className="app-card p-5 sm:p-7 lg:p-8">
        <SectionHeading
          title="Account & Privacy"
          description="Review your connected account and how your profile information is used."
        />
        <div className="mt-6 grid gap-3">
          <div className="flex flex-col gap-4 rounded-[16px] border border-slate-100 bg-slate-50/65 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-white text-blue-600 shadow-sm">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-950">Connected account</p>
                <p className="mt-0.5 break-all text-sm text-slate-500">Google · {user.email}</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <Check className="size-3.5" aria-hidden="true" /> Active
            </span>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="app-card flex items-start gap-3 p-5 sm:p-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-blue-50 text-blue-500">
          <LockKeyhole className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-extrabold text-slate-950">Your Data</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            CareAI uses your profile and health readings to personalize your experience and show
            your health history.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="app-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-extrabold text-slate-950">Sign out of CareAI</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            You can sign back in with your connected Google account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[13px] border border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 sm:w-auto"
        >
          {signingOut ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="size-4" aria-hidden="true" />
          )}{" "}
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </GlassCard>
    </div>
  );
}

export function ProfileDetails({ user, profile }: { user: AppUser; profile: UserProfile }) {
  const [activeSection, setActiveSection] = useState<ProfileSection>("overview");
  const memberSince = formatMemberSince(profile.createdAt);

  useEffect(() => {
    const syncFromHash = () => setActiveSection(sectionFromHash());
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectSection(section: ProfileSection) {
    setActiveSection(section);
    const nextUrl =
      section === "overview" ? window.location.pathname : `${window.location.pathname}#${section}`;
    window.history.replaceState(null, "", nextUrl);
    window.requestAnimationFrame(() => document.getElementById("profile-section-content")?.focus());
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 sm:space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
            Personal profile
          </p>
          <h1 className="mt-2 text-[clamp(2rem,5vw,2.6rem)] font-extrabold tracking-[-0.045em] text-slate-950">
            My Profile
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
            Manage your personal information and CareAI preferences.
          </p>
          {memberSince ? (
            <p className="mt-1 text-xs font-medium text-slate-400">Member since {memberSince}</p>
          ) : null}
        </div>
        <Link
          to="/dashboard"
          className={glassButtonVariants({
            variant: "glass",
            size: "md",
            className: "w-full sm:w-auto",
          })}
        >
          Back to Dashboard
        </Link>
      </header>

      <div className="grid gap-5 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start lg:gap-7 xl:grid-cols-[310px_minmax(0,1fr)]">
        <ProfileSidebar
          user={user}
          profile={profile}
          activeSection={activeSection}
          onSectionChange={selectSection}
        />
        <section
          id="profile-section-content"
          tabIndex={-1}
          className="min-w-0 scroll-mt-24 outline-none"
        >
          {activeSection === "overview" ? (
            <OverviewSection profile={profile} onEdit={() => selectSection("edit")} />
          ) : null}
          {activeSection === "edit" ? (
            <EditProfileSection profile={profile} onDone={() => selectSection("overview")} />
          ) : null}
          {activeSection === "preferences" ? <PreferencesSection profile={profile} /> : null}
          {activeSection === "privacy" ? <PrivacySection user={user} /> : null}
        </section>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6" aria-label="Loading profile" aria-busy="true">
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded bg-blue-100" />
        <div className="h-11 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 max-w-xl animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-7">
        <div className="app-card rounded-[24px] p-5">
          <div className="mx-auto size-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mx-auto mt-4 h-6 w-36 animate-pulse rounded bg-slate-200" />
          <div className="mx-auto mt-3 h-4 w-48 max-w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-7 h-24 animate-pulse rounded-[16px] bg-slate-100" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-11 animate-pulse rounded-[13px] bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="app-card rounded-[24px] p-6 sm:p-8">
          <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-[16px] bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <GlassCard strong className="app-card mx-auto max-w-xl p-8 text-center sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-rose-50 text-rose-500">
        <UserRound className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-slate-950">
        We couldn&apos;t load your profile.
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Please try again. Your account information has not been changed.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={glassButtonVariants({ size: "md", className: "mt-6" })}
      >
        Try Again
      </button>
    </GlassCard>
  );
}

export function IncompleteProfile() {
  return (
    <GlassCard strong className="app-card mx-auto max-w-xl p-8 text-center sm:p-10">
      <CareAILogo className="justify-center" />
      <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">
        Your CareAI profile isn&apos;t complete yet.
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Complete your profile to improve personalization.
      </p>
      <Link
        to="/create-profile"
        className={glassButtonVariants({ size: "lg", className: "mt-6 w-full sm:w-auto" })}
      >
        Create Profile
      </Link>
    </GlassCard>
  );
}
