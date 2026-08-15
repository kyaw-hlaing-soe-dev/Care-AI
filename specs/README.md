# CareAI Specifications

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-15

CareAI is a responsive health-vital tracking web application. The repository now includes a Firebase Auth frontend cutover, a Firebase Cloud Functions/Firestore backend implementation, and the public web configuration for `care-ai-4eb8d`. Deployment, Google-provider setup, secret configuration, and full emulator/E2E verification remain outstanding.

## MVP status

The UI MVP and backend code path are substantially implemented. Authenticated profile, vital, dashboard, and history requests now use the protected API; legacy local records are deliberately cleared once rather than silently imported. The system is not production-ready until project provisioning, rules deployment, secret configuration, and the remaining QA checks are completed.

## Technology summary

- **Current implementation:** TanStack Start, React 19, TypeScript, React Query, Firebase Authentication, Cloud Firestore, Firebase Cloud Functions on Node.js 22, Firebase Admin, and server-only OpenRouter.
- **Deployment target:** separate Firebase development and production projects in `asia-southeast1`; Storage remains deny-by-default until a file feature is approved.

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

| Area                                           | Status      | Evidence                                                                                                                                                                        |
| ---------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vital tracking, validation, score, and history | PARTIAL     | protected API and Firestore implementation complete; deployment/E2E verification outstanding                                                                                    |
| Profile onboarding and redirects               | PARTIAL     | Firebase-backed implementation complete; provider configuration and E2E verification outstanding                                                                                |
| Authentication / Google Sign-In                | PARTIAL     | Firebase Auth implementation complete; project/provider configuration outstanding                                                                                               |
| Firebase / Firestore / Storage                 | PARTIAL     | `care-ai-4eb8d` web/project config, Functions, rules, indexes, emulator config, and deny-by-default Storage rules implemented but not deployed                                   |
| OpenRouter integration                         | PARTIAL     | verified-auth Functions path, persistence, durable idempotency, private retry task, normalization, fallback, and focused tests implemented; deployment verification outstanding |
| Dashboard and trends                           | PARTIAL     | bounded owner-scoped backend queries and frontend loading implemented; E2E verification outstanding                                                                             |
| Responsive public and authenticated UI         | IMPLEMENTED | Tailwind/Tailwind CSS responsive layouts                                                                                                                                        |
| Automated tests                                | PARTIAL     | deterministic-score, validation, provider, and Firestore owner-rule suites pass; Storage test exists but its emulator runtime download and broader integration/E2E coverage remain unverified |

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
