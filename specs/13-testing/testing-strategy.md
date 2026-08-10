# CareAI Testing Strategy

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [QA Checklist](./qa-checklist.md), [Health Score](../05-vitals/health-score.md)

## Current state

**PARTIAL.** `npm run test:ai` covers vital request rejection, exact AI schema normalization, unsafe-output fallback, missing configuration, minimal provider context, deterministic urgency authority, 4xx/5xx retry behavior, and warm-instance idempotency. Score boundary suites, auth/Firestore integration, components, E2E, and manual release checks remain outstanding.

## Target priorities

Unit-test score boundaries/determinism, vital validation, AI normalization/fallbacks, and date filters. Integration-test Firebase auth redirects, Firestore ownership rules, profile writes, vital submission, duplicate prevention, and saved-reading/AI-failure behavior. Component-test errors, loading/empty states, accessible selectors, and charts. End-to-end-test Google auth (test environment), onboarding, dashboard, history, logout, and failure cases. Run manual viewport, keyboard, screen-reader, reduced-motion, and console checks for each release.
