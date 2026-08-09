import { cn } from "@/lib/utils";

export function LoadingSpinner({
  label,
  fullscreen,
  className,
}: {
  label?: string;
  fullscreen?: boolean;
  className?: string;
}) {
  if (fullscreen) {
    return (
      <div
        className={cn("flex min-h-[70vh] items-center justify-center px-4", className)}
        role="status"
        aria-busy="true"
      >
        <div className="app-card w-full max-w-xl rounded-[24px] border p-5 shadow-[var(--shadow-ui-md)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[15px] bg-blue-50">
              <span className="size-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 motion-reduce:animate-none" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="h-3 w-28 animate-pulse rounded-full bg-blue-100 motion-reduce:animate-none" />
              <div className="mt-2 h-5 w-48 max-w-full animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <div className="h-16 animate-pulse rounded-[16px] bg-slate-100/80 motion-reduce:animate-none" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-20 animate-pulse rounded-[16px] bg-slate-100/70 motion-reduce:animate-none" />
              <div className="h-20 animate-pulse rounded-[16px] bg-slate-100/70 motion-reduce:animate-none" />
            </div>
          </div>
          {label && <p className="mt-5 text-sm font-medium text-muted-foreground">{label}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
      role="status"
      aria-busy="true"
    >
      <span className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary motion-reduce:animate-none" />
      {label && <p className="animate-pulse text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}
