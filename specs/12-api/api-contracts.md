# CareAI API Contracts

**Status:** Inactive in Spark mode
**Version:** 1.1
**Last Updated:** 2026-08-15
**Related:** [Frontend Architecture](../02-architecture/frontend-architecture.md), [Firestore Rules](../10-security/firestore-rules.md)

## Current state

The active frontend makes no CareAI REST API requests. `VITE_CAREAI_API_BASE_URL` is removed. Firebase Authentication and the modular Firestore SDK provide the active service boundary.

## Active data operations

- **Profile:** owner document get, validated transaction create/replace, validated language update.
- **Vitals:** transaction create at an idempotency-key document ID; duplicate same-input submission returns the existing record; different input with the same key fails.
- **Dashboard:** at most 30 newest owner readings.
- **History:** pages of 20 newest owner readings with optional 7/30-day cutoff and `createdAt`/document-ID cursor.
- **Detail:** one owner vital document by validated ID.

The service never accepts a UID parameter. Firestore rules authorize and validate the resulting requests. The old Functions REST code is inactive reference code and must not be described as deployed.
