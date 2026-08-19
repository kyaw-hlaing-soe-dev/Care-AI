# CareAI Authentication Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-19  
**Related:** [Authorization](./authorization.md), [User Profile](../04-profile/user-profile.md)

## Current state — IMPLEMENTED IN CODE, NOT DEPLOYED

`AuthProvider` initializes Firebase Auth only in the browser, observes the session, uses the Google popup flow with a blocked-popup redirect fallback, supplies identity to owner-scoped Firestore operations, clears user-scoped query state on logout, and performs a one-time removal of legacy mock local data. Keeping Auth/Firestore initialization out of server-side rendering prevents a frontend deployment configuration error from turning every SSR request into an HTTP 500. Firebase provider configuration and browser E2E acceptance remain outstanding.

CareAI no longer exposes Firebase phone-number sign-in, SMS OTP verification, reCAPTCHA setup, resend timers, or phone-provider account linking in the application code. Existing Firestore profile and vital documents are not migrated or deleted by this removal.

Phone Authentication can be disabled separately in Firebase Console at Authentication -> Sign-in method / Providers -> Phone. Before disabling that provider, export or inspect Firebase Auth users for accounts whose only provider is Phone. Those users will not have a usable sign-in method after Phone Authentication is disabled unless another provider is linked first. This repository does not contain enough production Auth user data to prove whether such accounts exist.

## Target behavior

**CARE-AUTH-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Firebase manages session persistence and client code observes auth/profile loading before redirects. Successful Google sign-in routes only users whose owner-readable Firestore profile reports `profileCompleted: true` to `/dashboard`; all others go to `/create-profile`.

On cancellation, popup-blocking, network, or provider errors, retain the login page, show a plain user-facing message, and never show raw provider data. Logout calls Firebase `signOut()`, clears in-memory/user-scoped caches, and routes to `/login`.

**CARE-AUTH-002 — P1 / REMOVED:** Phone-number sign-in and OTP verification were removed from the CareAI application. Google Sign-In via Firebase Authentication is the only supported sign-in method in the current product flow.
