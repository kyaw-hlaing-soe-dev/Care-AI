import { Github, Linkedin, Twitter } from "lucide-react";
import { CareAILogo } from "@/components/auth/CareAILogo";

const LINKS = [
  { label: "Privacy", href: "#" },
  { label: "About", href: "#features" },
  { label: "Contact", href: "#" },
  { label: "GitHub", href: "https://github.com" },
];

const SOCIALS = [
  { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { Icon: Github, label: "GitHub", href: "https://github.com" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

export function LandingFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-12">
      <div className="glass-surface glass-glare flex flex-col items-center gap-6 rounded-3xl px-6 py-8 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <CareAILogo compact className="justify-center sm:justify-start" />
          <p className="mt-2 max-w-[260px] text-xs leading-5 text-muted-foreground">
            Simple vital tracking and AI-powered health insights.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-center gap-2">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full bg-primary/8 text-primary transition-colors hover:bg-primary/15"
              >
                <s.Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
        © 2026 CareAI. CareAI provides informational health insights and is not a substitute for
        professional medical advice.
      </p>
    </footer>
  );
}
