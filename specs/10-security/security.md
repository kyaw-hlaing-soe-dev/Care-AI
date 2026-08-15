# CareAI Security Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.1
**Last Updated:** 2026-08-15
**Related:** [Authorization](../03-auth/authorization.md), [Firestore Rules](./firestore-rules.md), [Privacy](./privacy.md)

## Findings

**CARE-SEC-002 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Firebase Auth identity, owner-derived frontend paths, strict owner/shape/range/result Firestore rules, immutable vital records, server timestamps, deny-by-default Storage rules, safe errors, and no private app localStorage persistence are implemented. Do not treat the controls as live until rules are deployed and emulator/browser ownership checks pass.

The Spark design intentionally has no application backend. Client code is not trusted: Firestore rules repeat authorization and validate all writable document fields. A malicious owner can choose valid raw readings, but cannot write outside technical limits, forge the deterministic result, modify saved readings, or access another UID path.

OpenRouter and Firebase Admin configuration must remain absent from browser source, `VITE_*`, bundles, logs, specs, screenshots, and commits. AI stays disabled until a protected server is approved. Do not log full profiles/readings or identity tokens.
