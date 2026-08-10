# CareAI Data Flow

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [Authentication](../03-auth/authentication.md), [Firestore Queries](../09-database/firestore-queries.md)

## Auth and profile — target

```mermaid
flowchart LR
  G[Google Provider] --> FA[Firebase Auth]
  FA --> P{users/uid profile?}
  P -->|missing| CP[Create Profile]
  P -->|exists| D[Dashboard]
  CP --> W[Trusted profile write] --> D
```

Current state: mock user and profile are read from localStorage.

## Vital and AI — target

```mermaid
flowchart LR
  F[Validated form] --> B[Protected backend]
  B --> S[Deterministic score]
  S --> R[Firestore vital]
  R --> O[Minimal OpenRouter context]
  O --> N[Normalize / validate analysis]
  N --> A[Firestore analysis]
  A --> D[Dashboard and History]
```

Current state: `createVitalWithAi()` calls the TanStack server endpoint, which validates, calculates the deterministic score, calls/normalizes OpenRouter, and returns a combined record. The browser then writes that record to `aicare.vitals.v1`; verified auth, Firestore writes, and separate analysis persistence remain outstanding.

## Dashboard/history — target

The authenticated UID scopes latest/recent/trend readings and linked analysis. The public landing page is a separate flow using static demo data only.
