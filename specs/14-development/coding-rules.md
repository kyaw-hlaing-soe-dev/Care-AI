# CareAI Coding Rules

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [README](../README.md), [Definition of Done](./definition-of-done.md)

Future agents must read the relevant feature, architecture, security, data, and acceptance specs before coding. Inspect existing code first; do not change unrelated files; reuse existing components; avoid unnecessary dependencies; run tests/build and viewport checks.

Never silently change Firestore schema, health-score algorithm, route/ownership behavior, or CareAI naming. Never expose secrets, log sensitive health data, trust a client UID, or call OpenRouter from browser code. Keep landing demo data separate from private user data. Update the relevant specification and requirement status whenever behavior changes.
