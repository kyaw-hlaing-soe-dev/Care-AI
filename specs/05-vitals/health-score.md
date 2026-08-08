# CareAI Health Score Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Vital Tracker](./vital-tracker.md), [AI Analysis](../06-ai/ai-analysis.md), [Testing Strategy](../13-testing/testing-strategy.md)

## Exact current algorithm — IMPLEMENTED

The authoritative current function is `analyzeVitals()` in `src/lib/vitals.ts`. Reference ranges are: temperature 36.1–37.2 °C, systolic 90–120 mmHg, diastolic 60–80 mmHg, heart rate 60–100 bpm, and oxygen 95–100%.

For each of five values outside its inclusive reference range, increment `deviations` by 1. Set `emergency` when oxygen `< 90`, temperature `>= 39.5`, systolic `>= 180`, diastolic `>= 120`, heart rate `>= 130`, or heart rate `<= 40`.

```text
score = max(0, 100 - (deviations × 12) - (emergency ? 25 : 0))
status = Urgent if emergency; Good if deviations = 0; otherwise Attention Needed
```

Score is integer-valued with range 0–100; no rounding step is needed. Missing data never reaches this function because the form requires all inputs. The function also produces range-based lists and recommendations.

## Target execution

**CARE-SCORE-001 — P0 / PARTIAL:** Preserve deterministic behavior, test boundary conditions, and move the authoritative execution to the protected backend before production. OpenRouter must receive the already calculated score and must never invent the authoritative numeric score.
