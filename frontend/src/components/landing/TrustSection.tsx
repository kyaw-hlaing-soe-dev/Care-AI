import { BrainCircuit, KeyRound, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { useTranslation } from "react-i18next";

const TRUST_ITEMS = [
  {
    Icon: KeyRound,
    titleKey: "landing.trust.secure",
    bodyKey: "landing.trust.secureBody",
  },
  {
    Icon: ShieldCheck,
    titleKey: "landing.trust.private",
    bodyKey: "landing.trust.privateBody",
  },
  {
    Icon: BrainCircuit,
    titleKey: "landing.trust.responsible",
    bodyKey: "landing.trust.responsibleBody",
  },
];

export function TrustSection() {
  const { t } = useTranslation();
  return (
    <section id="privacy" className="care-container scroll-mt-28 py-12 sm:py-16">
      <Reveal>
        <div className="mx-auto max-w-[1200px] rounded-[26px] border border-white/90 bg-white/78 p-6 shadow-[0_18px_48px_-36px_rgba(35,79,137,0.28)] backdrop-blur-md sm:p-8 lg:flex lg:items-center lg:gap-10">
          <div className="max-w-sm text-center lg:text-left">
            <p className="section-heading-eyebrow text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
              {t("landing.trust.eyebrow")}
            </p>
            <h2 className="landing-section-title mt-3 text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {t("landing.trust.title")}
            </h2>
          </div>

          <ul className="mt-7 grid flex-1 gap-5 sm:grid-cols-3 lg:mt-0">
            {TRUST_ITEMS.map(({ Icon, titleKey, bodyKey }) => (
              <li key={titleKey} className="text-center sm:text-left">
                <span className="mx-auto grid size-10 place-items-center rounded-[14px] bg-blue-50 text-blue-600 sm:mx-0">
                  <Icon className="size-4.5" />
                </span>
                <h3 className="myanmar-label mt-3 text-sm font-extrabold text-slate-900">{t(titleKey)}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">{t(bodyKey)}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
