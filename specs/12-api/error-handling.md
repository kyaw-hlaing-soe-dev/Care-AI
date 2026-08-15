# CareAI Error Handling Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [API Contracts](./api-contracts.md), [Security](../10-security/security.md)

The active Firestore service uses stable categories: `AUTH_ERROR`, `VALIDATION_ERROR`, `DATABASE_ERROR`, and `PERMISSION_ERROR`. Client messages must be plain and actionable, such as “Please sign in again,” “Check the highlighted values,” “We couldn't save your vitals,” or “We couldn’t load your history. Try again.” The UI separately states that AI is disabled in Firestore-only Spark mode.

Never show stacks, token details, Firestore rule text, raw SDK errors, provider payloads, or secret names. Contexts/hooks map failures to plain messages. Live permission/network/database acceptance remains outstanding.
