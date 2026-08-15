# CareAI Firestore Rules Specification

**Status:** Implemented in code, deployment pending
**Version:** 1.1
**Last Updated:** 2026-08-15
**Related:** [Firestore Schema](../09-database/firestore-schema.md), [Authorization](../03-auth/authorization.md)

## Current state

**IMPLEMENTED, NOT DEPLOYED.** `firestore.rules` enables the direct Spark-plan data path while treating every browser request as untrusted. Rules require `request.auth.uid == uid`, exact whitelisted fields, profile types/ranges, server timestamps, technical vital limits, the exact deterministic score/status/emergency/urgency result, and an idempotency key equal to the reading document ID.

Profiles may be created and updated by their owner but not deleted. Vital readings may be created once and are immutable. Analysis documents remain owner-readable for legacy compatibility but reject all client writes. Every other path is denied.

## Required tests

- owner profile read/create/validated update succeeds;
- unauthenticated and cross-owner reads/writes fail;
- unexpected profile fields and invalid ranges fail;
- an exact deterministic reading succeeds;
- forged score/status, invalid vital limits, mismatched document ID, update, and delete fail;
- deterministic emergency input requires the exact urgent result.

Rules are the active authorization and write-validation boundary, so deployment and emulator acceptance are required before using real data.
