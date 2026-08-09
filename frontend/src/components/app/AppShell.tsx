import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { useTranslation } from "react-i18next";

export function AppShell({
  children,
  hideMobileNavigation = false,
}: {
  children: ReactNode;
  hideMobileNavigation?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="app-shell min-h-dvh">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[1000] -translate-y-24 rounded-[12px] bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-xl transition-transform focus:translate-y-0"
      >
        {t("common.skipToMain")}
      </a>
      <TopBar hideMobileNavigation={hideMobileNavigation} />
      <main
        id="main-content"
        className={
          hideMobileNavigation
            ? "care-container py-5 pb-10 sm:py-7 md:pb-8"
            : "care-container py-6 pb-28 sm:py-8 md:pb-8"
        }
      >
        {children}
      </main>
      <div className={hideMobileNavigation ? "md:block" : "pb-20 md:pb-0"}>
        <DisclaimerFooter />
      </div>
    </div>
  );
}
