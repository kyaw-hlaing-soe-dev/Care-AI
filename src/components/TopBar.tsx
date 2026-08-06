import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { GlassButton } from "@/components/glass/GlassButton";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/add", label: "Vital Tracker" },
  { to: "/history", label: "History" },
] as const;

export function TopBar() {
  const { user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/45 backdrop-blur-2xl dark:border-white/10 dark:bg-white/6">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-primary-light text-primary">
            <Activity className="size-4.5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">AICare</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-500 spring",
                pathname === item.to
                  ? "bg-primary-light text-primary-dark"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm font-semibold sm:inline">{user.name}</span>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => void signOut()}
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </GlassButton>
            </>
          ) : (
            <Link to="/login">
              <GlassButton size="sm">Sign In</GlassButton>
            </Link>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
              pathname === item.to
                ? "bg-primary-light text-primary-dark"
                : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
