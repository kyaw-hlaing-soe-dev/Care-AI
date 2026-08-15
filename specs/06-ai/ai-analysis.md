# CareAI AI Analysis Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [OpenRouter](./openrouter.md), [AI Safety](./ai-safety.md), [Health Score](../05-vitals/health-score.md)

## Current state — IMPLEMENTED IN CODE, NOT DEPLOYED

`POST /vitals/analyze` verifies Firebase identity, repeats technical validation, executes the deterministic score/status/urgency, persists the owner-scoped reading, sends minimal context to OpenRouter, normalizes untrusted output, and persists a separate linked analysis. Provider failure keeps the reading, records a safe failed analysis, and can be retried through a bounded private task.

## Target workflow

```text
Validated vitals → deterministic Health Score → minimal permitted context
→ protected OpenRouter request → normalize/validate response → save analysis → UI
```

Only required context may be sent: five validated readings, deterministic score, and an approved minimal trend summary; optionally age-derived context/sex only when justified by defined rules. Never send email, full name, photo URL, Firebase UID, Google ID, or unrelated profile fields.

**CARE-AI-002 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** AI failure keeps the Firestore reading, marks analysis `failed`, and shows saved-reading unavailable copy. Provider requests receive one internal transient retry; a durable authenticated operation queues a bounded private retry.
