# CareAI Authentication Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Authorization](./authorization.md), [User Profile](../04-profile/user-profile.md)

## Current state — IMPLEMENTED IN CODE, NOT DEPLOYED

`AuthProvider` initializes Firebase Auth only in the browser, observes the session, uses the Google popup flow with a blocked-popup redirect fallback, supports Firebase phone-number sign-in with `RecaptchaVerifier` and SMS verification codes, supplies identity to owner-scoped Firestore operations, clears user-scoped query state on logout, and performs a one-time removal of legacy mock local data. Keeping Auth/Firestore initialization out of server-side rendering prevents a frontend deployment configuration error from turning every SSR request into an HTTP 500. Firebase provider configuration and browser E2E acceptance remain outstanding.

Phone sign-in requires Firebase Console configuration before it can work in a deployed environment:

- Authentication -> Sign-in method -> Phone must be enabled for project `care-ai-4eb8d`.
- Authentication -> Settings -> SMS region policy currently uses an allowlist with `MM`, so the shipped phone sign-in UI accepts Myanmar phone numbers only. Add regions in Firebase before exposing additional countries in the UI. New Firebase projects default to allowing no SMS regions until this policy is configured.
- Authentication -> Settings -> Authorized domains must include every served CareAI domain, including `care-ai-4eb8d.firebaseapp.com`, localhost domains used for development, and deployed Vercel domains when used, such as `care-ai-six.vercel.app` and `vitals-glass.vercel.app`.
- Development and QA should use Firebase Authentication fictional phone numbers configured in the Console instead of repeatedly sending real SMS messages. Test numbers and OTPs must not be hardcoded in production source.

## Target behavior

**CARE-AUTH-001 — P0 / IMPLEMENTED IN CODE, NOT DEPLOYED:** Firebase manages session persistence and client code observes auth/profile loading before redirects. Successful Google or phone sign-in routes only users whose owner-readable Firestore profile reports `profileCompleted: true` to `/dashboard`; all others go to `/create-profile`.

On cancellation, popup-blocking, network, or provider errors, retain the login page, show a plain user-facing message, and never show raw provider data. Logout calls Firebase `signOut()`, clears in-memory/user-scoped caches, and routes to `/login`.

**CARE-AUTH-002 — P1 / IMPLEMENTED IN CODE, NOT DEPLOYED:** The login page offers Google and phone as Firebase Authentication providers for the same CareAI account flow. Phone sign-in normalizes selected-country national numbers to E.164 before calling Firebase, keeps OTP values out of Firestore/localStorage/URLs, uses an invisible Firebase `RecaptchaVerifier`, prevents duplicate send/verify submissions, applies a resend cooldown, maps common Firebase errors to safe localized messages, and relies on the existing UID-based profile lookup after successful verification.

Account linking is not implemented in this phase. A signed-in Google user cannot add a phone provider from Profile yet; if Firebase reports that a phone credential is already in use or already linked, the UI shows a safe stop message and does not merge, delete, or copy Firestore data.
