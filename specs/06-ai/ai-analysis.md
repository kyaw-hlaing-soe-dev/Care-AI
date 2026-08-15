# CareAI AI Analysis Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [OpenRouter](./openrouter.md), [AI Safety](./ai-safety.md), [Health Score](../05-vitals/health-score.md)

## Current state — DEFERRED IN SPARK MODE

The active frontend does not register or call an AI endpoint. It saves a rule-validated owner-scoped reading and derives a clearly labeled deterministic range insight. OpenRouter cannot be called safely from a browser-only Spark architecture because its API key would be exposed.

## Target workflow

```text
Validated vitals → deterministic Health Score → minimal permitted context
→ protected OpenRouter request → normalize/validate response → save analysis → UI
```

Only required context may be sent: five validated readings, deterministic score, and an approved minimal trend summary; optionally age-derived context/sex only when justified by defined rules. Never send email, full name, photo URL, Firebase UID, Google ID, or unrelated profile fields.

**CARE-AI-002 — P0 / DEFERRED IN SPARK MODE:** No provider request or retry is attempted. The reading is saved independently with `analysisStatus: "unavailable"`, and the UI states that AI is disabled in Firestore-only mode. The retained inactive backend implements the prior protected workflow for possible future use.
