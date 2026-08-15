# CareAI Authentication Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Authorization](./authorization.md), [User Profile](../04-profile/user-profile.md)

## Current state — IMPLEMENTED IN CODE, NOT DEPLOYED

`AuthProvider` initializes Firebase Auth only in the browser, observes the session, uses the Google popup flow with a blocked-popup redirect fallback, supplies Firebase identity to token-bearing API calls, clears user-scoped query state on logout, and performs a one-time removal of legacy mock local data. Keeping Auth initialization out of server-side rendering prevents a frontend deployment configuration error from turning every SSR request into an HTTP 500. Firebase project/provider configuration and browser E2E acceptance remain outstanding.

## Target behavior

**CARE-AUTH-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Firebase manages session persistence and client code observes auth/profile loading before redirects. Successful sign-in routes only users whose API profile reports `profileCompleted: true` to `/dashboard`; all others go to `/create-profile`.

On cancellation, popup-blocking, network, or provider errors, retain the login page, show a plain user-facing message, and never show raw provider data. Logout calls Firebase `signOut()`, clears in-memory/user-scoped caches, and routes to `/login`.
