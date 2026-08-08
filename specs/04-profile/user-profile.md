# CareAI User Profile Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Authentication](../03-auth/authentication.md), [Firestore Schema](../09-database/firestore-schema.md), [Privacy](../10-security/privacy.md)

## Current state — PARTIAL

`CreateProfileExperience` collects data, performs touched/submit validation, prevents repeated submit, shows a short success state, and redirects. `ProfileProvider` persists profiles under lowercased email in `aicare.profiles.v1`; it does not use UID, Firestore, server timestamps, or a backend.

| Field | Type | Required | Current validation | Target Firestore field/source |
| --- | --- | --- | --- | --- |
| Display name | string | yes | trimmed, 2–50 | `displayName`; Firebase Google name prefill |
| Date of birth | `YYYY-MM-DD` | yes | valid, not future | `dateOfBirth` |
| Sex | enum | yes | male/female/prefer-not-to-say | `sex` |
| Height | number cm | yes | 50–250 | `heightCm` |
| Weight | number kg | yes | 2–500 | `weightKg` |
| Blood type | enum | no | selected option only | `bloodType` optional |

Google-provided email/photo/name belong to authenticated identity or optional mirrored account metadata; users must not re-enter email/password.

## Target behavior

**CARE-PROFILE-001 — P0 / PARTIAL:** Backend derives the UID from the Firebase token and writes `users/{uid}` with `profileCompleted: true`, server timestamps, and only the fields above. Refresh waits for auth/profile resolution; unauthenticated users go to `/login`, completed users bypass onboarding to `/dashboard`, and save failures preserve entered values and show a safe retry message.
