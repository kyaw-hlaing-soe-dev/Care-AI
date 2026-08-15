# CareAI Vital Validation Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Vital Tracker](./vital-tracker.md), [Security](../10-security/security.md), [Error Handling](../12-api/error-handling.md)

## Current technical validation — IMPLEMENTED client-side

Every vital field is required. `VitalForm` trims the submitted string, converts it with `Number`, rejects non-finite values and values outside its technical limits, marks errors only after touch or submit, and focuses the first invalid input after submit. HTML numeric input modes provide appropriate phone keyboards.

## Firestore rule validation — IMPLEMENTED IN CODE, NOT DEPLOYED

**CARE-VITAL-002 — P0:** Repeat required field, type, range, unexpected-field, owner, timestamp, and deterministic-result checks in Firestore rules. Reject missing/null values, unexpected keys/types, negative values, impossible percentages, temperatures outside the supported input domain, and forged score/status results. Do not trust UI validation.

The Firestore service performs a second runtime finite-number/range check before writing; security rules are the deployed authorization and validation boundary. IEEE non-finite values are not valid Firestore numeric values. Date-of-birth calendar/future validation remains a UI/service concern because rules enforce only its bounded field shape.

Technical validation only determines whether the app can process an input. It must not be phrased as diagnosis or proof that a user is safe. Medical interpretation is limited by [AI Safety](../06-ai/ai-safety.md).
