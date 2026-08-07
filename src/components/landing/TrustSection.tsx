import { BrainCircuit, KeyRound, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const TRUST_ITEMS = [
  {
    Icon: KeyRound,
    title: "Secure sign-in",
    body: "Use Google authentication to access your CareAI account.",
  },
  {
    Icon: ShieldCheck,
    title: "Private by design",
    body: "Your health information is associated with your account.",
  },
  {
    Icon: BrainCircuit,
    title: "Responsible AI",
    body: "CareAI provides informational insights rather than medical diagnosis.",
  },
];

export function TrustSection() {
  return (
    <section id="privacy" className="mx-auto max-w-[1200px] scroll-mt-28 px-5 py-16 sm:py-20">
      <Reveal>
        <div className="rounded-[28px] border border-white/90 bg-white/72 p-6 shadow-[0_22px_60px_-38px_rgba(35,79,137,0.34)] backdrop-blur-lg sm:p-8 lg:flex lg:items-center lg:gap-10">
          <div className="max-w-sm text-center lg:text-left">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
              Privacy &amp; trust
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Your health data stays yours.
            </h2>
          </div>

          <ul className="mt-7 grid flex-1 gap-5 sm:grid-cols-3 lg:mt-0">
            {TRUST_ITEMS.map(({ Icon, title, body }) => (
              <li key={title} className="text-center sm:text-left">
                <span className="mx-auto grid size-10 place-items-center rounded-[14px] bg-blue-50 text-blue-600 sm:mx-0">
                  <Icon className="size-4.5" />
                </span>
                <h3 className="mt-3 text-sm font-extrabold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
