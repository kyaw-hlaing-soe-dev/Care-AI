import { CalendarDays, Check, LockKeyhole, Ruler, Scale, UserRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CareAILogo } from "@/components/auth/CareAILogo";
import { GlassCard } from "@/components/glass/GlassCard";
import { glassButtonVariants } from "@/components/glass/GlassButton";
import type { AppUser } from "@/lib/auth-context";
import type { ProfileSex, UserProfile } from "@/lib/profile-context";

const SEX_LABELS: Record<ProfileSex, string> = {
  male: "Male",
  female: "Female",
  "prefer-not-to-say": "Prefer not to say",
};

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

function ProfileAvatar({ user, name }: { user: AppUser; name: string }) {
  return user.avatar ? (
    <img
      src={user.avatar}
      alt={`${name}'s Google profile avatar`}
      referrerPolicy="no-referrer"
      className="size-20 shrink-0 rounded-[24px] border-4 border-white object-cover shadow-[0_14px_34px_rgba(37,99,235,0.18)] sm:size-24"
    />
  ) : (
    <span
      className="grid size-20 shrink-0 place-items-center rounded-[24px] border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl font-extrabold text-white shadow-[0_14px_34px_rgba(37,99,235,0.18)] sm:size-24"
      role="img"
      aria-label={`${name}'s profile avatar`}
    >
      {initials(name)}
    </span>
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

export function ProfileDetails({ user, profile }: { user: AppUser; profile: UserProfile }) {
  const displayName = profile.displayName?.trim() || user.name;
  const memberSince = formatMemberSince(profile.createdAt);
  const details = [
    { label: "Date of Birth", value: formatDate(profile.dateOfBirth), Icon: CalendarDays },
    { label: "Sex", value: SEX_LABELS[profile.sex] ?? "Not provided", Icon: UserRound },
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
    <div className="mx-auto max-w-[1040px] space-y-6 sm:space-y-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
            Personal profile
          </p>
          <h1 className="mt-2 text-[clamp(2rem,5vw,2.6rem)] font-extrabold tracking-[-0.045em] text-slate-950">
            My Profile
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
            View your personal information used to personalize your CareAI experience.
          </p>
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

      <GlassCard strong className="app-card overflow-hidden p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <ProfileAvatar user={user} name={displayName} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <h2 className="max-w-full break-words text-2xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-[28px]">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <Check className="size-3.5" aria-hidden="true" /> Google Account
              </span>
            </div>
            <p className="mt-2 max-w-full break-all text-sm text-slate-500 sm:text-[15px]">
              {user.email}
            </p>
            {memberSince ? (
              <p className="mt-2 text-xs font-medium text-slate-400">Member since {memberSince}</p>
            ) : null}
          </div>
        </div>
      </GlassCard>

      <GlassCard strong className="app-card p-5 sm:p-7 lg:p-8">
        <div className="mb-5">
          <h2 className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-2xl">
            Personal Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Information saved during your CareAI profile setup.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {details.map((detail) => (
            <DetailItem key={detail.label} {...detail} />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="app-card flex items-start gap-3 p-5 sm:p-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-blue-50 text-blue-500">
          <LockKeyhole className="size-4.5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-extrabold text-slate-950">Your Profile &amp; Privacy</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Your profile information is used to personalize your CareAI experience.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-[1040px] space-y-6" aria-label="Loading profile" aria-busy="true">
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded bg-blue-100" />
        <div className="h-11 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 max-w-xl animate-pulse rounded bg-slate-100" />
      </div>
      <div className="app-card rounded-[24px] p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <div className="size-20 animate-pulse rounded-[24px] bg-slate-200 sm:size-24" />
          <div className="w-full space-y-3">
            <div className="mx-auto h-7 w-44 animate-pulse rounded bg-slate-200 sm:mx-0" />
            <div className="mx-auto h-4 w-56 max-w-full animate-pulse rounded bg-slate-100 sm:mx-0" />
          </div>
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
