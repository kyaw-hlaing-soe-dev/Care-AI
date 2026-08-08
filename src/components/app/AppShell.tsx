import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { useTranslation } from "react-i18next";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="app-shell min-h-dvh">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[1000] -translate-y-24 rounded-[12px] bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-xl transition-transform focus:translate-y-0"
      >
        {t("common.skipToMain")}
      </a>
      <TopBar />
      <main id="main-content" className="mx-auto w-full max-w-[1440px] px-4 py-6 pb-28 sm:px-6 sm:py-8 md:pb-8 xl:px-10">
        {children}
      </main>
      <div className="pb-20 md:pb-0">
        <DisclaimerFooter />
      </div>
    </div>
  );
}
