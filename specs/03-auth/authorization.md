# CareAI Authorization Specification

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Firestore Rules](../10-security/firestore-rules.md), [Backend Architecture](../02-architecture/backend-architecture.md)

## Routes

`/` and `/login` are public. `/create-profile` requires authenticated identity and no profile. `/dashboard`, `/add`, `/history`, and `/history/$id` require authenticated identity plus profile completion. Current `ProtectedRoute` implements equivalent checks from mock contexts; server-side route enforcement is NOT IMPLEMENTED.

## Ownership requirement

**CARE-SEC-001 — P0 / NOT IMPLEMENTED:** User A must never read or write User B’s profile, vital, or analysis. Firestore rules must compare path UID to `request.auth.uid`. Protected backend operations must verify the ID token and derive UID from it; request-body/query UID values are untrusted and must not select records.

The current email-keyed, shared-browser localStorage model provides no multi-user authorization and is unsuitable for production data.
