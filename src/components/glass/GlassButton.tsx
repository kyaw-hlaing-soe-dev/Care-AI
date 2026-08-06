import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none outline-none transition-[transform,box-shadow,background-color,border-color] duration-500 spring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground border border-white/25 shadow-[0_14px_34px_-14px_rgba(22,163,74,0.85)] hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_22px_46px_-16px_rgba(22,163,74,0.9)]",
        glass:
          "glass-surface glass-glare glass-hover text-foreground",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
        danger:
          "bg-destructive text-destructive-foreground border border-white/20 hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
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
