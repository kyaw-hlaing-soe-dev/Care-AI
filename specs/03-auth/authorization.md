# CareAI Authorization Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Firestore Rules](../10-security/firestore-rules.md), [Backend Architecture](../02-architecture/backend-architecture.md)

## Routes

`/` and `/login` are public. `/create-profile` requires authenticated identity and no completed profile. `/dashboard`, `/add`, `/history`, and `/history/$id` require authenticated identity plus `profileCompleted: true`. `ProtectedRoute` implements client routing from resolved Firebase identity and Firestore profile state; every private data operation is independently enforced by owner-scoped Firestore rules.

## Ownership requirement

**CARE-SEC-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** The Firestore service derives paths only from `FirebaseAuth.currentUser.uid` and never accepts a caller-selected UID. Rules independently require `request.auth.uid`, validate all permitted profile/vital fields and deterministic results, allow only immutable vital creation, and deny cross-owner access. Rules deployment and emulator/E2E ownership acceptance remain required.

Legacy email-keyed profile and shared vital localStorage values are removed once and are not imported into Firebase.
