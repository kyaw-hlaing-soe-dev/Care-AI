# CareAI API Contracts

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Backend Architecture](../02-architecture/backend-architecture.md), [AI Output Schema](../06-ai/ai-output-schema.md)

## Current state

**NOT IMPLEMENTED.** Current UI calls local functions directly.

## Target operations

- **Create/Update Profile:** authenticated; input fields in [User Profile](../04-profile/user-profile.md); output owner profile; side effect writes `users/{uid}`.
- **Get Dashboard:** authenticated; output profile, latest reading, latest analysis, bounded trends/recent logs; no cross-user data.
- **Analyze Vitals:** authenticated; input five numeric values; output `{ reading, healthScore, analysis }`; side effects validate, score, write vital, request/normalize AI, write analysis. AI failure returns saved reading plus analysis status.
- **Get History:** authenticated; cursor/filter input; output paginated owned readings and safe linked analysis summaries.

All requests derive UID from verified token, return stable safe error codes, and never include provider secrets/raw errors.
