# CareAI Privacy Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [AI Analysis](../06-ai/ai-analysis.md), [Storage](../09-database/storage.md)

CareAI collects account identity supplied by Google, profile fields, vital readings, timestamps, health score, and informational analyses to provide personal tracking. Target storage is Firestore under authenticated UID; Storage is only for optional files.

OpenRouter receives no data in browser-only/static Spark hosting. If the protected frontend server route is hosted and `VITE_CAREAI_AI_ANALYSIS_ENABLED=true` is enabled, OpenRouter may receive only validated vital values, deterministic score, approved minimum context, and optional server-only provider controls such as `reasoning.max_tokens` through that server route. It must never receive email, full name, avatar, Firebase UID, Google ID, unrelated profile data, or provider reasoning traces. Public landing sections use demo values only.

The separate, optional senior symptom-analysis path forwards selected body areas, pain sensations, severity, duration, the user's gender choice, and optional age from the frontend server to FastAPI, which sends those fields to Gemini 2.5 Flash. It does not send account identity, Firebase UID, or unrelated profile data. This external health-data processing path is not deployed or production-approved; provider data-handling, consent, retention, legal/privacy, and clinical reviews are required before enabling it for real users.

Current code no longer stores profile or health records in localStorage; a one-time cutover deletes legacy keys without importing them. The app remains **NOT PRODUCTION-READY** until Firebase deployment/security verification and legal/privacy review. Do not make unsupported claims about encryption, retention, compliance, or provider handling.
