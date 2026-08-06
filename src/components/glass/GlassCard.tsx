import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Denser, more opaque glass — use for primary/focus panels. */
  strong?: boolean;
  /** Enable the hover lift micro-interaction. */
  interactive?: boolean;
  /** Stagger index for the entrance animation. */
  delay?: number;
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, strong, interactive, delay = 0, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms`, ...style }}
      className={cn(
        "glass-surface glass-glare animate-rise rounded-2xl",
        strong && "glass-strong",
        interactive && "glass-hover",
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";
