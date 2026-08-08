# CareAI Authentication Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Authorization](./authorization.md), [User Profile](../04-profile/user-profile.md)

## Current state — NOT IMPLEMENTED for Firebase

`AuthProvider` reads/writes `aicare.user.v1` in localStorage. `signInWithGoogle()` waits 600ms and always creates `{ name: "Thuzar", email: "thuzar@example.com" }`; no Google popup, Firebase SDK, provider token, persistence, or avatar retrieval exists. `signOut()` clears only the mock user key.

## Target behavior

**CARE-AUTH-001 — P0 / NOT IMPLEMENTED:** Use Firebase Authentication’s Google Provider. Firebase manages session persistence; client code observes auth loading before redirects. On successful sign-in, obtain the Firebase user identity, look up `users/{uid}`, route existing users to `/dashboard`, and route users without a completed profile to `/create-profile`.

On cancellation, popup-blocking, network, or provider errors, retain the login page, show a plain user-facing message, and never show raw provider data. Logout calls Firebase `signOut()`, clears in-memory/user-scoped caches, and routes to `/login`.
