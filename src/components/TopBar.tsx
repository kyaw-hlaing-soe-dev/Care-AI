import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ChevronDown,
  History,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { CareAILogo } from "@/components/auth/CareAILogo";
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
  { to: "/dashboard", label: "Dashboard", shortLabel: "Dashboard", Icon: LayoutDashboard },
  { to: "/add", label: "Vital Tracker", shortLabel: "Track", Icon: Activity },
  { to: "/history", label: "History", shortLabel: "History", Icon: History },
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
      alt=""
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
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] xl:px-10">
          <Link
            to="/dashboard"
            className="w-fit rounded-[14px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            <CareAILogo compact />
          </Link>

          <nav className="hidden items-center gap-1 rounded-[18px] border border-slate-200/65 bg-slate-50/75 p-1 md:flex" aria-label="Primary navigation">
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
                      ? "bg-blue-50 text-blue-600 shadow-[0_4px_14px_rgba(37,99,235,0.09)]"
                      : "text-slate-500 hover:bg-white hover:text-slate-900",
                  )}
                >
                  <item.Icon className="size-4" aria-hidden="true" />
                  {item.label}
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
                    aria-label="Open profile menu"
                  >
                    <UserAvatar name={user.name} avatar={user.avatar} />
                    <span className="hidden max-w-32 truncate sm:block">{user.name}</span>
                    <ChevronDown className="hidden size-4 text-slate-400 sm:block" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64 rounded-[18px] border-slate-200 bg-white/95 p-2 shadow-[0_18px_48px_rgba(44,83,130,0.16)] backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                      <UserRound className="size-3.5" /> Profile
                    </span>
                    <span className="mt-2 block truncate text-sm font-bold text-slate-900">{user.name}</span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-slate-500">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onSelect={() => void signOut()}
                    className="min-h-11 cursor-pointer rounded-[12px] px-3 text-sm font-semibold text-slate-700 focus:bg-rose-50 focus:text-rose-700"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid h-[68px] grid-cols-3 border-t border-slate-200/80 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
        aria-label="Mobile navigation"
      >
        {NAV.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-[14px] text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cyan-200",
                active ? "text-blue-600" : "text-slate-400 hover:text-slate-700",
              )}
            >
              <item.Icon className={cn("size-5", active && "fill-blue-50")} aria-hidden="true" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
