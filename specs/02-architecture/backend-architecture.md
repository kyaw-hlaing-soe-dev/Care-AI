# CareAI Backend Architecture

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [API Contracts](../12-api/api-contracts.md), [OpenRouter](../06-ai/openrouter.md), [Security](../10-security/security.md)

## Current state — PARTIAL

`frontend/src/server.ts` now exposes a server-only `POST /api/vitals/analyze` operation with strict vital validation, deterministic scoring, OpenRouter timeout/retry, output normalization, safe failure, and warm-instance idempotency. It is not the target trusted production backend: Firebase Admin token verification, UID derivation, owner-scoped Firestore writes, durable idempotency, and separate analysis persistence are not implemented. The `backend/` Cloud Functions tree remains a scaffold.

## Target

Use Firebase Cloud Functions or an equivalent protected server:

```text
React → authenticated request → verify Firebase ID token → validate vitals
→ calculate deterministic score → write reading → OpenRouter → normalize output
→ write analysis → return safe response
```

The backend owns token verification, UID derivation, technical input validation, health-score execution, idempotency/duplicate protection, OpenRouter requests/timeouts/retries, schema normalization, trusted Firestore writes, and safe errors. It must never trust a raw UID from request input or expose provider error bodies.

## Requirement

**CARE-ARCH-001 — P0 / PARTIAL:** Local vital submission passes through the TanStack server before OpenRouter analysis, but every production submission must use verified identity and trusted Firestore persistence. See [TASK-AI-003](../14-development/implementation-plan.md#task-ai-003).
