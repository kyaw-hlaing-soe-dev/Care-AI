# CareAI Backend

## Purpose

This folder contains the Firebase Cloud Functions backend for CareAI. It is the trusted layer for Firebase token verification, profile writes, vital submission, deterministic health scoring, OpenRouter analysis, Firestore persistence, dashboard data, history data, safe errors, and privacy-safe logging.

The implementation is ready for local configuration and emulator verification. It has not been deployed; Firebase project aliases, hosted origins, the Google provider, and deployment secrets must be configured first.

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

The Firebase Functions source is this `backend/` directory. The HTTPS API and private retry task run in `asia-southeast1` on Node.js 22.

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

Backend is responsible for Firebase ID token verification, UID derivation, server validation, trusted health-score execution, OpenRouter calls, normalized AI output, owner-scoped Firestore writes and reads, safe errors, and privacy-safe logs.

## Local setup

1. Use Node.js 22.13 or newer and run `npm ci` in this directory.
2. Copy `.env.example` to `.env.local`; keep real secrets out of git.
3. Add Firebase `dev` and `prod` aliases in a local `.firebaserc`, or pass a project ID explicitly.
4. Set the Functions secret with `firebase functions:secrets:set OPENROUTER_API_KEY --project <project-id>`.
5. Start local services with `npm run emulators`; configure the frontend from `frontend/.env.example`.

Verification commands are `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:rules`. Rules tests require the Firebase emulator suite to start successfully.

## API

The regional Functions base path ends in `/api`. Every operation requires `Authorization: Bearer <Firebase ID token>`:

- `GET|PUT /profile`
- `PATCH /profile/preferences`
- `POST /vitals/analyze` with an `Idempotency-Key` header
- `POST /vitals/:readingId/retry-analysis`
- `GET /dashboard`
- `GET /history?period=all|7d|30d&pageSize=...&cursor=...`
- `GET /history/:readingId`
