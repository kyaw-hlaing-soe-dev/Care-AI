# CareAI Implementation Plan

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [System Architecture](../02-architecture/system-architecture.md), [Testing Strategy](../13-testing/testing-strategy.md)

## P0 — MVP blockers

### TASK-AUTH-001

**Status:** NOT IMPLEMENTED. Replace mock localStorage authentication with Firebase Google Auth and protected redirect/loading behavior. **Related:** `03-auth/authentication.md`. **Acceptance:** AC-AUTH-001. **Dependency:** Firebase project/config.

### TASK-DB-001

**Status:** NOT IMPLEMENTED. Define/deploy Firestore schema and owner-only rules; migrate browser profile/vitals state. **Related:** `09-database/*`, `10-security/firestore-rules.md`. **Acceptance:** AC-SEC-001. **Dependency:** TASK-AUTH-001.

### TASK-AI-003

**Status:** NOT IMPLEMENTED. Build protected token-verifying vital endpoint/function with server validation, deterministic score, Firestore writes, OpenRouter normalization, timeout/failure handling. **Related:** `02-architecture/backend-architecture.md`, `06-ai/*`. **Acceptance:** AC-VITAL-001, AC-AI-001. **Dependency:** TASK-AUTH-001, TASK-DB-001.

## P1 — Important improvements

- **TASK-DASH-001 / PARTIAL:** Replace local dashboard/history hooks with UID-scoped Firestore queries and cursor pagination. Related: `07-dashboard/*`, `08-history/history.md`.
- **TASK-TEST-001 / NOT IMPLEMENTED:** Add unit/integration/E2E coverage for score, auth, ownership, AI failure, and responsive smoke checks. Related: `13-testing/testing-strategy.md`.

## P2 — Post-MVP

- **TASK-STORAGE-001 / PLANNED:** Optional validated profile-avatar upload with Storage rules.
- **TASK-OBS-001 / PLANNED:** Privacy-safe monitoring, retention, and operational analytics after security review.
