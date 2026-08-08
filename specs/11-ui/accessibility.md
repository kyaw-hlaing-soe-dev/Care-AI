# CareAI Accessibility Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Design System](./design-system.md), [Testing Strategy](../13-testing/testing-strategy.md)

Current UI includes semantic forms/fieldsets, labels, `aria-invalid`, error `role="alert"`, `aria-live` success status, focus-visible rings, alt text/empty decorative avatars, and a global reduced-motion style. This is **PARTIAL / NOT VERIFIED** by audit tooling.

**CARE-UI-002 — P0:** All controls require programmatic names, visible keyboard focus, sensible focus order, 44px touch targets where feasible, and sufficient contrast. Icon-only controls require labels. Segmented sex options need keyboard operation and selected state. Charts require textual latest/trend summaries; tooltips cannot be the only source of information. Test screen-reader flows, zoom/reflow, contrast, dialog/menu behavior, and motion reduction before release.
