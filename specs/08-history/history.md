# CareAI History Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Dashboard](../07-dashboard/dashboard.md), [Firestore Queries](../09-database/firestore-queries.md), [AI Output Schema](../06-ai/ai-output-schema.md)

## Current implementation — IMPLEMENTED IN CODE, NOT DEPLOYED

`/history` uses a direct owner-scoped Firestore infinite query with All/7 Days/30 Days filters and cursor pages of 20 newest-first records. `/history/$id` reads one owner path and derives the deterministic range insight or returns a safe not-found/failure state.

## Target behavior

**CARE-HISTORY-001 — P1 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Query `users/{uid}/vitals` newest first, limit results, and paginate using an owner-scoped `createdAt` plus document-ID cursor. Not-found and failure states do not expose another user’s record. No analysis collection query runs in Spark mode.

Default sorting is newest first. Date filtering can be server-query-backed where indexed or safely filtered from an already fetched bounded user dataset; never query all users.
