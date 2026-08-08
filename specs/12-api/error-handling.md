# CareAI Error Handling Specification

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [API Contracts](./api-contracts.md), [Security](../10-security/security.md)

Use stable categories: `AUTH_ERROR`, `VALIDATION_ERROR`, `DATABASE_ERROR`, `AI_ERROR`, `NETWORK_ERROR`, and `PERMISSION_ERROR`. Client messages must be plain and actionable, such as “Please sign in again,” “Check the highlighted values,” “Your reading was saved, but analysis is temporarily unavailable,” or “We couldn’t load your history. Try again.”

Never show stacks, token details, Firestore rule text, provider payloads, OpenRouter errors, or secret names. Current UI has local validation/toasts and a root error page, but no typed service error contract: **PARTIAL**.
