# CareAI OpenRouter Specification

**Status:** Active
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [AI Analysis](./ai-analysis.md), [AI Output Schema](./ai-output-schema.md), [Security](../10-security/security.md)

## Current state — INACTIVE

The Spark-plan frontend never calls OpenRouter directly and contains no OpenRouter secret. The frontend server runtime can expose `POST /api/vitals/analyze` and call OpenRouter only when `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` are configured server-side. The prior Cloud Functions implementation remains under `backend/` but is absent from `firebase.json` and unused by the app.

## Target provider contract

Provider: OpenRouter. Endpoint: `POST https://openrouter.ai/api/v1/chat/completions`. The protected backend, never the browser, holds and sends `Authorization: Bearer <OPENROUTER_API_KEY>`.

Required server-only configuration: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`. Optional: `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`. The browser gate `VITE_CAREAI_AI_ANALYSIS_ENABLED=true` may be public, but it must not contain a provider secret. Do not document, commit, bundle, log, or expose actual secret values.

**CARE-AI-001 — P0 / PARTIAL IN SPARK MODE:** Browser code must never receive `OPENROUTER_API_KEY`. OpenRouter may be called only by the protected frontend server route or a future backend. Missing configuration returns the safe unavailable fallback.
