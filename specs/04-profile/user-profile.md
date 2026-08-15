# CareAI User Profile Specification

**Status:** Active  
**Version:** 1.1
**Last Updated:** 2026-08-08  
**Related:** [Authentication](../03-auth/authentication.md), [Firestore Schema](../09-database/firestore-schema.md), [Privacy](../10-security/privacy.md)

## Current state — IMPLEMENTED IN CODE, NOT DEPLOYED

`CreateProfileExperience` retains its validation and duplicate-submit behavior. `ProfileProvider` now loads and saves through the protected API; the backend derives UID, validates the payload, writes `users/{uid}` with server timestamps and `profileCompleted: true`, and supports preferred-language updates. Live Firebase and E2E acceptance remain outstanding.

| Field              | Type                  | Required | Current validation            | Target Firestore field/source               |
| ------------------ | --------------------- | -------- | ----------------------------- | ------------------------------------------- |
| Display name       | string                | yes      | trimmed, 2–50                 | `displayName`; Firebase Google name prefill |
| Date of birth      | `YYYY-MM-DD`          | yes      | valid, not future             | `dateOfBirth`                               |
| Sex                | enum                  | yes      | male/female/prefer-not-to-say | `sex`                                       |
| Height             | number cm             | yes      | 50–250                        | `heightCm`                                  |
| Weight             | number kg             | yes      | 2–500                         | `weightKg`                                  |
| Blood type         | enum                  | no       | selected option only          | `bloodType` optional                        |
| Preferred language | `en` / `my` / `zh-CN` | no       | supported option only         | `preferredLanguage`                         |

Google-provided email/photo/name belong to authenticated identity or optional mirrored account metadata; users must not re-enter email/password.

## Profile hub

`/profile` is the protected, single-route CareAI profile hub. It uses the authenticated app shell and internal hash-addressable sections so no profile values are placed in the URL:

- **Overview:** read-only personal details with friendly formatting and `Not provided` fallbacks.
- **Edit Profile:** display name, date of birth, sex, height, weight, and optional blood type. It reuses the onboarding validation rules and only reveals errors after touch or submit.
- **Preferences:** English, Myanmar, and Simplified Chinese. The selected value is stored on the existing profile record as `preferredLanguage`.
- **Account & Privacy:** connected Google identity, active status, accurate data-use copy, and the existing sign-out action.

Completion is deterministic: completed required fields (`displayName`, `dateOfBirth`, `sex`, `heightCm`, `weightKg`) divided by five. Optional blood type does not prevent 100% completion. Missing required values show a friendly remaining-detail count and open Edit Profile.

The top-right user menu provides View Profile, Settings (`/profile#preferences`), and Sign Out. Unauthenticated access to `/profile` redirects to `/login`; loading, safe retry, and completely missing-profile states render before the hub.

## Target behavior

**CARE-PROFILE-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Backend derives the UID from the Firebase token and writes `users/{uid}` with `profileCompleted: true`, server timestamps, and only the fields above. Refresh waits for auth/profile resolution; unauthenticated users go to `/login`, only completed users bypass onboarding, and save failures preserve entered values with safe feedback.
