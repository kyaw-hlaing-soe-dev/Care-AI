# CareAI Design System

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Responsive Design](./responsive-design.md), [Accessibility](./accessibility.md)

Brand name is **CareAI**; never use “AICare.” Actual styling is in `src/styles.css`: Inter typography, navy foreground, blue primary, cyan/sky accents, very light blue background, gradient buttons, liquid-glass white surfaces, dot texture, soft blue shadows, and 18px base radius.

Use `GlassCard`, `GlassButton`, `GlassInput`, `StatusBadge`, and the existing Lucide icon system before creating variants. Primary actions use blue→cyan gradients; good/warning/urgent/pending status colors must retain text labels, not rely on color alone. Cards typically use 20–28px radii, soft shadows, and readable opaque content. Inputs remain white/high-contrast, with labels, error text, focus rings, and units.

Charts use the dashboard’s blue/cyan/teal/violet language and must include textual context. 3D doctor assets are product warmth/supporting visual—not a substitute for content, accessibility, or privacy. Motion is subtle and must honor `prefers-reduced-motion`.
