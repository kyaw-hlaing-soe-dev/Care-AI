import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useBlocker } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FileHeart,
  Languages,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { CareAILogo } from "@/components/auth/CareAILogo";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassModal } from "@/components/glass/GlassModal";
import { glassButtonVariants } from "@/components/glass/GlassButton";
import { LanguageSelector } from "@/components/settings/LanguageSettings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth, type AppUser } from "@/lib/auth-context";
import { useProfile, type UserProfile } from "@/lib/profile-context";
import {
  BLOOD_TYPES,
  SEX_OPTIONS,
  draftToProfileInput,
  profileToDraft,
  validateProfile,
  type ProfileDraft,
} from "@/lib/profile-validation";
import { localeForLanguage, normalizeLanguage, SUPPORTED_LANGUAGES } from "@/i18n/languages";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type ProfileView = "overview" | "personal" | "edit" | "preferences" | "language" | "privacy";

export const PROFILE_VIEWS: readonly ProfileView[] = [
  "overview",
  "personal",
  "edit",
  "preferences",
  "language",
  "privacy",
] as const;

type ProfileNavView = Exclude<ProfileView, "edit" | "language">;

const NAV_ITEMS: Array<{
  id: ProfileNavView;
  labelKey: string;
  Icon: typeof UserRound;
}> = [
  { id: "overview", labelKey: "profile.overview", Icon: CircleUserRound },
  { id: "personal", labelKey: "profile.personalInformation", Icon: UserRound },
  { id: "preferences", labelKey: "profile.preferences", Icon: Languages },
  { id: "privacy", labelKey: "profile.privacySecurity", Icon: LockKeyhole },
];

const fieldClassName =
  "min-h-[52px] w-full rounded-[14px] border border-slate-200 bg-white/90 px-4 py-3 text-base font-medium leading-normal text-slate-950 shadow-[inset_0_1px_0_white] outline-none transition-[border-color,box-shadow] placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-cyan-100/80 disabled:cursor-not-allowed disabled:bg-slate-50";

function formatDate(value: string | undefined, locale: string, notProvided: string) {
  if (!value) return notProvided;
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return notProvided;
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date);
}

function formatMemberSince(value: string | undefined, locale: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(date);
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

function activeNavView(view: ProfileView): ProfileNavView {
  if (view === "edit") return "personal";
  if (view === "language") return "preferences";
  return view;
}

function ProfileAvatar({
  user,
  name,
  size = "md",
}: {
  user: AppUser;
  name: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "size-14 text-lg" : "size-16 text-xl";
  return user.avatar ? (
    <img
      src={user.avatar}
      alt={name}
      referrerPolicy="no-referrer"
      className={cn(
        "shrink-0 rounded-full border-[3px] border-white object-cover shadow-[0_10px_26px_rgba(37,99,235,0.16)]",
        sizeClass,
      )}
    />
  ) : (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-[3px] border-white bg-gradient-to-br from-blue-500 to-cyan-400 font-extrabold text-white shadow-[0_10px_26px_rgba(37,99,235,0.16)]",
        sizeClass,
      )}
      role="img"
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}

function GoogleBadge() {
  const { t } = useTranslation();
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
      <Check className="size-3.5" aria-hidden="true" /> {t("profile.googleAccount")}
    </span>
  );
}

function Identity({
  user,
  profile,
  compact = false,
}: {
  user: AppUser;
  profile: UserProfile;
  compact?: boolean;
}) {
  const displayName = profile.displayName?.trim() || user.name;
  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <ProfileAvatar user={user} name={displayName} size={compact ? "sm" : "md"} />
      <div className="min-w-0">
        <h2 className="break-words text-[20px] font-extrabold leading-6 tracking-[-0.03em] text-slate-950">
          {displayName}
        </h2>
        <p className="mt-0.5 break-all text-[13px] leading-5 text-slate-500">{user.email}</p>
        <div className="mt-2">
          <GoogleBadge />
        </div>
      </div>
    </div>
  );
}

function CompletionStrip({
  profile,
  onComplete,
}: {
  profile: UserProfile;
  onComplete?: () => void;
}) {
  const { t } = useTranslation();
  const completion = completionFor(profile);
  const complete = completion.percent === 100;
  return (
    <div
      className={cn(
        "rounded-[16px] border px-4 py-3",
        complete ? "border-slate-200/80 bg-white/72" : "border-blue-100/80 bg-blue-50/65",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <CheckCircle2
            className={cn("size-4.5 shrink-0", complete ? "text-emerald-500" : "text-blue-500")}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800">
              {complete ? t("profile.profileComplete") : t("profile.completion")}
            </p>
            {!complete ? (
              <p className="mt-0.5 text-xs text-slate-500">
                {t("profile.remaining", { count: completion.total - completion.complete })}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="text-sm font-extrabold text-blue-600">{completion.percent}%</span>
          {!complete && onComplete ? (
            <button
              type="button"
              onClick={onComplete}
              className="rounded-[10px] px-2 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
            >
              {t("profile.completeAction")}
            </button>
          ) : null}
        </div>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100"
        role="progressbar"
        aria-label={t("profile.completion")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completion.percent}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
          style={{ width: `${completion.percent}%` }}
        />
      </div>
    </div>
  );
}

function SignOutButton({ compact = false }: { compact?: boolean }) {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [signingOut, setSigningOut] = useState(false);
  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    await signOut();
  }
  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={signingOut}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[13px] border border-rose-200 bg-rose-50/45 px-4 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100",
        compact ? "w-full justify-start" : "w-full sm:w-auto",
      )}
    >
      {signingOut ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      {signingOut ? t("profile.signingOut") : t("nav.signOut")}
    </button>
  );
}

function ProfileSidebar({
  user,
  profile,
  view,
  onViewChange,
}: {
  user: AppUser;
  profile: UserProfile;
  view: ProfileView;
  onViewChange: (view: ProfileView) => void;
}) {
  const { t } = useTranslation();
  const selected = activeNavView(view);
  return (
    <GlassCard
      strong
      className="app-card sticky top-24 hidden min-h-[520px] overflow-hidden p-4 lg:flex lg:flex-col"
    >
      <div className="rounded-[18px] border border-white/80 bg-white/60 p-3.5">
        <Identity user={user} profile={profile} compact />
      </div>
      <nav className="mt-4 space-y-1" aria-label={t("profile.sectionsAria")}>
        {NAV_ITEMS.map((item) => {
          const active = selected === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-12 w-full items-center gap-3 rounded-[13px] px-3.5 text-left text-sm font-semibold leading-5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200",
                active
                  ? "bg-blue-50/95 text-slate-950 shadow-[inset_0_1px_0_white]"
                  : "text-slate-600 hover:bg-white/75 hover:text-slate-950",
              )}
            >
              <item.Icon
                className={cn("size-[18px] shrink-0", active ? "text-blue-600" : "text-slate-400")}
                aria-hidden="true"
              />
              <span className="min-w-0 break-words">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-slate-200/70 pt-4">
        <SignOutButton compact />
      </div>
    </GlassCard>
  );
}

function TabletProfileHeader({ user, profile }: { user: AppUser; profile: UserProfile }) {
  return (
    <GlassCard strong className="app-card hidden p-5 md:block lg:hidden">
      <div className="flex items-center justify-between gap-6">
        <Identity user={user} profile={profile} />
        <div className="w-[220px] shrink-0">
          <CompletionStrip profile={profile} />
        </div>
      </div>
    </GlassCard>
  );
}

function TabletNavigation({
  view,
  onViewChange,
}: {
  view: ProfileView;
  onViewChange: (view: ProfileView) => void;
}) {
  const { t } = useTranslation();
  const selected = activeNavView(view);
  return (
    <nav
      className="hidden overflow-x-auto rounded-[17px] border border-white/80 bg-white/70 p-1.5 shadow-[0_10px_28px_rgba(31,72,116,0.08)] backdrop-blur-[14px] md:flex lg:hidden"
      aria-label={t("profile.sectionsAria")}
    >
      {NAV_ITEMS.map((item) => {
        const active = selected === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 flex-none items-center gap-2 rounded-[12px] px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200",
              active
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-slate-950",
            )}
          >
            <item.Icon className="size-4 shrink-0" aria-hidden="true" /> {t(item.labelKey)}
          </button>
        );
      })}
    </nav>
  );
}

function MobileNestedHeader({
  backLabel,
  title,
  onBack,
  action,
}: {
  backLabel: string;
  title: string;
  onBack: () => void;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 md:hidden">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-10 items-center gap-1 rounded-[11px] pr-2 text-sm font-bold text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> {backLabel}
      </button>
      <div className="mt-1 flex min-w-0 items-center justify-between gap-3">
        <h1 className="min-w-0 break-words text-[28px] font-extrabold leading-[1.12] tracking-[-0.04em] text-slate-950">
          {title}
        </h1>
        {action}
      </div>
    </div>
  );
}

function ContentHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="hidden border-b border-slate-200/70 pb-5 md:flex md:items-start md:justify-between md:gap-5">
      <div className="min-w-0">
        <h2 className="text-[24px] font-extrabold tracking-[-0.035em] text-slate-950 lg:text-[28px]">
          {title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 px-1 text-[12px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </h3>
      <div className="overflow-hidden rounded-[17px] border border-slate-200/80 bg-white/75 shadow-[inset_0_1px_0_white] divide-y divide-slate-200/70">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({
  Icon,
  title,
  description,
  value,
  onClick,
  danger = false,
}: {
  Icon?: typeof UserRound;
  title: string;
  description?: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const content = (
    <>
      {Icon ? (
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-[11px]",
            danger ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600",
          )}
        >
          <Icon className="size-[17px]" aria-hidden="true" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block break-words text-[15px] font-bold leading-5",
            danger ? "text-rose-700" : "text-slate-900",
          )}
        >
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block break-words text-[12px] leading-[18px] text-slate-500">
            {description}
          </span>
        ) : null}
      </span>
      {value ? (
        <span className="ml-auto max-w-[42%] break-words text-right text-sm font-medium leading-snug text-slate-500 max-[360px]:order-3 max-[360px]:ml-[44px] max-[360px]:max-w-[calc(100%-44px)] max-[360px]:basis-full max-[360px]:text-left">
          {value}
        </span>
      ) : null}
      {onClick ? (
        <ChevronRight className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
      ) : null}
    </>
  );
  const className =
    "flex min-h-[60px] w-full flex-wrap items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-200";
  return onClick ? (
    <button type="button" onClick={onClick} className={cn(className, "hover:bg-blue-50/55")}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-1 px-4 py-3.5 sm:grid-cols-[minmax(170px,.35fr)_minmax(0,.65fr)] sm:items-start sm:gap-5 sm:px-5">
      <dt className="text-[13px] font-semibold leading-5 text-slate-500 sm:text-sm">{label}</dt>
      <dd className="min-w-0 break-words text-[15px] font-semibold leading-6 text-slate-950 sm:text-base">
        {value}
      </dd>
    </div>
  );
}

function DetailList({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex min-h-8 items-center justify-between gap-3 px-1">
        <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </h3>
        {action}
      </div>
      <dl className="overflow-hidden rounded-[17px] border border-slate-200/80 bg-white/78 shadow-[inset_0_1px_0_white] divide-y divide-slate-200/70">
        {children}
      </dl>
    </section>
  );
}

function profileValues(profile: UserProfile, locale: string, t: (key: string) => string) {
  const notProvided = t("common.notProvided");
  return {
    displayName: profile.displayName?.trim() || notProvided,
    dateOfBirth: formatDate(profile.dateOfBirth, locale, notProvided),
    sex: profile.sex
      ? t(`createProfile.${profile.sex === "prefer-not-to-say" ? "preferNotToSay" : profile.sex}`)
      : notProvided,
    height: Number.isFinite(profile.heightCm) ? `${profile.heightCm} cm` : notProvided,
    weight: Number.isFinite(profile.weightKg) ? `${profile.weightKg} kg` : notProvided,
    bloodType: profile.bloodType
      ? profile.bloodType === "unknown"
        ? t("common.unknown")
        : profile.bloodType
      : notProvided,
  };
}

function MobileProfileHub({
  user,
  profile,
  onViewChange,
}: {
  user: AppUser;
  profile: UserProfile;
  onViewChange: (view: ProfileView) => void;
}) {
  const { t, i18n } = useTranslation();
  const code =
    profile.preferredLanguage ?? normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const language =
    SUPPORTED_LANGUAGES.find((item) => item.code === code)?.nativeLabel ??
    SUPPORTED_LANGUAGES[0].nativeLabel;
  return (
    <div className="space-y-5 md:hidden">
      <div>
        <Link
          to="/dashboard"
          className="inline-flex min-h-10 items-center gap-1 rounded-[11px] pr-2 text-sm font-bold text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> {t("nav.dashboard")}
        </Link>
        <h1 className="mt-1 text-[30px] font-extrabold tracking-[-0.045em] text-slate-950">
          {t("common.profile")}
        </h1>
      </div>

      <GlassCard strong className="app-card p-4">
        <Identity user={user} profile={profile} />
      </GlassCard>
      <CompletionStrip profile={profile} onComplete={() => onViewChange("edit")} />

      <SettingsGroup title={t("common.profile")}>
        <SettingsRow
          Icon={UserRound}
          title={t("profile.personalInformation")}
          description={t("profile.personalInformationShort")}
          onClick={() => onViewChange("personal")}
        />
        <SettingsRow
          Icon={Languages}
          title={t("profile.preferences")}
          description={t("settings.language")}
          value={language}
          onClick={() => onViewChange("preferences")}
        />
        <SettingsRow
          Icon={LockKeyhole}
          title={t("profile.privacySecurity")}
          description={t("profile.accountAndPrivacy")}
          onClick={() => onViewChange("privacy")}
        />
      </SettingsGroup>

      <SettingsGroup title={t("profile.account")}>
        <SettingsRow
          Icon={ShieldCheck}
          title={t("profile.connectedAccount")}
          description={user.email}
          value="Google"
        />
        <div className="p-3">
          <SignOutButton compact />
        </div>
      </SettingsGroup>
    </div>
  );
}

function OverviewSection({
  user,
  profile,
  onEdit,
}: {
  user: AppUser;
  profile: UserProfile;
  onEdit: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = localeForLanguage(normalizeLanguage(i18n.resolvedLanguage ?? i18n.language));
  const values = profileValues(profile, locale, t);
  const completion = completionFor(profile);
  const language =
    SUPPORTED_LANGUAGES.find(
      (item) =>
        item.code ===
        (profile.preferredLanguage ?? normalizeLanguage(i18n.resolvedLanguage ?? i18n.language)),
    )?.nativeLabel ?? SUPPORTED_LANGUAGES[0].nativeLabel;
  return (
    <GlassCard strong className="app-card p-5 sm:p-6 lg:p-8">
      <ContentHeading title={t("profile.overview")} description={t("profile.overviewBody")} />
      <div className="space-y-7 md:mt-6">
        <DetailList title={t("profile.profileStatus")}>
          <DetailRow label={t("profile.completion")} value={`${completion.percent}%`} />
          <DetailRow label={t("profile.account")} value="Google" />
          <DetailRow label={t("settings.language")} value={language} />
        </DetailList>
        <DetailList
          title={t("profile.personalDetails")}
          action={
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
            >
              <Pencil className="size-3.5" aria-hidden="true" /> {t("common.edit")}
            </button>
          }
        >
          <DetailRow label={t("createProfile.displayName")} value={values.displayName} />
          <DetailRow label={t("profile.dateOfBirth")} value={values.dateOfBirth} />
          <DetailRow label={t("profile.sex")} value={values.sex} />
          <DetailRow label={t("profile.height")} value={values.height} />
          <DetailRow label={t("profile.weight")} value={values.weight} />
          <DetailRow label={t("profile.bloodType")} value={values.bloodType} />
        </DetailList>
      </div>
    </GlassCard>
  );
}

function PersonalInformationSection({
  profile,
  onBack,
  onEdit,
}: {
  profile: UserProfile;
  onBack: () => void;
  onEdit: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = localeForLanguage(normalizeLanguage(i18n.resolvedLanguage ?? i18n.language));
  const values = profileValues(profile, locale, t);
  const editButton = (
    <button
      type="button"
      onClick={onEdit}
      className={glassButtonVariants({ variant: "glass", size: "md" })}
    >
      <Pencil className="size-4" aria-hidden="true" /> {t("profile.edit")}
    </button>
  );
  return (
    <>
      <MobileNestedHeader
        backLabel={t("common.profile")}
        title={t("profile.personalInformation")}
        onBack={onBack}
        action={
          <button
            type="button"
            onClick={onEdit}
            className="min-h-10 rounded-[11px] px-2 text-sm font-extrabold text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            {t("common.edit")}
          </button>
        }
      />
      <GlassCard strong className="app-card p-4 sm:p-6 lg:p-8">
        <ContentHeading
          title={t("profile.personalInformation")}
          description={t("profile.personalDetailsBody")}
          action={editButton}
        />
        <p className="mb-5 text-sm leading-6 text-slate-500 md:hidden">
          {t("profile.personalDetailsBody")}
        </p>
        <div className="space-y-7 md:mt-6">
          <DetailList title={t("profile.basicInformation")}>
            <DetailRow label={t("createProfile.displayName")} value={values.displayName} />
            <DetailRow label={t("profile.dateOfBirth")} value={values.dateOfBirth} />
            <DetailRow label={t("profile.sex")} value={values.sex} />
          </DetailList>
          <DetailList title={t("profile.bodyInformation")}>
            <DetailRow label={t("profile.height")} value={values.height} />
            <DetailRow label={t("profile.weight")} value={values.weight} />
            <DetailRow label={t("profile.bloodType")} value={values.bloodType} />
          </DetailList>
        </div>
      </GlassCard>
    </>
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
  const { t } = useTranslation();
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-bold text-slate-700">
        {children}
      </label>
      {optional ? (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
          {t("common.optional")}
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

function EditProfileSection({
  profile,
  onBack,
  onSaved,
}: {
  profile: UserProfile;
  onBack: () => void;
  onSaved: () => void;
}) {
  const { updateProfile } = useProfile();
  const { t } = useTranslation();
  const [draft, setDraft] = useState<ProfileDraft>(() => profileToDraft(profile));
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileDraft, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allowNavigation, setAllowNavigation] = useState(false);
  const saveLock = useRef(false);
  const errors = useMemo(() => validateProfile(draft, t), [draft, t]);
  const originalDraft = useMemo(() => profileToDraft(profile), [profile]);
  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(originalDraft),
    [draft, originalDraft],
  );
  const today = new Date().toISOString().slice(0, 10);
  const blocker = useBlocker({
    shouldBlockFn: () => dirty && !allowNavigation,
    enableBeforeUnload: dirty && !allowNavigation,
    disabled: !dirty || allowNavigation,
    withResolver: true,
  });

  useEffect(() => {
    if (!dirty) setDraft(profileToDraft(profile));
  }, [profile, dirty]);

  function setField<K extends keyof ProfileDraft>(field: K, value: ProfileDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function visibleError(field: keyof ProfileDraft) {
    return touched[field] || submitted ? errors[field] : undefined;
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
      setAllowNavigation(true);
      toast.success(t("profile.updated"));
      onSaved();
    } catch {
      toast.error(t("errors.updateProfile"));
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  const desktopActions = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onBack}
        disabled={saving}
        className={glassButtonVariants({ variant: "glass", size: "md" })}
      >
        {t("common.cancel")}
      </button>
      <button
        type="submit"
        form="edit-profile-form"
        disabled={saving}
        className={glassButtonVariants({ size: "md", className: "min-w-36" })}
      >
        {saving ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> {t("common.saving")}
          </>
        ) : (
          t("common.saveChanges")
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="mb-4 md:hidden">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="min-h-10 rounded-[11px] px-1 text-sm font-bold text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            {t("common.cancel")}
          </button>
        </div>
        <h1 className="mt-1 break-words text-[28px] font-extrabold leading-[1.15] tracking-[-0.04em] text-slate-950">
          {t("profile.edit")}
        </h1>
      </div>
      <GlassCard strong className="app-card p-4 sm:p-6 lg:p-8">
        <ContentHeading
          title={t("profile.edit")}
          description={t("profile.editBody")}
          action={desktopActions}
        />
        <form
          id="edit-profile-form"
          className="space-y-5 md:mt-6"
          onSubmit={(event) => void submit(event)}
          noValidate
        >
          <div>
            <FieldLabel htmlFor="edit-displayName">{t("createProfile.displayName")}</FieldLabel>
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
          <div className="grid gap-5 min-[540px]:grid-cols-2">
            <div>
              <FieldLabel htmlFor="edit-dateOfBirth">{t("profile.dateOfBirth")}</FieldLabel>
              <input
                id="edit-dateOfBirth"
                type="date"
                max={today}
                value={draft.dateOfBirth}
                onChange={(event) => setField("dateOfBirth", event.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, dateOfBirth: true }))}
                aria-invalid={Boolean(visibleError("dateOfBirth"))}
                aria-describedby={
                  visibleError("dateOfBirth") ? "edit-dateOfBirth-error" : undefined
                }
                className={fieldClassName}
                disabled={saving}
              />
              <FieldError id="edit-dateOfBirth-error" message={visibleError("dateOfBirth")} />
            </div>
            <fieldset>
              <legend className="mb-2 text-[13px] font-bold text-slate-700">
                {t("profile.sex")}
              </legend>
              <div
                className="grid min-h-[52px] grid-cols-3 overflow-hidden rounded-[14px] border border-slate-200 bg-slate-50 p-1"
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
                        "min-h-11 rounded-[10px] px-1.5 py-2 text-[11px] font-bold leading-snug transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 sm:text-xs",
                        selected
                          ? "border border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                          : "text-slate-500 hover:bg-white hover:text-slate-800",
                      )}
                      aria-pressed={selected}
                      disabled={saving}
                    >
                      {t(option.labelKey)}
                    </button>
                  );
                })}
              </div>
              <FieldError id="edit-sex-error" message={visibleError("sex")} />
            </fieldset>
          </div>
          <div className="grid gap-5 min-[390px]:grid-cols-2 max-[375px]:grid-cols-1">
            {(
              [
                ["heightCm", t("profile.height"), "170", "cm", "numeric"],
                ["weightKg", t("profile.weight"), "65", "kg", "decimal"],
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
              {t("profile.bloodType")}
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
              <option value="">{t("common.notProvided")}</option>
              {BLOOD_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === "unknown" ? t("common.unknown") : option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 pt-1 md:hidden">
            <button
              type="submit"
              disabled={saving}
              className={glassButtonVariants({ size: "lg", className: "w-full" })}
            >
              {saving ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> {t("common.saving")}
                </>
              ) : (
                t("common.saveChanges")
              )}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              className={glassButtonVariants({ variant: "glass", size: "md", className: "w-full" })}
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </GlassCard>

      <AlertDialog open={blocker.status === "blocked"}>
        <AlertDialogContent className="glass-control w-[calc(100%-2rem)] max-w-md rounded-[22px] border-white/90 bg-white/95 p-6 shadow-[0_24px_64px_rgba(31,72,116,.2)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-extrabold tracking-[-0.03em] text-slate-950">
              {t("profile.discardTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-6 text-slate-500">
              {t("profile.discardBody")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 gap-2 sm:space-x-0">
            <AlertDialogCancel
              onClick={() => blocker.status === "blocked" && blocker.reset()}
              className={glassButtonVariants({ variant: "glass", size: "md" })}
            >
              {t("profile.keepEditing")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setAllowNavigation(true);
                if (blocker.status === "blocked") blocker.proceed();
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-[13px] bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
            >
              {t("profile.discardChanges")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PreferencesSection({
  profile,
  onBack,
  onLanguage,
}: {
  profile: UserProfile;
  onBack: () => void;
  onLanguage: () => void;
}) {
  const { t, i18n } = useTranslation();
  const code =
    profile.preferredLanguage ?? normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const language =
    SUPPORTED_LANGUAGES.find((item) => item.code === code)?.nativeLabel ??
    SUPPORTED_LANGUAGES[0].nativeLabel;
  return (
    <>
      <MobileNestedHeader
        backLabel={t("common.profile")}
        title={t("profile.preferences")}
        onBack={onBack}
      />
      <GlassCard strong className="app-card p-4 sm:p-6 lg:p-8">
        <ContentHeading
          title={t("profile.preferences")}
          description={t("profile.preferencesBody")}
        />
        <div className="md:mt-6">
          <SettingsGroup title={t("profile.general")}>
            <SettingsRow
              Icon={Languages}
              title={t("settings.language")}
              value={language}
              onClick={onLanguage}
            />
          </SettingsGroup>
        </div>
      </GlassCard>
    </>
  );
}

function LanguageSection({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  return (
    <>
      <MobileNestedHeader
        backLabel={t("profile.preferences")}
        title={t("settings.language")}
        onBack={onBack}
      />
      <GlassCard strong className="app-card p-4 sm:p-6 lg:p-8">
        <ContentHeading title={t("settings.language")} description={t("settings.languageBody")} />
        <div className="md:mt-6">
          <LanguageSelector compact />
        </div>
      </GlassCard>
    </>
  );
}

function PrivacySection({ user, onBack }: { user: AppUser; onBack: () => void }) {
  const { t } = useTranslation();
  const [modal, setModal] = useState<"data" | "disclaimer" | null>(null);
  return (
    <>
      <MobileNestedHeader
        backLabel={t("common.profile")}
        title={t("profile.privacySecurity")}
        onBack={onBack}
      />
      <GlassCard strong className="app-card p-4 sm:p-6 lg:p-8">
        <ContentHeading
          title={t("profile.privacySecurity")}
          description={t("profile.accountBody")}
        />
        <div className="space-y-7 md:mt-6">
          <DetailList title={t("profile.account")}>
            <DetailRow label={t("profile.connectedAccount")} value="Google" />
            <DetailRow label={t("profile.email")} value={user.email} />
          </DetailList>
          <SettingsGroup title={t("profile.privacyLabel")}>
            <SettingsRow
              Icon={ShieldCheck}
              title={t("profile.dataPrivacy")}
              onClick={() => setModal("data")}
            />
            <SettingsRow
              Icon={FileHeart}
              title={t("profile.aiDisclaimer")}
              onClick={() => setModal("disclaimer")}
            />
          </SettingsGroup>
          <SettingsGroup title={t("profile.session")}>
            <div className="p-3">
              <SignOutButton compact />
            </div>
          </SettingsGroup>
        </div>
      </GlassCard>

      <GlassModal
        open={modal === "data"}
        onClose={() => setModal(null)}
        title={t("profile.dataPrivacy")}
        description={t("profile.dataPrivacyBody")}
      >
        <div className="rounded-[15px] border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-600">
          {t("profile.dataBody")}
        </div>
      </GlassModal>
      <GlassModal
        open={modal === "disclaimer"}
        onClose={() => setModal(null)}
        title={t("profile.aiDisclaimer")}
        description={t("medical.shortDisclaimer")}
      >
        <div className="rounded-[15px] border border-amber-100 bg-amber-50/70 p-4 text-sm leading-6 text-slate-700">
          {t("medical.disclaimer")}
        </div>
      </GlassModal>
    </>
  );
}

export function ProfileDetails({
  user,
  profile,
  view,
  onViewChange,
}: {
  user: AppUser;
  profile: UserProfile;
  view: ProfileView;
  onViewChange: (view: ProfileView) => void;
}) {
  const { t, i18n } = useTranslation();
  const memberSince = formatMemberSince(
    profile.createdAt,
    localeForLanguage(normalizeLanguage(i18n.resolvedLanguage ?? i18n.language)),
  );
  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-6 hidden md:flex md:items-end md:justify-between md:gap-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
            {t("profile.eyebrow")}
          </p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,2.25rem)] font-extrabold tracking-[-0.045em] text-slate-950">
            {t("profile.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-slate-500">
            {t("profile.subtitle")}
          </p>
          {memberSince ? (
            <p className="mt-1 text-xs font-medium text-slate-400">
              {t("profile.memberSince", { date: memberSince })}
            </p>
          ) : null}
        </div>
      </header>

      {view === "overview" ? (
        <MobileProfileHub user={user} profile={profile} onViewChange={onViewChange} />
      ) : null}

      <div
        className={cn(
          "gap-6 lg:grid-cols-[minmax(240px,270px)_minmax(0,1fr)] lg:items-start",
          view === "overview" ? "hidden md:grid" : "grid",
        )}
      >
        <ProfileSidebar user={user} profile={profile} view={view} onViewChange={onViewChange} />
        <div className="min-w-0 space-y-4 md:space-y-5">
          <TabletProfileHeader user={user} profile={profile} />
          <TabletNavigation view={view} onViewChange={onViewChange} />
          <section
            id="profile-section-content"
            tabIndex={-1}
            className="min-w-0 scroll-mt-24 outline-none"
          >
            {view === "overview" ? (
              <OverviewSection user={user} profile={profile} onEdit={() => onViewChange("edit")} />
            ) : null}
            {view === "personal" ? (
              <PersonalInformationSection
                profile={profile}
                onBack={() => onViewChange("overview")}
                onEdit={() => onViewChange("edit")}
              />
            ) : null}
            {view === "edit" ? (
              <EditProfileSection
                profile={profile}
                onBack={() => onViewChange("personal")}
                onSaved={() => onViewChange("personal")}
              />
            ) : null}
            {view === "preferences" ? (
              <PreferencesSection
                profile={profile}
                onBack={() => onViewChange("overview")}
                onLanguage={() => onViewChange("language")}
              />
            ) : null}
            {view === "language" ? (
              <LanguageSection onBack={() => onViewChange("preferences")} />
            ) : null}
            {view === "privacy" ? (
              <PrivacySection user={user} onBack={() => onViewChange("overview")} />
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  const { t } = useTranslation();
  return (
    <div
      className="mx-auto max-w-[1180px] space-y-6"
      aria-label={t("profile.loading")}
      aria-busy="true"
    >
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded bg-blue-100" />
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 max-w-xl animate-pulse rounded bg-slate-100" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
        <div className="app-card hidden min-h-[520px] rounded-[24px] p-4 lg:block">
          <div className="h-20 animate-pulse rounded-[18px] bg-slate-100" />
          <div className="mt-5 space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-[13px] bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="app-card rounded-[24px] p-5 sm:p-7">
          <div className="h-8 w-44 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-[12px] bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileLoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <GlassCard strong className="app-card mx-auto max-w-xl p-8 text-center sm:p-10">
      <span className="mx-auto grid size-14 place-items-center rounded-[18px] bg-rose-50 text-rose-500">
        <UserRound className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-slate-950">{t("errors.loadProfile")}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{t("errors.loadProfileBody")}</p>
      <button
        type="button"
        onClick={onRetry}
        className={glassButtonVariants({ size: "md", className: "mt-6" })}
      >
        {t("common.tryAgain")}
      </button>
    </GlassCard>
  );
}

export function IncompleteProfile() {
  const { t } = useTranslation();
  return (
    <GlassCard strong className="app-card mx-auto max-w-xl p-8 text-center sm:p-10">
      <CareAILogo className="justify-center" />
      <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] text-slate-950">
        {t("profile.incompleteTitle")}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{t("profile.incompleteBody")}</p>
      <Link
        to="/create-profile"
        className={glassButtonVariants({ size: "lg", className: "mt-6 w-full sm:w-auto" })}
      >
        {t("profile.createProfile")}
      </Link>
    </GlassCard>
  );
}
