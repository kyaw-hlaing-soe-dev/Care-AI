# CareAI OpenRouter Specification

**Status:** Active
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [AI Analysis](./ai-analysis.md), [AI Output Schema](./ai-output-schema.md), [Security](../10-security/security.md)

## Current state — INACTIVE

The Spark-plan frontend never calls OpenRouter and contains no OpenRouter configuration. The prior Cloud Functions implementation remains under `backend/` but is absent from `firebase.json` and unused by the app. Reactivating it requires a protected server deployment and explicit configuration approval.

## Target provider contract

Provider: OpenRouter. Endpoint: `POST https://openrouter.ai/api/v1/chat/completions`. The protected backend, never the browser, holds and sends `Authorization: Bearer <OPENROUTER_API_KEY>`.

Required server-only configuration: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`. Optional: `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`. Do not document, commit, bundle, log, or expose actual secret values.

**CARE-AI-001 — P0 / DEFERRED IN SPARK MODE:** No provider/model is configured or called. Browser code must never receive `OPENROUTER_API_KEY`; the protected contract above remains mandatory for any future server implementation.
