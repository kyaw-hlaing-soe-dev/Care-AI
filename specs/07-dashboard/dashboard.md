# CareAI Dashboard Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Health Trends](./health-trends.md), [Firestore Queries](../09-database/firestore-queries.md), [AI Analysis](../06-ai/ai-analysis.md)

## Current implementation — IMPLEMENTED IN CODE, NOT DEPLOYED

`/dashboard` is protected by resolved Firebase auth and completed Firestore profile state. Its React Query hook performs a bounded owner-scoped Firestore query for the latest reading, trends, and recent logs. Loading, empty, query-failure, rule-based-insight, and deterministic emergency states remain distinct.

| Widget | Current source | Target source | Empty/loading/error |
| --- | --- | --- | --- |
| Greeting | authenticated API profile | authenticated profile | loading/failure handled by profile boundary |
| Health Score/vitals | latest owned API reading | latest user vital | empty/loading/query failure |
| Insight | local deterministic range result | deterministic range result | Spark-mode notice plus disclaimer |
| Trends | bounded owned Firestore readings | recent user vitals | zero/one/multiple record states |
| Recent logs | bounded owned Firestore readings | newest user vitals | empty/loading/query failure |

**CARE-DASH-001 — P1 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Dashboard queries derive UID from the current Firebase session and rules independently enforce ownership. The UI distinguishes loading, no data, query failure, and deterministic Spark-mode insight states. Live permission/database failure and responsive E2E acceptance remain outstanding.
