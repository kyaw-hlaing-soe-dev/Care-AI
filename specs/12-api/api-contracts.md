# CareAI API Contracts

**Status:** Active Firestore boundary; optional protected AI route
**Version:** 1.1
**Last Updated:** 2026-08-15
**Related:** [Frontend Architecture](../02-architecture/frontend-architecture.md), [Firestore Rules](../10-security/firestore-rules.md)

## Current state

Firebase Authentication and the modular Firestore SDK provide the active persistence boundary. `VITE_CAREAI_API_BASE_URL` is removed. The only active CareAI REST route is optional presentation-only AI analysis at `POST /api/vitals/analyze`, exposed by the protected frontend server runtime; it is not a Firestore authorization boundary and must not run from browser-only/static hosting with a provider secret.

## Active data operations

- **Profile:** owner document get, validated transaction create/replace, validated language update.
- **Vitals:** transaction create at an idempotency-key document ID; duplicate same-input submission returns the existing record; different input with the same key fails.
- **Dashboard:** at most 30 newest owner readings.
- **History:** pages of 20 newest owner readings with optional 7/30-day cutoff and `createdAt`/document-ID cursor.
- **Detail:** one owner vital document by validated ID.

The service never accepts a UID parameter. Firestore rules authorize and validate the resulting requests. The old Functions REST code is inactive reference code and must not be described as deployed.

## Optional AI route

- **Route:** `POST /api/vitals/analyze`
- **Request body:** exactly `systolic`, `diastolic`, `heartRate`, `oxygen`, and `temperature` as numeric values inside documented technical limits.
- **Header:** optional `idempotency-key`, 8 to 128 permitted characters, used for warm-instance response reuse only.
- **Success:** returns deterministic `healthScore`, an analysis object, and `analysisStatus: "completed"` when provider output passes normalization.
- **Fallback:** returns `analysisStatus: "failed"` and `AI_ERROR` with safe unavailable copy when server config is missing, the provider fails, output is malformed/unsafe/oversized, urgency conflicts, or a timeout occurs.
- **Privacy:** the provider request contains only the five validated readings, deterministic score, and deterministic application urgency.
