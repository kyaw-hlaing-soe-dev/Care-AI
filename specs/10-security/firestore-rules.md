# CareAI Firestore Rules Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Firestore Schema](../09-database/firestore-schema.md), [Authorization](../03-auth/authorization.md)

## Current state

**IMPLEMENTED, NOT DEPLOYED.** `firestore.rules` permits owner reads for profiles, vitals, and analyses, and denies every client write so mutations remain behind the verified Admin API. Firestore emulator tests verify owner reads, cross-user/unauthenticated denial, and denial of client writes. The deny-by-default Storage test exists, but its emulator runtime download remains unverified in the current environment.

## Target ownership rule shape

```text
match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
match /users/{uid}/vitals/{id} { allow read, write: if request.auth != null && request.auth.uid == uid; }
match /users/{uid}/analyses/{id} { allow read: if request.auth != null && request.auth.uid == uid; }
```

Current rules reserve all writes for the backend instead of duplicating field validation in client-write rules. Rules remain a second line of defense, not a replacement for backend token verification/validation. Test User A against User B’s paths before release.
