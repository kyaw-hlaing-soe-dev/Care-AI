# CareAI AI Analysis Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [OpenRouter](./openrouter.md), [AI Safety](./ai-safety.md), [Health Score](../05-vitals/health-score.md)

## Current state — PARTIAL

`POST /api/vitals/analyze` now repeats technical validation, executes `analyzeVitals()` server-side for the authoritative score/status/urgency, sends minimal context to OpenRouter, normalizes untrusted output, and returns a combined local record. Provider failure returns the saved-reading fallback and the client persists that record locally. Verified authentication, Firestore writes, separate analysis persistence, and a durable backend retry operation are not implemented.

## Target workflow

```text
Validated vitals → deterministic Health Score → minimal permitted context
→ protected OpenRouter request → normalize/validate response → save analysis → UI
```

Only required context may be sent: five validated readings, deterministic score, and an approved minimal trend summary; optionally age-derived context/sex only when justified by defined rules. Never send email, full name, photo URL, Firebase UID, Google ID, or unrelated profile fields.

**CARE-AI-002 — P0 / PARTIAL:** AI failure keeps and locally saves the reading, marks analysis `failed`, and shows “Your reading was saved, but CareAI analysis is temporarily unavailable.” Provider requests receive one internal transient retry. A durable authenticated retry operation still depends on Firestore/Firebase implementation.
