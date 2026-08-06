import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  invalid?: boolean;
};

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, hint, invalid, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-foreground"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
          className={cn(
            "h-12 w-full rounded-xl border px-4 text-[15px] font-medium text-foreground",
            "border-white/50 bg-white/45 backdrop-blur-xl placeholder:font-normal placeholder:text-muted-foreground",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-500 spring",
            "focus:border-primary/60 focus:bg-white/70 focus:outline-none focus:ring-4 focus:ring-primary/15",
            "dark:border-white/15 dark:bg-white/8 dark:focus:bg-white/12",
            invalid &&
              "border-urgent/50 bg-urgent-bg/70 text-urgent-text focus:border-urgent/70 focus:ring-urgent/15",
            className,
          )}
          {...props}
        />
        {hint && (
          <p
            id={`${inputId}-hint`}
            className={cn(
              "text-xs font-medium",
              invalid ? "text-urgent" : "text-muted-foreground",
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);
GlassInput.displayName = "GlassInput";
