# CareAI Product Requirements

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [User Flows](./user-flows.md), [Acceptance Criteria](./acceptance-criteria.md), [AI Safety](../06-ai/ai-safety.md)

## Purpose, users, and problem

CareAI helps an adult user record common vital measurements, review simple trends, and receive informational—not diagnostic—context. It is for people who want a lightweight personal log, not a clinical record system, emergency service, or medical-device replacement.

## Scope and non-goals

The MVP covers identity, a lightweight profile, vital entry, deterministic score, informational insight, dashboard, history, and responsive UI. It does not diagnose disease, prescribe treatment, support clinician workflows, replace emergency care, ingest medical records, or guarantee medical safety.

## Requirements

### CARE-PROD-001 — Record five vital inputs

**Priority:** P0  
**Status:** IMPLEMENTED  
**Acceptance:** [AC-VITAL-001](./acceptance-criteria.md#ac-vital-001)

The user can enter systolic, diastolic, heart rate, oxygen saturation, and temperature, with units and client-side technical validation.

### CARE-PROD-002 — Deterministic health score

**Priority:** P0  
**Status:** IMPLEMENTED  
**Acceptance:** [AC-SCORE-001](./acceptance-criteria.md#ac-score-001)

The same five valid inputs must produce the same score and status. The current deterministic implementation is documented in [Health Score](../05-vitals/health-score.md).

### CARE-PROD-003 — Google/Firebase sign-in

**Priority:** P0  
**Status:** NOT IMPLEMENTED  
**Acceptance:** [AC-AUTH-001](./acceptance-criteria.md#ac-auth-001)

Target behavior is Firebase Authentication with Google Provider. Current code delays then stores a fixed mock user in localStorage.

### CARE-PROD-004 — New-user profile onboarding

**Priority:** P0  
**Status:** PARTIAL  
**Acceptance:** [AC-PROFILE-001](./acceptance-criteria.md#ac-profile-001)

The UI and route redirects exist, but profiles are keyed by email in localStorage rather than authenticated Firestore ownership.

### CARE-PROD-005 — Persist private user data

**Priority:** P0  
**Status:** NOT IMPLEMENTED  
**Acceptance:** [AC-SEC-001](./acceptance-criteria.md#ac-sec-001)

Target is owner-scoped Firestore documents and trusted server writes. Browser localStorage must not hold production health/profile records.

### CARE-PROD-006 — Informational AI insight

**Priority:** P0  
**Status:** PARTIAL  
**Acceptance:** [AC-AI-001](./acceptance-criteria.md#ac-ai-001)

Current rule-based copy has the intended UI shape. A protected OpenRouter request, normalization, failure state, and persistence are absent.

### CARE-PROD-007 — Dashboard and recent trends

**Priority:** P1  
**Status:** PARTIAL  
**Acceptance:** [AC-DASH-001](./acceptance-criteria.md#ac-dash-001)

The dashboard renders from local records with empty/loading states. It does not fetch authenticated remote data or separately persisted analyses.

### CARE-PROD-008 — Health history

**Priority:** P1  
**Status:** IMPLEMENTED  
**Acceptance:** [AC-HISTORY-001](./acceptance-criteria.md#ac-history-001)

Current local history is newest-first, filterable, expandable, and has a load-more control. Server pagination is not implemented.

### CARE-PROD-009 — Responsive, accessible interaction

**Priority:** P0  
**Status:** IMPLEMENTED  
**Acceptance:** [AC-UI-001](./acceptance-criteria.md#ac-ui-001)

The project uses responsive Tailwind classes, labels, focus states, live status, and reduced-motion CSS. Formal accessibility testing remains [NOT VERIFIED](../11-ui/accessibility.md).

### CARE-PROD-010 — Public marketing page uses demo-only data

**Priority:** P1  
**Status:** IMPLEMENTED  
**Acceptance:** [AC-UI-002](./acceptance-criteria.md#ac-ui-002)

The landing page’s previews are static demo content and must never load an authenticated user’s health data.

## Non-functional requirements

- Protect identifiers, profile data, vital readings, and AI outputs from other users.
- Never expose OpenRouter or Firebase Admin secrets to browser bundles.
- Keep UI useful at documented mobile, tablet, and desktop breakpoints.
- Use ordinary, cautious medical-information language and present the disclaimer wherever insights are shown.
