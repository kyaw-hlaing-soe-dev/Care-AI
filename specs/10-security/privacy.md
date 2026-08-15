# CareAI Privacy Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [AI Analysis](../06-ai/ai-analysis.md), [Storage](../09-database/storage.md)

CareAI collects account identity supplied by Google, profile fields, vital readings, timestamps, health score, and informational analyses to provide personal tracking. Target storage is Firestore under authenticated UID; Storage is only for optional files.

OpenRouter receives no data in the active Spark architecture because AI is disabled. If a protected provider integration is restored, it may receive only validated vital values, deterministic score, and approved minimum context—never email, full name, avatar, Firebase UID, Google ID, or unrelated profile data. Public landing sections use demo values only.

Current code no longer stores profile or health records in localStorage; a one-time cutover deletes legacy keys without importing them. The app remains **NOT PRODUCTION-READY** until Firebase deployment/security verification and legal/privacy review. Do not make unsupported claims about encryption, retention, compliance, or provider handling.
