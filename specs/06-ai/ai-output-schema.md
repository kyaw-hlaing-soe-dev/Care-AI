# CareAI AI Output Schema

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
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

**CARE-AI-003 — P0 / NOT IMPLEMENTED:** The backend validates JSON and types before storage. Invalid JSON, unsupported enum values, missing required fields, overlong arrays, or unsafe text produce a safe fallback analysis/status rather than raw model content. The existing local `VitalAnalysis` shape is an implementation stand-in, not this provider schema.
