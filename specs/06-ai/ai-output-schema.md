# CareAI AI Output Schema

**Status:** Active
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [AI Analysis](./ai-analysis.md), [API Contracts](../12-api/api-contracts.md)

## Target normalized contract

```json
{
  "summary": "string",
  "whatLooksGood": ["string"],
  "areasToWatch": ["string"],
  "recommendations": ["string"],
  "urgency": "routine | monitor | seek-care",
  "disclaimer": "string"
}
```

`summary`, all arrays, `urgency`, and `disclaimer` are required after normalization. Use zero to three concise strings per array; disallow arbitrary urgency labels. `disclaimer` must state that CareAI offers informational insights and is not a substitute for professional medical advice.

**CARE-AI-003 — P0 / PARTIAL IN SPARK MODE:** The protected frontend server route accepts model output only after exact-key schema normalization, list bounds, urgency validation, deterministic urgency matching, and safety checks. Accepted output is presentation-only and is merged into the UI view; it is not persisted as trusted Firestore data. Browser-only/static hosting builds its `VitalAnalysis` view from deterministic local logic and labels the provider as `deterministic`.
