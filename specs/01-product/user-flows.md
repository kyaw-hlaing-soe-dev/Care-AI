# CareAI User Flows

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Authentication](../03-auth/authentication.md), [User Profile](../04-profile/user-profile.md), [Vital Tracker](../05-vitals/vital-tracker.md)

## Current implementation note

The route sequence below is the target user flow. The current app implements equivalent redirects with mock localStorage identity/profile state, not Firebase.

## New user flow

```mermaid
flowchart TD
  L[Landing] --> LI[Login]
  LI --> G[Google via Firebase: target]
  G --> A[Authenticated user]
  A --> C{Profile exists?}
  C -->|No| CP[/create-profile]
  CP --> S[Save profile]
  S --> D[/dashboard]
  C -->|Yes| D
```

Current routes are `/`, `/login`, `/create-profile`, and `/dashboard`. The mock login always resolves to `Thuzar <thuzar@example.com>`.

## Existing user flow

```mermaid
flowchart LR
  G[Firebase Google sign-in: target] --> P{Firestore profile}
  P -->|Exists| D[/dashboard]
```

## Vital flow

```mermaid
flowchart TD
  D[Dashboard] --> V[/add]
  V --> E[Enter five readings]
  E --> FV[Frontend validation]
  FV --> SV[Server validation: target]
  SV --> HS[Deterministic Health Score]
  HS --> WR[Save owner-scoped reading]
  WR --> AI[Protected OpenRouter analysis]
  AI --> WA[Normalize and save analysis]
  WA --> D
```

Current behavior is `validate → createVital → analyzeVitals → localStorage → dashboard`; no remote write or OpenRouter call occurs.

## History flow

```mermaid
flowchart LR
  D[Dashboard] --> H[/history]
  H --> Q[Newest-first readings]
  Q --> R[Expand reading and its analysis]
```

The current local implementation supports All, 7 Days, and 30 Days filters plus a local load-more increment of 20.

## Logout flow

Target: Firebase `signOut()` clears the session, client cache, and protected UI, then routes to `/login`. Current behavior removes only `aicare.user.v1` from localStorage; local profile and vital records remain on the device.
