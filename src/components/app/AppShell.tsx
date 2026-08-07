import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell min-h-dvh">
      <TopBar />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 pb-24 sm:px-6 sm:py-8 md:pb-8 xl:px-10">
        {children}
      </main>
      <div className="pb-20 md:pb-0">
        <DisclaimerFooter />
      </div>
    </div>
  );
}
