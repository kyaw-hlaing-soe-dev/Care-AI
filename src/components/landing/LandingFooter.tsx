import { Activity, Github, Linkedin, Twitter } from "lucide-react";

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
        <span className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan text-primary-foreground">
            <Activity className="size-4.5" />
          </span>
          <span className="text-base font-extrabold tracking-tight">Care AI</span>
        </span>

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
        © {new Date().getFullYear()} Care AI. Informational insights only — not a substitute for
        professional medical advice, diagnosis, or treatment.
      </p>
    </footer>
  );
}
