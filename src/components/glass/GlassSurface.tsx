import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type GlassMaterial = "soft" | "medium" | "strong" | "control";

type GlassSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  material?: GlassMaterial;
  glare?: boolean;
  interactive?: boolean;
};

const materialClass: Record<GlassMaterial, string> = {
  soft: "glass-surface",
  medium: "glass-surface glass-medium",
  strong: "glass-surface glass-strong",
  control: "glass-control",
};

/**
 * Base CareAI material primitive. Keep readable content on medium/strong and
 * reserve soft glass for decorative or low-density surfaces.
 */
export const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  (
    { material = "medium", glare = true, interactive = false, className, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        materialClass[material],
        glare && "glass-glare",
        interactive && "glass-hover",
        className,
      )}
      {...props}
    />
  ),
);
GlassSurface.displayName = "GlassSurface";

export const GlassPanel = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ material = "strong", className, ...props }, ref) => (
    <GlassSurface
      ref={ref}
      material={material}
      className={cn("rounded-[var(--radius-panel)]", className)}
      {...props}
    />
  ),
);
GlassPanel.displayName = "GlassPanel";
