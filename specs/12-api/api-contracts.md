# CareAI API Contracts

**Status:** Active Firestore boundary; optional protected AI route
**Version:** 1.1
**Last Updated:** 2026-08-15
**Related:** [Frontend Architecture](../02-architecture/frontend-architecture.md), [Firestore Rules](../10-security/firestore-rules.md)

## Current state

Firebase Authentication and the modular Firestore SDK provide the active persistence boundary. `VITE_CAREAI_API_BASE_URL` is removed. Optional server routes provide presentation-only vital analysis at `POST /api/vitals/analyze` and the senior symptom-checker proxy at `POST /api/symptoms/analyze-senior`. The symptom route forwards validated questionnaire data to a separate FastAPI service configured by server-only `CAREAI_SYMPTOMS_API_URL`; it is not a Firestore authorization boundary and is not deployed as part of the current Spark configuration.

## Active data operations

- **Profile:** owner document get, validated transaction create/replace, validated language update.
- **Vitals:** transaction create at an idempotency-key document ID; duplicate same-input submission returns the existing record; different input with the same key fails.
- **Dashboard:** at most 30 newest owner readings.
- **History:** pages of 20 newest owner readings with optional 7/30-day cutoff and `createdAt`/document-ID cursor.
- **Detail:** one owner vital document by validated ID.

The service never accepts a UID parameter. Firestore rules authorize and validate the resulting requests. The old Functions REST code is inactive reference code and must not be described as deployed.

## Optional AI route

- **Route:** `POST /api/vitals/analyze`
- **Request body:** exactly `systolic`, `diastolic`, `heartRate`, `oxygen`, and `temperature` as numeric values inside documented technical limits.
- **Header:** optional `idempotency-key`, 8 to 128 permitted characters, used for warm-instance response reuse only.
- **Success:** returns deterministic `healthScore`, an analysis object, and `analysisStatus: "completed"` when provider output passes normalization.
- **Fallback:** returns `analysisStatus: "failed"` and `AI_ERROR` with safe unavailable copy when server config is missing, the provider fails, output is malformed/unsafe/oversized, urgency conflicts, or a timeout occurs.
- **Privacy:** the provider request contains only the five validated readings, deterministic score, deterministic application urgency, and optional server-only provider controls such as `reasoning.max_tokens`. Reasoning traces are excluded from responses and are not exposed to the browser.

## Senior symptom analysis route

- **Route:** `POST /api/symptoms/analyze-senior`
- **Request:** non-empty `body_parts` and `pain_sensations`, `pain_severity` from 1–10, a supported duration string, a gender choice, and optional age from 1–120.
- **Proxy:** the frontend server validates the closed-choice request and forwards it to `${CAREAI_SYMPTOMS_API_URL}/api/symptoms/analyze-senior`; local development defaults to `http://127.0.0.1:8000`.
- **Provider:** the separate FastAPI service calls Gemini 2.5 Flash using server-only `GEMINI_API_KEY`; it returns the typed urgency, matching badge color, summary, possible conditions, red flags, and recommended actions. Missing provider configuration/failure returns a generic HTTP 500 response from FastAPI.
- **Privacy and readiness:** the forwarded payload includes symptom selections and the user-provided gender and optional age. No account identity or Firebase UID is sent. Provider data-handling, legal/privacy review, clinical review, deployment, and end-to-end verification remain outstanding; do not describe this path as production-ready.
