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

**CARE-AI-003 — P0 / PARTIAL:** The TanStack server validates exact JSON keys, required types, enum values, non-empty bounded text, zero-to-three-item arrays, and prohibited medical language before returning content. Invalid, overlong, unsafe, or urgency-conflicting output produces a safe fallback rather than raw model content. Firestore storage validation remains unimplemented; the local `VitalAnalysis` shape adapts the normalized provider schema for current UI compatibility.
