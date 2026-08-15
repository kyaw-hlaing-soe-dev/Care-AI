# CareAI Security Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Authorization](../03-auth/authorization.md), [OpenRouter](../06-ai/openrouter.md), [Privacy](./privacy.md)

## Findings

**CARE-SEC-002 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Firebase Auth tokens, Admin verification, owner-derived paths, server-only writes, owner-read rules, deny-by-default Storage rules, safe errors, and privacy-safe logs are implemented. Do not treat these controls as live until the Firebase projects, rules, functions, secrets, and provider are deployed and verified.

Target controls: Firebase Auth session/ID token; backend Firebase Admin verification; Firestore/Storage ownership rules; server validation; server-only OpenRouter/Firebase Admin secrets; sanitized logs/errors; HTTPS deployment; no sensitive data in URLs; no production health/profile data in localStorage.

Secrets must be environment/secret-manager values, never `VITE_*`, client code, git history, screenshots, or logs. Do not log full profiles, readings, raw prompts, ID tokens, or provider bodies. Retain only minimum diagnostic metadata and safe error codes.
