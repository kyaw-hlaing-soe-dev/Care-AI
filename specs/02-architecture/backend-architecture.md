# CareAI Backend Architecture

**Status:** Inactive in Spark mode
**Version:** 1.1
**Last Updated:** 2026-08-15
**Related:** [System Architecture](./system-architecture.md), [OpenRouter](../06-ai/openrouter.md), [Security](../10-security/security.md)

## Active deployment

The Spark-plan application has no deployed application backend or Cloud Function. Firebase Authentication establishes identity and Cloud Firestore security rules authorize and validate direct browser operations. `firebase.json` intentionally contains no Functions deployment target.

## Retained reference implementation

`backend/` still contains the prior regional HTTPS API, Firebase Admin validation/persistence, OpenRouter normalization, durable idempotency, and retry implementation. It is not imported or called by the frontend and is not eligible for the selected no-billing deployment. Its tests remain useful reference coverage for a future protected server.

`app/` contains a separate FastAPI symptom-analysis service and the frontend server runtime contains a same-origin proxy for the senior symptom checker. FastAPI calls Gemini with server-only `GEMINI_API_KEY`; this service is not deployed with the Spark application. Its provider data-handling, privacy/legal, and clinical-policy reviews remain pending. Do not treat the proxy or AI-generated urgency as an authorization boundary or as production-ready clinical triage.

## Requirement

**CARE-ARCH-001 — P0 / REPLACED FOR SPARK MODE:** Profile and vital persistence use direct authenticated Firestore access with strict owner/shape/limit/deterministic-result rules. Trusted server-side AI and repeated application validation are deferred. A future AI reactivation must use a protected server and must not expose provider secrets in the browser.
