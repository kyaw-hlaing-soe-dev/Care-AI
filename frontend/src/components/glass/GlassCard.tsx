import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { GlassSurface, type GlassMaterial } from "./GlassSurface";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Denser, more opaque glass — use for primary/focus panels. */
  strong?: boolean;
  /** Named material level; `strong` remains as a compatibility shorthand. */
  material?: Exclude<GlassMaterial, "control">;
  /** Enable the hover lift micro-interaction. */
  interactive?: boolean;
  /** Enable entrance animation for selected decorative cards. */
  animated?: boolean;
  /** Stagger index for the entrance animation. */
  delay?: number | undefined;
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, strong, material = "medium", interactive, animated = false, delay = 0, style, ...props }, ref) => (
    <GlassSurface
      ref={ref}
      material={strong ? "strong" : material}
      interactive={interactive ?? false}
      style={{ animationDelay: `${delay}ms`, ...style }}
      className={cn(
        "rounded-[var(--radius-card)]",
        animated && "animate-rise",
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";
