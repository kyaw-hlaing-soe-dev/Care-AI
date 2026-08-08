# CareAI Firestore Schema

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [User Profile](../04-profile/user-profile.md), [Firestore Rules](../10-security/firestore-rules.md)

## Current state

**NOT IMPLEMENTED.** The repository has no Firestore SDK/configuration. Current local structures are `aicare.profiles.v1` keyed by email and `aicare.vitals.v1` containing combined records.

## Target schema

```text
users/{uid}
users/{uid}/vitals/{readingId}
users/{uid}/analyses/{analysisId}
```

`users/{uid}` required: `displayName`, `dateOfBirth`, `sex`, `heightCm`, `weightKg`, `profileCompleted`, `createdAt`, `updatedAt`; optional: `bloodType`, mirrored `email`, `photoURL` only when needed. Timestamps are Firestore server timestamps.

`vitals/{readingId}` required: `systolic`, `diastolic`, `heartRate`, `oxygenSaturation`, `temperatureC`, `healthScore`, `status`, `createdAt`; optional: score/range algorithm version and idempotency key. `analyses/{analysisId}` required: `readingId`, normalized schema fields, `status`, `provider`, `model`, `createdAt`; optional: safe error code. A vital/analysis never stores raw API secret, prompt, provider error body, or unrelated identity data.
