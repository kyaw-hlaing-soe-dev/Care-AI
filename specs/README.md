# CareAI Specifications

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10

CareAI is a responsive health-vital tracking web application. The current repository is a TanStack Start/React/TypeScript frontend using local browser storage. A TanStack server endpoint now validates and scores vital submissions and calls OpenRouter with a normalized safety contract. Firebase, Firestore, Firebase Storage, verified identity, and durable protected persistence remain the intended MVP target and are not implemented.

## MVP status

The UI MVP is substantially implemented: landing, profile onboarding, vital entry, dashboard, local history, charts, responsive layouts, and a deterministic score/insight stand-in work in-browser. The production data, identity, AI, and security layers are not implemented.

## Technology summary

- **Current:** TanStack Start, React 19, TypeScript, Vite, Tailwind CSS 4, React Query, Recharts, Motion, Zod, localStorage.
- **Target:** Firebase Authentication with Google Provider, Cloud Firestore, Firebase Storage for files only, and Firebase Cloud Functions (or another protected server) using Firebase Admin and OpenRouter.

## Specification index

### Product

- [Product Requirements](./01-product/product-requirements.md)
- [User Flows](./01-product/user-flows.md)
- [Acceptance Criteria](./01-product/acceptance-criteria.md)

### Architecture

- [System Architecture](./02-architecture/system-architecture.md)
- [Frontend Architecture](./02-architecture/frontend-architecture.md)
- [Backend Architecture](./02-architecture/backend-architecture.md)
- [Data Flow](./02-architecture/data-flow.md)

### Features

- [Authentication](./03-auth/authentication.md) and [Authorization](./03-auth/authorization.md)
- [User Profile](./04-profile/user-profile.md)
- [Vital Tracker](./05-vitals/vital-tracker.md), [Validation](./05-vitals/validation.md), and [Health Score](./05-vitals/health-score.md)
- [OpenRouter](./06-ai/openrouter.md), [AI Analysis](./06-ai/ai-analysis.md), [AI Output Schema](./06-ai/ai-output-schema.md), and [AI Safety](./06-ai/ai-safety.md)
- [Dashboard](./07-dashboard/dashboard.md), [Health Trends](./07-dashboard/health-trends.md), and [History](./08-history/history.md)

### Data, security, and UI

- [Firestore Schema](./09-database/firestore-schema.md), [Firestore Queries](./09-database/firestore-queries.md), and [Storage](./09-database/storage.md)
- [Security](./10-security/security.md), [Firestore Rules](./10-security/firestore-rules.md), and [Privacy](./10-security/privacy.md)
- [Design System](./11-ui/design-system.md), [Landing Page](./11-ui/landing-page.md), [Responsive Design](./11-ui/responsive-design.md), and [Accessibility](./11-ui/accessibility.md)
- [API Contracts](./12-api/api-contracts.md) and [Error Handling](./12-api/error-handling.md)
- [Testing Strategy](./13-testing/testing-strategy.md) and [QA Checklist](./13-testing/qa-checklist.md)
- [Implementation Plan](./14-development/implementation-plan.md), [Coding Rules](./14-development/coding-rules.md), and [Definition of Done](./14-development/definition-of-done.md)

## Current feature inventory

| Area | Status | Evidence |
| --- | --- | --- |
| Local vital tracking, validation, score, and history | IMPLEMENTED | `src/components/VitalForm.tsx`, `src/lib/vitals*.ts` |
| Profile onboarding and redirects | PARTIAL | `src/lib/profile-context.tsx`; browser-only persistence |
| Authentication / Google Sign-In | NOT IMPLEMENTED | `src/lib/auth-context.tsx` simulates a fixed user |
| Firebase / Firestore / Storage | NOT IMPLEMENTED | no Firebase dependency, configuration, or rules found |
| OpenRouter integration | PARTIAL | server-only TanStack endpoint, validation, timeout/retry, normalization, fallback, and tests; no verified auth or Firestore persistence |
| Dashboard and local trends | PARTIAL | `src/routes/dashboard.tsx`, local records only |
| Responsive public and authenticated UI | IMPLEMENTED | Tailwind/Tailwind CSS responsive layouts |
| Automated tests | PARTIAL | focused AI endpoint/provider/normalization tests; broader unit, integration, component, and E2E coverage remain |

## How AI coding agents must use these specs

1. Read this file first.
2. Locate the feature specification and its requirement ID.
3. Read the related architecture, security, data, and acceptance-criteria specifications.
4. Inspect the existing implementation before changing it.
5. Implement only the scoped requirement and its necessary dependencies.
6. Run the specified tests and responsive checks.
7. Update the affected spec whenever behavior, schema, or a requirement status changes.
8. Never silently contradict a specification, alter the score algorithm, expose a secret, or trust a client-provided UID.

The delivery workflow is: **requirement → relevant spec → acceptance criteria → implementation plan → code → tests → verification → spec update**.
