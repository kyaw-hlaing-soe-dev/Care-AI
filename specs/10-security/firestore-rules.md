# CareAI Firestore Rules Specification

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Firestore Schema](../09-database/firestore-schema.md), [Authorization](../03-auth/authorization.md)

## Current state

**NOT IMPLEMENTED / NOT VERIFIED.** No `firestore.rules` file or deployed-rules configuration was found.

## Target ownership rule shape

```text
match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
match /users/{uid}/vitals/{id} { allow read, write: if request.auth != null && request.auth.uid == uid; }
match /users/{uid}/analyses/{id} { allow read: if request.auth != null && request.auth.uid == uid; }
```

Final rules must validate allowed fields/types where practical and reserve trusted analysis writes for the backend. Rules are a second line of defense, not a replacement for backend token verification/validation. Test User A against User B’s paths before release.
