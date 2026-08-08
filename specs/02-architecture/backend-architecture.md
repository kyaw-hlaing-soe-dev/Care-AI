# CareAI Backend Architecture

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [API Contracts](../12-api/api-contracts.md), [OpenRouter](../06-ai/openrouter.md), [Security](../10-security/security.md)

## Current state

**NOT IMPLEMENTED.** No backend application operation, Firebase Cloud Function, Firebase Admin SDK, or OpenRouter call exists in the repository. TanStack Start’s generic server bootstrap and CSRF middleware do not constitute the required backend.

## Target

Use Firebase Cloud Functions or an equivalent protected server:

```text
React → authenticated request → verify Firebase ID token → validate vitals
→ calculate deterministic score → write reading → OpenRouter → normalize output
→ write analysis → return safe response
```

The backend owns token verification, UID derivation, technical input validation, health-score execution, idempotency/duplicate protection, OpenRouter requests/timeouts/retries, schema normalization, trusted Firestore writes, and safe errors. It must never trust a raw UID from request input or expose provider error bodies.

## Requirement

**CARE-ARCH-001 — P0 / NOT IMPLEMENTED:** Every production vital submission must pass through a trusted backend before Firestore/AI persistence. See [TASK-AI-003](../14-development/implementation-plan.md#task-ai-003).
