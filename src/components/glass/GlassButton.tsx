import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-[15px] font-semibold whitespace-nowrap select-none outline-none transition-[transform,box-shadow,background-color,border-color,filter] duration-200 focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary:
          "border border-white/25 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-primary-foreground shadow-[0_14px_32px_rgba(37,99,235,0.24)] hover:-translate-y-px hover:brightness-[1.02] hover:shadow-[0_18px_38px_rgba(37,99,235,0.30)]",
        glass:
          "glass-surface glass-glare glass-hover text-foreground",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
        danger:
          "bg-destructive text-destructive-foreground border border-white/20 hover:-translate-y-0.5",
      },
      size: {
        sm: "h-11 px-4 text-sm",
        md: "h-12 px-5 text-sm",
        lg: "h-[54px] px-7 text-base",
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
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  ),
);
GlassButton.displayName = "GlassButton";

export { glassButtonVariants };
