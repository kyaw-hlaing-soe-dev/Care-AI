# CareAI Firestore Queries

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Dashboard](../07-dashboard/dashboard.md), [History](../08-history/history.md)

## Current state

**IMPLEMENTED IN CODE, NOT DEPLOYED.** The backend performs bounded newest-first dashboard and cursor-paginated history queries under the UID derived from the verified token, then joins only same-owner analysis documents.

## Target query patterns

- Profile: read `users/{verifiedUid}`.
- Latest: `users/{uid}/vitals`, `orderBy(createdAt, desc)`, `limit(1)`.
- Dashboard/trends: same path, newest first, bounded limit (for example 7–30), then reverse in UI for charts.
- History: same sort, page with `limit(pageSize)` and `startAfter(lastVisible)`; default newest first.
- Analysis: query the authenticated user’s `analyses` by `readingId`, or store/link the analysis ID with the reading according to final schema.

Single-field `createdAt desc` needs no composite index in the expected simple queries. Any added filter + ordering must list required Firestore indexes in deployment configuration. No collection-group or cross-user query is permitted for user UI.
