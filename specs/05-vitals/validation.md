# CareAI Vital Validation Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Vital Tracker](./vital-tracker.md), [Security](../10-security/security.md), [Error Handling](../12-api/error-handling.md)

## Current technical validation — IMPLEMENTED client-side

Every vital field is required. `VitalForm` trims the submitted string, converts it with `Number`, rejects non-finite values and values outside its technical limits, marks errors only after touch or submit, and focuses the first invalid input after submit. HTML numeric input modes provide appropriate phone keyboards.

## Target server validation — NOT IMPLEMENTED

**CARE-VITAL-002 — P0:** Repeat required, type, finite-number, range, malformed-payload, and authorization checks on the backend. Reject `null`, empty strings, `NaN`, infinity, unexpected keys/types, negative values, impossible percentages, and temperatures outside the supported input domain. Do not trust client-side validation.

Technical validation only determines whether the app can process an input. It must not be phrased as diagnosis or proof that a user is safe. Medical interpretation is limited by [AI Safety](../06-ai/ai-safety.md).
