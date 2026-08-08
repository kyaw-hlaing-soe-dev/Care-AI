# CareAI OpenRouter Specification

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [AI Analysis](./ai-analysis.md), [AI Output Schema](./ai-output-schema.md), [Security](../10-security/security.md)

## Current state

**NOT IMPLEMENTED.** No OpenRouter dependency, endpoint, browser request, server request, or environment-variable reference exists outside the repository’s planning document.

## Target provider contract

Provider: OpenRouter. Endpoint: `POST https://openrouter.ai/api/v1/chat/completions`. The protected backend, never the browser, holds and sends `Authorization: Bearer <OPENROUTER_API_KEY>`.

Required server-only configuration: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`. Optional: `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`. Do not document, commit, bundle, log, or expose actual secret values.

**CARE-AI-001 — P0 / NOT IMPLEMENTED:** A verified backend request uses one approved configured model, a bounded timeout, at most one safe retry for network/5xx failures, no retry for invalid input, and normalized output. Provider failure must not delete a successfully saved vital reading.
