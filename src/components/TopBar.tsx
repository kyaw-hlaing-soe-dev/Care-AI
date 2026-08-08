import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ChevronDown,
  History,
  LayoutDashboard,
  LogOut,
  Settings2,
  UserRound,
} from "lucide-react";
import { CareAILogo } from "@/components/auth/CareAILogo";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", labelKey: "nav.dashboard", shortLabelKey: "nav.dashboardShort", Icon: LayoutDashboard },
  { to: "/add", labelKey: "nav.vitalTracker", shortLabelKey: "nav.track", Icon: Activity },
  { to: "/history", labelKey: "nav.history", shortLabelKey: "nav.history", Icon: History },
] as const;

function isActive(pathname: string, to: (typeof NAV)[number]["to"]) {
  if (to === "/history") return pathname.startsWith("/history");
  return pathname === to;
}

function UserAvatar({ name, avatar }: { name: string; avatar?: string | undefined }) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "C";

  return avatar ? (
    <img
      src={avatar}
      alt={`${name}'s profile avatar`}
      referrerPolicy="no-referrer"
      className="size-9 rounded-full border-2 border-white object-cover shadow-sm"
    />
  ) : (
    <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-sm">
      {initials}
    </span>
  );
}

export function TopBar() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="glass-control glass-glare pointer-events-auto mx-auto grid h-[62px] max-w-[1380px] grid-cols-[1fr_auto] items-center gap-3 rounded-[21px] px-3 shadow-[0_14px_42px_rgba(31,72,116,0.11)] sm:h-[66px] sm:px-4 md:grid-cols-[1fr_auto_1fr] md:rounded-[24px] lg:px-5">
          <Link
            to="/dashboard"
            className="w-fit rounded-[14px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            <CareAILogo compact />
          </Link>

          <nav
            className="hidden items-center gap-1 rounded-[17px] border border-white/80 bg-slate-100/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.9)] md:flex"
            aria-label={t("nav.primary")}
          >
            {NAV.map((item) => {
              const active = isActive(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-[14px] px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200",
                    active
                      ? "border border-white/90 bg-white/90 text-blue-600 shadow-[0_5px_16px_rgba(37,99,235,0.10),inset_0_1px_0_white]"
                      : "border border-transparent text-slate-500 hover:bg-white/70 hover:text-slate-900",
                  )}
                >
                  <item.Icon className="size-4" aria-hidden="true" />
                  <span className="topbar-nav-label hidden min-[820px]:inline">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex justify-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-2 rounded-[15px] px-1.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 sm:px-2.5"
                    aria-label={t("nav.openProfileMenu")}
                  >
                    <UserAvatar name={user.name} avatar={user.avatar} />
                    <span className="hidden max-w-32 truncate lg:block">{user.name}</span>
                    <ChevronDown
                      className="hidden size-4 text-slate-400 lg:block"
                      aria-hidden="true"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64 rounded-[20px] border-white/90 bg-white/92 p-2 shadow-[0_22px_58px_rgba(31,72,116,0.18),inset_0_1px_0_white] backdrop-blur-[var(--glass-blur-lg)]"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                      <UserRound className="size-3.5" /> {t("common.profile")}
                    </span>
                    <span className="mt-2 block truncate text-sm font-bold text-slate-900">
                      {user.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-slate-500">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="min-h-11 cursor-pointer rounded-[12px] px-3 text-sm font-semibold text-slate-700 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <UserRound className="size-4" />
                      {t("nav.viewProfile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="min-h-11 cursor-pointer rounded-[12px] px-3 text-sm font-semibold text-slate-700 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <Settings2 className="size-4" />
                      {t("nav.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onSelect={() => void signOut()}
                    className="min-h-11 cursor-pointer rounded-[12px] px-3 text-sm font-semibold text-slate-700 focus:bg-rose-50 focus:text-rose-700"
                  >
                    <LogOut className="size-4" />
                    {t("nav.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </header>

      <nav
        className="glass-control glass-glare fixed inset-x-3 bottom-[max(.65rem,env(safe-area-inset-bottom))] z-50 grid h-[64px] grid-cols-3 rounded-[22px] px-1.5 shadow-[0_18px_46px_rgba(31,72,116,0.18)] md:hidden"
        aria-label={t("nav.mobile")}
      >
        {NAV.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "m-1 flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-[17px] border text-[11px] font-semibold transition-[color,background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-200",
                active
                  ? "border-white/90 bg-blue-50/90 text-blue-600 shadow-[0_5px_16px_rgba(37,99,235,0.10),inset_0_1px_0_white]"
                  : "border-transparent text-slate-500 hover:bg-white/65 hover:text-slate-700",
              )}
            >
              <item.Icon className={cn("size-5", active && "fill-blue-50")} aria-hidden="true" />
              <span className="w-full truncate px-1 text-center">{t(item.shortLabelKey)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
