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
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullscreen && "min-h-[70vh]",
        className,
      )}
    >
      <span className="size-8 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
      {label && <p className="animate-pulse text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}
