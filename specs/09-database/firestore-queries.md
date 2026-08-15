# CareAI Firestore Queries

**Status:** Firestore indexes deployed; browser E2E pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Dashboard](../07-dashboard/dashboard.md), [History](../08-history/history.md)

## Current state

**IMPLEMENTED IN CODE, NOT DEPLOYED.** The frontend Firestore service performs bounded newest-first dashboard and cursor-paginated history queries under the current Firebase UID. Rules independently enforce owner-only access. No analysis join is performed in Spark mode.

## Target query patterns

- Profile: read `users/{verifiedUid}`.
- Latest: `users/{uid}/vitals`, `orderBy(createdAt, desc)`, `limit(1)`.
- Dashboard/trends: same path, newest first, bounded limit (for example 7–30), then reverse in UI for charts.
- History: `orderBy(createdAt, desc)`, `orderBy(documentId(), desc)`, optional same-field date cutoff, `limit(pageSize + 1)`, and `startAfter(createdAt, documentId)`; default newest first.
- Analysis: none in Spark mode; range-based insight is derived from each validated reading.

Single-field `createdAt desc` needs no composite index in the expected simple queries. Any added filter + ordering must list required Firestore indexes in deployment configuration. No collection-group or cross-user query is permitted for user UI.
