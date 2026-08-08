# CareAI History Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Dashboard](../07-dashboard/dashboard.md), [Firestore Queries](../09-database/firestore-queries.md), [AI Output Schema](../06-ai/ai-output-schema.md)

## Current implementation — IMPLEMENTED locally

`/history` uses `useVitals()` and sorts newest first through `listVitals()`. It offers All/7 Days/30 Days filtering, summary cards, expandable `HistoryItem`s, empty/filter-empty states, and local “Load More” increments of 20. `/history/$id` exists as a route file and should resolve only an owned record in the target architecture.

## Target behavior

**CARE-HISTORY-001 — P1 / PARTIAL:** Query `users/{uid}/vitals` newest first, limit results, paginate using document cursors, and retrieve only the analysis linked by `readingId`. A not-found/missing analysis state must not expose a different user’s record. Database loading, permission denial, and network failures require user-facing safe error states.

Default sorting is newest first. Date filtering can be server-query-backed where indexed or safely filtered from an already fetched bounded user dataset; never query all users.
