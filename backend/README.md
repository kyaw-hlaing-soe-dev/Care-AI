# CareAI Backend

## Purpose

This folder is the planned Firebase Cloud Functions backend for CareAI. It will become the trusted layer for Firebase token verification, profile writes, vital submission, deterministic health scoring, OpenRouter analysis, Firestore persistence, dashboard data, history data, safe errors, and privacy-safe logging.

No backend business logic is implemented in this scaffold.

## Architecture

The structure follows the project specs' preferred MVP flow:

```text
Client
-> Firebase Auth
-> Firebase Cloud Function
-> auth boundary
-> validation
-> service
-> Firestore / OpenRouter
-> safe response
```

The backend root is `functions/` because the specs recommend Firebase Cloud Functions for the MVP and no Express backend exists in the repository.

## Main Domains

- Profile: create, load, update, and store `preferredLanguage` under `users/{uid}`.
- Vitals: submit five validated readings under `users/{uid}/vitals/{readingId}`.
- Health Score: preserve the deterministic score algorithm currently documented in `specs/05-vitals/health-score.md`.
- AI Analysis: call OpenRouter server-side only, normalize output, and store analysis under `users/{uid}/analyses/{analysisId}`.
- Dashboard: return profile, latest reading, latest analysis, recent logs, and bounded trend data.
- History: return paginated newest-first owned readings with safe linked analysis summaries.
- Preferences: persist supported language preference on the user profile record.

## Environment Variables

Server-side OpenRouter configuration:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
OPENROUTER_SITE_URL=
OPENROUTER_APP_NAME=CareAI
```

Do not put OpenRouter keys, Firebase Admin private keys, ID tokens, or other backend secrets in frontend `VITE_*` variables.

## Frontend / Backend Boundary

Frontend remains responsible for UI, navigation, forms, local interaction state, language rendering, display formatting, and client-side validation feedback.

Backend will be responsible for Firebase ID token verification, UID derivation, server validation, trusted health-score execution, OpenRouter calls, normalized AI output, owner-scoped Firestore writes and reads, safe errors, and privacy-safe logs.

## Future Implementation Order

1. Firebase project setup, Functions runtime configuration, and Firebase Admin initialization.
2. Authentication verification helper that derives UID only from a verified Firebase ID token.
3. Profile create/read/update service and Firestore rules for `users/{uid}`.
4. Vital request validation using the existing technical limits.
5. Health-score service ported from the documented deterministic algorithm.
6. Trusted vital submission flow with Firestore persistence and duplicate-submission protection.
7. OpenRouter provider with server-only configuration, timeout, safe retry, and sanitized failure handling.
8. AI analysis normalization and persistence.
9. Dashboard and history query functions with bounded reads and pagination.
10. Error contract, privacy-safe logging, unit tests, emulator checks, and deployment configuration.
