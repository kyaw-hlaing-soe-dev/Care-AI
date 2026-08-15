# CareAI Firestore Schema

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [User Profile](../04-profile/user-profile.md), [Firestore Rules](../10-security/firestore-rules.md)

## Current state

**IMPLEMENTED IN CODE, NOT DEPLOYED.** The authenticated frontend writes profiles and immutable readings through owner-derived paths. Firestore rules validate the owner, exact fields, limits, timestamps, and deterministic result. The browser clears legacy local profile/vital structures once and does not import or continue using them.

## Target schema

```text
users/{uid}
users/{uid}/vitals/{readingId}
users/{uid}/analyses/{analysisId}
```

`users/{uid}` required: `displayName`, `dateOfBirth`, `sex`, `heightCm`, `weightKg`, `profileCompleted`, `createdAt`, `updatedAt`; optional: `bloodType`, mirrored `email`, `photoURL` only when needed. Timestamps are Firestore server timestamps.

`vitals/{readingId}` requires `systolic`, `diastolic`, `heartRate`, `oxygenSaturation`, `temperatureC`, `healthScore`, `status`, `emergency`, `urgency`, `algorithmVersion: "v1"`, `analysisStatus: "unavailable"`, `idempotencyKey`, and `createdAt`. The idempotency key equals the immutable document ID. `analyses` is read-only for legacy compatibility and receives no new Spark-mode writes. No document stores an API secret, prompt, provider error, or unrelated identity data.
