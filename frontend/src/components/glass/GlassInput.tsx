import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  unit?: string | undefined;
  invalid?: boolean | undefined;
};

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, hint, error, unit, invalid, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const hasError = Boolean(invalid || error);
    const descriptions = [hint ? `${inputId}-hint` : null, error ? `${inputId}-error` : null]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="min-w-0">
        <label htmlFor={inputId} className="mb-2 block text-[13px] font-bold text-slate-700">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError || undefined}
            aria-describedby={descriptions || undefined}
            className={cn(
              "min-h-[54px] w-full rounded-[var(--radius-input)] border border-slate-200/90 bg-white/90 px-4 py-3 text-base font-medium leading-normal text-slate-950 outline-none backdrop-blur-[var(--glass-blur-sm)]",
              "placeholder:font-normal placeholder:text-slate-400",
              "shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_5px_18px_rgba(44,83,130,0.045)] transition-[border-color,box-shadow,background-color] duration-200",
              "hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-cyan-100/80",
              unit && "pr-16",
              hasError && "border-rose-300 focus:border-rose-400 focus:ring-rose-100",
              className,
            )}
            {...props}
          />
          {unit ? (
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">
              {unit}
            </span>
          ) : null}
        </div>
        {hint ? (
          <p id={`${inputId}-hint`} className="mt-1.5 text-[11px] font-medium leading-5 text-slate-500 sm:text-xs">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs font-semibold leading-5 text-rose-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
GlassInput.displayName = "GlassInput";
