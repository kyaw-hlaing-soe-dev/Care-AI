# CareAI OpenRouter Specification

**Status:** Active
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [AI Analysis](./ai-analysis.md), [AI Output Schema](./ai-output-schema.md), [Security](../10-security/security.md)

## Current state

**IMPLEMENTED IN CODE, NOT DEPLOYED.** The Cloud Functions backend calls OpenRouter with server-only parameter/secret configuration. It implements a 10-second timeout, one network/5xx retry, response-size bounds, exact normalization, deterministic urgency enforcement, safe failure persistence, durable Firestore idempotency, and a bounded private retry task. Live secret/model configuration and provider acceptance remain outstanding.

## Target provider contract

Provider: OpenRouter. Endpoint: `POST https://openrouter.ai/api/v1/chat/completions`. The protected backend, never the browser, holds and sends `Authorization: Bearer <OPENROUTER_API_KEY>`.

Required server-only configuration: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`. Optional: `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`. Do not document, commit, bundle, log, or expose actual secret values.

**CARE-AI-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** One configured model, bounded timeout, one network/5xx retry, no invalid-input retry, normalized output, verified Firebase identity, and saved-reading failure behavior are implemented behind the Cloud Functions boundary.
