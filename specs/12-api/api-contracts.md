# CareAI API Contracts

**Status:** Implemented, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-15
**Related:** [Backend Architecture](../02-architecture/backend-architecture.md), [AI Output Schema](../06-ai/ai-output-schema.md)

## Current state

**IMPLEMENTED, NOT DEPLOYED.** The Cloud Functions REST API implements verified authentication, trusted persistence, stable safe envelopes, and the operations below. Live Firebase configuration and end-to-end acceptance remain outstanding.

## Target operations

- **Create/Update Profile:** authenticated; input fields in [User Profile](../04-profile/user-profile.md); output owner profile; side effect writes `users/{uid}`.
- **Get Dashboard:** authenticated; output profile, latest reading, latest analysis, bounded trends/recent logs; no cross-user data.
- **Analyze Vitals:** authenticated; input five numeric values; output `{ reading, healthScore, analysis }`; side effects validate, score, write vital, request/normalize AI, write analysis. AI failure returns saved reading plus analysis status.
- **Get History:** authenticated; cursor/filter input; output paginated owned readings and safe linked analysis summaries.
- **Retry Analysis:** authenticated owner-only operation; schedules a bounded private retry and rejects completed or exhausted work safely.

All requests derive UID from verified token, return stable safe error codes, and never include provider secrets/raw errors.
