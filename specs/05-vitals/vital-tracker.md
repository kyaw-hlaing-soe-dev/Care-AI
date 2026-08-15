# CareAI Vital Tracker Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Validation](./validation.md), [Health Score](./health-score.md), [AI Analysis](../06-ai/ai-analysis.md), [Firestore Schema](../09-database/firestore-schema.md)

## Current implementation — IMPLEMENTED IN CODE, NOT DEPLOYED

`VitalForm` on `/add` accepts the following values and submits them through the authenticated API after client validation. It locks while submitting, supplies an idempotency key, displays a success transition, refreshes private query state, and returns to dashboard.

| Input | Current field | Unit | Current technical range | Target database field |
| --- | --- | --- | --- | --- |
| Systolic | `systolic` | mmHg | 50–300 | `systolic` |
| Diastolic | `diastolic` | mmHg | 30–200 | `diastolic` |
| Heart rate | `heartRate` | bpm | 20–250 | `heartRate` |
| Oxygen saturation | `oxygen` | % | 50–100 | `oxygenSaturation` |
| Temperature | `temperature` | °C | 30–45 | `temperatureC` |

The API maps owner-scoped Firestore reading and linked analysis documents into the existing UI record shape without storing private records in browser localStorage.

## Target submission

**CARE-VITAL-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Enter → client validation → authenticated backend → server validation → deterministic score → owner-scoped vital write → minimal AI request → normalized analysis write → dashboard refresh. Durable idempotency prevents a reused key from creating a second reading. UI limits are technical sanity limits, not diagnosis or clinical triage policy.
