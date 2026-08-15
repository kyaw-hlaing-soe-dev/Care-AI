# CareAI Dashboard Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Health Trends](./health-trends.md), [Firestore Queries](../09-database/firestore-queries.md), [AI Analysis](../06-ai/ai-analysis.md)

## Current implementation — IMPLEMENTED IN CODE, NOT DEPLOYED

`/dashboard` is protected by resolved Firebase auth and completed API profile state. Its React Query hook loads a bounded owner-scoped dashboard payload with latest reading, linked analyses, trends, and recent logs. Loading, empty, query-failure, AI-unavailable, and deterministic emergency states remain distinct.

| Widget | Current source | Target source | Empty/loading/error |
| --- | --- | --- | --- |
| Greeting | authenticated API profile | authenticated profile | loading/failure handled by profile boundary |
| Health Score/vitals | latest owned API reading | latest user vital | empty/loading/query failure |
| Insight | linked normalized analysis | linked/latest normalized analysis | pending/failed state plus disclaimer |
| Trends | bounded owned API readings | recent user vitals | zero/one/multiple record states |
| Recent logs | bounded owned API readings | newest user vitals | empty/loading/query failure |

**CARE-DASH-001 — P1 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Dashboard queries derive UID from the verified token and distinguish loading, no data, general query failure, and AI-unavailable states. Live permission/database failure and responsive E2E acceptance remain outstanding.
