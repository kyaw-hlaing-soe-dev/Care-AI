# CareAI User Flows

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Authentication](../03-auth/authentication.md), [User Profile](../04-profile/user-profile.md), [Vital Tracker](../05-vitals/vital-tracker.md)

## Current implementation note

The route sequence below is implemented in code with Firebase identity and the protected profile API. Firebase project/provider deployment and browser E2E acceptance remain outstanding.

## New user flow

```mermaid
flowchart TD
  L[Landing] --> LI[Login]
  LI --> G[Google via Firebase]
  G --> A[Authenticated user]
  A --> C{Profile exists?}
  C -->|No| CP[/create-profile]
  CP --> S[Save profile]
  S --> D[/dashboard]
  C -->|Yes| D
```

Current routes are `/`, `/login`, `/create-profile`, and `/dashboard`. Only an API profile reporting `profileCompleted: true` bypasses onboarding.

## Existing user flow

```mermaid
flowchart LR
  G[Firebase Google sign-in] --> P{Firestore profile complete?}
  P -->|Exists| D[/dashboard]
```

## Vital flow

```mermaid
flowchart TD
  D[Dashboard] --> V[/add]
  V --> E[Enter five readings]
  E --> FV[Frontend validation]
  FV --> SV[Verified server validation]
  SV --> HS[Deterministic Health Score]
  HS --> WR[Save owner-scoped reading]
  WR --> AI[Protected OpenRouter analysis]
  AI --> WA[Normalize and save analysis]
  WA --> D
```

Current behavior is `client validate → verified backend validate/score/write → normalized or failed analysis write → query refresh → dashboard`. Durable idempotency prevents a reused submission key from creating another reading.

## History flow

```mermaid
flowchart LR
  D[Dashboard] --> H[/history]
  H --> Q[Newest-first readings]
  Q --> R[Expand reading and its analysis]
```

The current API implementation supports All, 7 Days, and 30 Days filters plus cursor pages of 20 owner-scoped readings.

## Logout flow

Firebase `signOut()` clears the session and React Query cache before protected routing returns to `/login`. Legacy local profile/vital keys are removed during the one-time cutover and on logout.
