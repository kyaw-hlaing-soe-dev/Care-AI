# CareAI Implementation Plan

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-15
**Related:** [System Architecture](../02-architecture/system-architecture.md), [Testing Strategy](../13-testing/testing-strategy.md)

## P0 — MVP blockers

### TASK-AUTH-001

**Status:** IMPLEMENTED, NOT DEPLOYED. Firebase Google Auth, session observation, logout, loading behavior, token-bearing API calls, and explicit emulator support replace mock identity. Project/provider configuration and E2E acceptance remain. **Related:** `03-auth/authentication.md`. **Acceptance:** AC-AUTH-001. **Dependency:** Firebase project/config.

### TASK-DB-001

**Status:** IMPLEMENTED, NOT DEPLOYED. Owner-read/server-write rules, schema paths, indexes, deny-by-default Storage rules, durable protected persistence, and a one-time legacy-local-data cutover are implemented. Rules emulator and deployed acceptance remain. **Related:** `09-database/*`, `10-security/firestore-rules.md`. **Acceptance:** AC-SEC-001. **Dependency:** TASK-AUTH-001.

### TASK-AI-003

**Status:** IMPLEMENTED, NOT DEPLOYED. The Cloud Functions API implements verified UID derivation, server validation, deterministic scoring, owner-scoped reading and analysis persistence, minimal OpenRouter context, strict normalization/safety checks, timeout/retry, durable idempotency, failure preservation, and a bounded private retry task. Deployment and E2E acceptance remain. **Related:** `02-architecture/backend-architecture.md`, `06-ai/*`. **Acceptance:** AC-VITAL-001, AC-AI-001. **Dependency:** TASK-AUTH-001, TASK-DB-001.

## P1 — Important improvements

- **TASK-DASH-001 / IMPLEMENTED, NOT DEPLOYED:** UID-scoped bounded dashboard/history API queries and cursor pagination replace local persistence. Related: `07-dashboard/*`, `08-history/history.md`.
- **TASK-TEST-001 / PARTIAL:** Deterministic-score, validation, safe-error, AI provider, and Firestore owner-rule tests are implemented and passing. A Storage denial test is implemented but its emulator runtime download is unverified; auth/API integration, component, and E2E coverage remain. Related: `13-testing/testing-strategy.md`.

## P2 — Post-MVP

- **TASK-STORAGE-001 / PLANNED:** Optional validated profile-avatar upload with Storage rules.
- **TASK-OBS-001 / PLANNED:** Privacy-safe monitoring, retention, and operational analytics after security review.
