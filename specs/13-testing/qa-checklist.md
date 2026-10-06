# CareAI QA Checklist

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Testing Strategy](./testing-strategy.md), [Definition of Done](../14-development/definition-of-done.md)

## Auth and profile

- [ ] Google login, cancellation, logout, and session refresh
- [ ] New-user and existing-user redirects
- [ ] Profile validation, save failure, and refresh behavior

## Vitals, dashboard, history

- [ ] Valid/invalid vital submission and duplicate click
- [ ] Deterministic score boundary cases
- [ ] Reading saves with deterministic insight and an accurate Spark-mode AI-disabled notice
- [ ] Latest reading, score, trends, insight, history ordering, pagination

## Security and UX

- [ ] User A cannot read/write User B data
- [ ] OpenRouter/Admin secrets and API-base configuration absent from browser bundle/logs
- [ ] Firestore/Storage rules deployed and tested
- [ ] Requested responsive viewport matrix, keyboard, focus, contrast, reduced motion
- [ ] Loading, empty, permission, network, and AI-error states; no console errors
- [ ] Senior symptom form validation, 52px targets, keyboard selection, and mobile sticky action bar
- [ ] Senior result dialog loading/error/success, focus behavior, edit preserving answers and scroll position
- [ ] Gemini missing key, timeout/provider failure, malformed schema, urgency-color mismatch, and unsafe language rejection
- [ ] Senior symptom privacy/clinical review complete before enabling the Gemini service for real users
