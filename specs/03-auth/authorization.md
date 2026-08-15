# CareAI Authorization Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Firestore Rules](../10-security/firestore-rules.md), [Backend Architecture](../02-architecture/backend-architecture.md)

## Routes

`/` and `/login` are public. `/create-profile` requires authenticated identity and no completed profile. `/dashboard`, `/add`, `/history`, and `/history/$id` require authenticated identity plus `profileCompleted: true`. `ProtectedRoute` implements client routing from resolved Firebase identity and API profile state; each private data operation is independently enforced by backend ID-token verification and owner-derived Firestore paths.

## Ownership requirement

**CARE-SEC-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** The backend verifies the ID token and derives UID without accepting client-selected UIDs. Firestore rules allow owner reads and deny all client writes so trusted writes stay behind Firebase Admin. Rules deployment and emulator/E2E ownership acceptance remain required.

Legacy email-keyed profile and shared vital localStorage values are removed once and are not imported into Firebase.
