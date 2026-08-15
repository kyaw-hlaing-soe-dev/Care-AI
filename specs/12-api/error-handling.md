# CareAI Error Handling Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [API Contracts](./api-contracts.md), [Security](../10-security/security.md)

Use stable categories: `AUTH_ERROR`, `VALIDATION_ERROR`, `DATABASE_ERROR`, `AI_ERROR`, `NETWORK_ERROR`, and `PERMISSION_ERROR`. Client messages must be plain and actionable, such as “Please sign in again,” “Check the highlighted values,” “Your reading was saved, but analysis is temporarily unavailable,” or “We couldn’t load your history. Try again.”

Never show stacks, token details, Firestore rule text, provider payloads, OpenRouter errors, or secret names. The API returns stable safe envelopes across profile, vital, dashboard, history, and retry operations; the client maps them to plain messages. Live permission/network/database acceptance remains outstanding.
