# CareAI Vital Validation Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Vital Tracker](./vital-tracker.md), [Security](../10-security/security.md), [Error Handling](../12-api/error-handling.md)

## Current technical validation — IMPLEMENTED client-side

Every vital field is required. `VitalForm` trims the submitted string, converts it with `Number`, rejects non-finite values and values outside its technical limits, marks errors only after touch or submit, and focuses the first invalid input after submit. HTML numeric input modes provide appropriate phone keyboards.

## Target server validation — PARTIAL

**CARE-VITAL-002 — P0:** Repeat required, type, finite-number, range, malformed-payload, and authorization checks on the backend. Reject `null`, empty strings, `NaN`, infinity, unexpected keys/types, negative values, impossible percentages, and temperatures outside the supported input domain. Do not trust client-side validation.

The TanStack analysis endpoint repeats exact-key, numeric, finite-number, and technical range validation before scoring or calling OpenRouter. Authorization still depends on the unimplemented Firebase ID-token boundary.

Technical validation only determines whether the app can process an input. It must not be phrased as diagnosis or proof that a user is safe. Medical interpretation is limited by [AI Safety](../06-ai/ai-safety.md).
