# CareAI OpenRouter Specification

**Status:** Active
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [AI Analysis](./ai-analysis.md), [AI Output Schema](./ai-output-schema.md), [Security](../10-security/security.md)

## Current state

**PARTIAL.** `frontend/src/lib/vitals-api-server.ts` calls OpenRouter only from the TanStack server endpoint using server environment configuration. It implements a 10-second timeout, one network/5xx retry, response-size bounds, exact normalization, deterministic urgency enforcement, a safe failure result, and warm-instance idempotency. Firebase token verification and durable Firestore/idempotency state are not implemented.

## Target provider contract

Provider: OpenRouter. Endpoint: `POST https://openrouter.ai/api/v1/chat/completions`. The protected backend, never the browser, holds and sends `Authorization: Bearer <OPENROUTER_API_KEY>`.

Required server-only configuration: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`. Optional: `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`. Do not document, commit, bundle, log, or expose actual secret values.

**CARE-AI-001 — P0 / PARTIAL:** One configured model, bounded timeout, one network/5xx retry, no invalid-input retry, normalized output, and saved-reading failure behavior are implemented. The request is server-side but not yet authenticated with a verified Firebase token, and persistence remains local rather than Firestore-backed.
