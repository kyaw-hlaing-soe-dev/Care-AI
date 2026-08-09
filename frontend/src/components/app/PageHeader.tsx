import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  action,
}: {
  title: ReactNode;
  subtitle: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="app-page-title text-[clamp(1.85rem,4vw,2.25rem)] font-extrabold leading-tight tracking-[-0.045em] text-slate-950">
          {title}
        </h1>
        <p className="myanmar-readable mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">{subtitle}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
