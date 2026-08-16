# CareAI AI Analysis Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [OpenRouter](./openrouter.md), [AI Safety](./ai-safety.md), [Health Score](../05-vitals/health-score.md)

## Current state — OPTIONAL PROTECTED OPENROUTER IN SPARK MODE

The active Firebase data path remains Spark-compatible: the browser saves a rule-validated owner-scoped reading and derives a clearly labeled deterministic range insight. If the frontend is hosted on a protected server runtime and `VITE_CAREAI_AI_ANALYSIS_ENABLED=true` is configured, the latest/detail views may call `POST /api/vitals/analyze`; that server route calls OpenRouter with server-only `OPENROUTER_API_KEY`. OpenRouter must never be called directly from the browser because its API key would be exposed.

## Target workflow

```text
Validated vitals → deterministic Health Score → minimal permitted context
→ protected OpenRouter request → normalize/validate response → save analysis → UI
```

Only required context may be sent: five validated readings, deterministic score, and an approved minimal trend summary; optionally age-derived context/sex only when justified by defined rules. Never send email, full name, photo URL, Firebase UID, Google ID, or unrelated profile fields.

**CARE-AI-002 — P0 / PARTIAL IN SPARK MODE:** The reading is saved independently with `analysisStatus: "unavailable"` because Firestore cannot trust browser-written analysis documents. When configured, the protected server route may generate presentation-only OpenRouter analysis; output must pass the normalized schema and safety checks, and deterministic score/status/emergency/urgency remain authoritative. Persisted analysis documents remain deferred until a trusted server write path is approved.
