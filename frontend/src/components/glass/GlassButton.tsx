import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-[15px] text-center font-semibold leading-snug whitespace-normal select-none outline-none transition-[transform,box-shadow,background-color,border-color,filter] duration-200 focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary:
          "overflow-hidden border border-white/35 [background:var(--brand-gradient)] text-primary-foreground shadow-[0_14px_32px_rgba(37,99,235,0.24)] before:pointer-events-none before:absolute before:inset-x-1 before:top-px before:h-[42%] before:rounded-[inherit] before:bg-gradient-to-b before:from-white/30 before:to-transparent hover:-translate-y-px hover:brightness-[1.02] hover:shadow-[0_18px_38px_rgba(37,99,235,0.30)]",
        glass:
          "glass-control glass-glare text-foreground shadow-[var(--shadow-ui-sm)] hover:-translate-y-px hover:border-blue-200 hover:bg-white/95 hover:shadow-[var(--shadow-glass-lift)]",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
        danger:
          "border border-rose-200 bg-rose-50/90 text-rose-700 shadow-[var(--shadow-ui-sm)] hover:-translate-y-px hover:bg-rose-100/90",
      },
      size: {
        sm: "min-h-11 px-4 py-2 text-sm",
        md: "min-h-12 px-5 py-2.5 text-sm",
        lg: "min-h-[54px] px-7 py-3 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof glassButtonVariants> & { loading?: boolean };

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(glassButtonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && <Loader2 className="relative z-[1] size-4 animate-spin motion-reduce:animate-none" />}
      <span className="relative z-[1] contents">{children}</span>
    </button>
  ),
);
GlassButton.displayName = "GlassButton";

export { glassButtonVariants };
