# CareAI AI Analysis Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [OpenRouter](./openrouter.md), [AI Safety](./ai-safety.md), [Health Score](../05-vitals/health-score.md)

## Current state — PARTIAL

`analyzeVitals()` is a deterministic local stand-in. It generates `summary`, `good`, `concerns`, `recommendations`, `status`, `emergency`, and `score` from reference ranges. It does not call an AI provider, persist analysis separately, normalize untrusted output, or handle provider failure.

## Target workflow

```text
Validated vitals → deterministic Health Score → minimal permitted context
→ protected OpenRouter request → normalize/validate response → save analysis → UI
```

Only required context may be sent: five validated readings, deterministic score, and an approved minimal trend summary; optionally age-derived context/sex only when justified by defined rules. Never send email, full name, photo URL, Firebase UID, Google ID, or unrelated profile fields.

**CARE-AI-002 — P0 / NOT IMPLEMENTED:** When AI fails, keep the reading, mark analysis `pending` or `failed`, show “Your reading was saved, but CareAI analysis is temporarily unavailable,” and permit a controlled backend retry.
