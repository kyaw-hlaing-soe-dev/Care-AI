# CareAI History Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Dashboard](../07-dashboard/dashboard.md), [Firestore Queries](../09-database/firestore-queries.md), [AI Output Schema](../06-ai/ai-output-schema.md)

## Current implementation — IMPLEMENTED IN CODE, NOT DEPLOYED

`/history` uses a protected infinite query with All/7 Days/30 Days server filters and cursor pages of 20 newest-first owner records. `/history/$id` uses an owner-scoped detail operation and returns the linked analysis or a safe not-found/failure state.

## Target behavior

**CARE-HISTORY-001 — P1 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Query `users/{uid}/vitals` newest first, limit results, paginate using owner-scoped document cursors, and retrieve only the analysis linked by `readingId`. Not-found and failure states do not expose another user’s record.

Default sorting is newest first. Date filtering can be server-query-backed where indexed or safely filtered from an already fetched bounded user dataset; never query all users.
