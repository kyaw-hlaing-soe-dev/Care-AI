# CareAI Privacy Specification

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [AI Analysis](../06-ai/ai-analysis.md), [Storage](../09-database/storage.md)

CareAI collects account identity supplied by Google, profile fields, vital readings, timestamps, health score, and informational analyses to provide personal tracking. Target storage is Firestore under authenticated UID; Storage is only for optional files.

OpenRouter receives only validated vital values, deterministic score, and approved minimum context. It must not receive email, full name, avatar, Firebase UID, Google ID, or unrelated profile data. Public landing sections use demo values only.

Current state is **NOT PRODUCTION-READY**: profile and health data are stored in localStorage, may persist after mock logout, and are accessible to scripts running in the same browser origin. Do not make unsupported claims about encryption, retention, compliance, or provider handling; obtain legal/privacy review before launch.
