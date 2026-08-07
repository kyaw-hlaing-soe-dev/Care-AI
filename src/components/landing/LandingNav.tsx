import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { CareAILogo } from "@/components/auth/CareAILogo";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#dashboard", label: "Dashboard Preview" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#insights", label: "Insights" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      <nav className="glass-surface glass-glare glass-strong mx-auto flex max-w-[1380px] items-center justify-between gap-4 rounded-[22px] border-white/80 px-3 py-2 shadow-[0_14px_42px_rgba(31,72,116,0.10)] sm:px-5">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <CareAILogo compact className="gap-2.5" />
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
            className="grid size-11 place-items-center rounded-[14px] text-foreground transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 md:hidden"
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
            className="glass-surface glass-strong mx-auto mt-3 max-w-[1380px] rounded-[24px] p-4 md:hidden"
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
