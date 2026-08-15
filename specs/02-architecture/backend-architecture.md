# CareAI Backend Architecture

**Status:** Implemented, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-15
**Related:** [API Contracts](../12-api/api-contracts.md), [OpenRouter](../06-ai/openrouter.md), [Security](../10-security/security.md)

## Current state — PARTIAL

`backend/` implements the regional HTTPS API and private Cloud Tasks retry function. It verifies Firebase ID tokens, derives UID server-side, validates requests, executes the deterministic score, persists owner-scoped readings and separate analyses, uses durable idempotency keys, and normalizes server-only OpenRouter output. The old unauthenticated TanStack analysis route is no longer registered.

Deployment and live-environment verification are pending. This status does not claim that Firebase rules, project configuration, secrets, or Google authentication are deployed.

## Target

Use Firebase Cloud Functions or an equivalent protected server:

```text
React → authenticated request → verify Firebase ID token → validate vitals
→ calculate deterministic score → write reading → OpenRouter → normalize output
→ write analysis → return safe response
```

The backend owns token verification, UID derivation, technical input validation, health-score execution, idempotency/duplicate protection, OpenRouter requests/timeouts/retries, schema normalization, trusted Firestore writes, and safe errors. It must never trust a raw UID from request input or expose provider error bodies.

## Requirement

**CARE-ARCH-001 — P0 / IMPLEMENTED, NOT DEPLOYED:** The application code sends vital submissions through a verified-identity Cloud Functions boundary with trusted Firestore persistence. Live deployment and end-to-end acceptance remain required. See [TASK-AI-003](../14-development/implementation-plan.md#task-ai-003).
