# CareAI Dashboard Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Health Trends](./health-trends.md), [Firestore Queries](../09-database/firestore-queries.md), [AI Analysis](../06-ai/ai-analysis.md)

## Current implementation — PARTIAL

`/dashboard` is protected by mock auth/profile state. With local records it displays a time-based greeting, latest health-score overview, four vital cards, AI insight panel, trend preview, and recent logs. It shows a full-screen loading indicator while the local hook initializes and a “No health readings yet” CTA when empty. `EmergencyBanner` appears for current `analysis.emergency`.

| Widget | Current source | Target source | Empty/loading/error |
| --- | --- | --- | --- |
| Greeting | profile/mock user | authenticated profile | local fallback; no remote error |
| Health Score/vitals | latest local record | latest user vital | empty CTA/loading; error missing |
| Insight | local `analysis` | linked/latest normalized analysis | no provider-failure state |
| Trends | local records | recent user vitals | handled locally; remote error missing |
| Recent logs | local records | newest user vitals | local list/empty; pagination absent |

**CARE-DASH-001 — P1 / PARTIAL:** Dashboard queries must be UID-scoped and distinguish loading, no data, permission, database, and AI-unavailable states. Responsive cards/charts must stay readable without fake authenticated data.
