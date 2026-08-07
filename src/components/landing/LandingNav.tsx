import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Menu, X } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#ai", label: "How it works" },
  { href: "#stories", label: "Stories" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav className="glass-surface glass-glare glass-strong mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan text-primary-foreground shadow-[0_8px_20px_-8px_rgba(59,130,246,0.9)]">
            <Activity className="size-4.5" />
          </span>
          <span className="truncate text-lg font-extrabold tracking-tight">Care AI</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <Link to="/login" className="hidden sm:block">
            <GlassButton size="sm">Get Started Free</GlassButton>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-surface glass-strong mx-auto mt-3 max-w-6xl rounded-3xl p-5 md:hidden"
          >
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-semibold text-foreground/85 hover:bg-primary/10"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/login" onClick={() => setOpen(false)} className="mt-3 block">
              <GlassButton size="lg" className="w-full">
                Get Started Free
              </GlassButton>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
