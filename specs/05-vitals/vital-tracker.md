# CareAI Vital Tracker Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Validation](./validation.md), [Health Score](./health-score.md), [AI Analysis](../06-ai/ai-analysis.md), [Firestore Schema](../09-database/firestore-schema.md)

## Current implementation — IMPLEMENTED locally

`VitalForm` on `/add` accepts the following values and calls `createVital()` after client validation. It locks while submitting, displays a success transition, and returns to dashboard.

| Input | Current field | Unit | Current technical range | Target database field |
| --- | --- | --- | --- | --- |
| Systolic | `systolic` | mmHg | 50–300 | `systolic` |
| Diastolic | `diastolic` | mmHg | 30–200 | `diastolic` |
| Heart rate | `heartRate` | bpm | 20–250 | `heartRate` |
| Oxygen saturation | `oxygen` | % | 50–100 | `oxygenSaturation` |
| Temperature | `temperature` | °C | 30–45 | `temperatureC` |

The current local record has `id`, `recordedAt` ISO timestamp, the five fields, and a combined `analysis` object.

## Target submission

**CARE-VITAL-001 — P0 / PARTIAL:** Enter → client validation → authenticated backend → server validation → deterministic score → owner-scoped vital write → minimal AI request → normalized analysis write → dashboard refresh. UI limits are technical sanity limits, not diagnosis or clinical triage policy. Server validation and remote persistence are NOT IMPLEMENTED.
