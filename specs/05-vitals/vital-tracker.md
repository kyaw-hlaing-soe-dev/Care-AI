# CareAI Vital Tracker Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Validation](./validation.md), [Health Score](./health-score.md), [AI Analysis](../06-ai/ai-analysis.md), [Firestore Schema](../09-database/firestore-schema.md)

## Current implementation — IMPLEMENTED IN CODE, NOT DEPLOYED

`VitalForm` on `/add` accepts the following values and submits them through the authenticated Firestore service after client validation. It locks while submitting, supplies an idempotency key, displays a success transition, refreshes private query state, and returns to dashboard.

| Input | Current field | Unit | Current technical range | Target database field |
| --- | --- | --- | --- | --- |
| Systolic | `systolic` | mmHg | 50–300 | `systolic` |
| Diastolic | `diastolic` | mmHg | 30–200 | `diastolic` |
| Heart rate | `heartRate` | bpm | 20–250 | `heartRate` |
| Oxygen saturation | `oxygen` | % | 50–100 | `oxygenSaturation` |
| Temperature | `temperature` | °C | 30–45 | `temperatureC` |

The service maps owner-scoped Firestore readings into the existing UI record shape and derives range-based insight text without storing private records in browser localStorage. No AI analysis document is created in Spark mode.

## Target submission

**CARE-VITAL-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Enter → client/service validation → deterministic score → Firestore owner/shape/range/result rule validation → immutable owner-scoped vital write → dashboard refresh. A transaction plus the idempotency key as document ID prevents a reused key from creating a second reading. UI limits are technical sanity limits, not diagnosis or clinical triage policy.
