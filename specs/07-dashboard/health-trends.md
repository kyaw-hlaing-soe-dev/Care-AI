# CareAI Health Trends Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Dashboard](./dashboard.md), [History](../08-history/history.md), [Firestore Queries](../09-database/firestore-queries.md)

## Current state — IMPLEMENTED IN CODE, NOT DEPLOYED

`TrendPreview` derives chart/summary inputs from bounded owner-scoped records supplied by the direct Firestore dashboard query. It represents zero, one, and multiple readings without inventing missing data.

## Target behavior

**CARE-DASH-002 — P1 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Query a bounded newest-first Firestore set, transform it into chronological chart points, and clearly label dates/local time. No readings shows an empty state; one reading shows a single accessible point/no change, not an invented trend.

Desktop charts may show fuller labels/tooltips. On mobile, retain legible labels, a textual latest/previous summary, and no horizontal scrolling. Chart data must come only from the authenticated user’s real records; marketing charts remain demo-only.
