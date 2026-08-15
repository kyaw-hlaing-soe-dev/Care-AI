# CareAI Firestore Rules Specification

**Status:** Deployed and emulator verified; browser E2E pending
**Version:** 1.1
**Last Updated:** 2026-08-15
**Related:** [Firestore Schema](../09-database/firestore-schema.md), [Authorization](../03-auth/authorization.md)

## Current state

**DEPLOYED TO `care-ai-4eb8d` AND EMULATOR VERIFIED.** `firestore.rules` enables the direct Spark-plan data path while treating every browser request as untrusted. Rules require `request.auth.uid == uid`, exact whitelisted fields, profile types/ranges, server timestamps, technical vital limits, the exact deterministic score/status/emergency/urgency result, and an idempotency key equal to the reading document ID.

Profiles may be created and updated by their owner but not deleted. Vital readings may be created once and are immutable. Analysis documents remain owner-readable for legacy compatibility but reject all client writes. Every other path is denied.

## Required tests

- owner profile read/create/validated update succeeds;
- unauthenticated and cross-owner reads/writes fail;
- unexpected profile fields and invalid ranges fail;
- an exact deterministic reading succeeds;
- forged score/status, invalid vital limits, mismatched document ID, update, and delete fail;
- deterministic emergency input requires the exact urgent result.

Rules are the active authorization and write-validation boundary. Six focused emulator cases pass and the Firebase CLI compiled/released the rules plus indexes successfully on 2026-08-15. Authenticated browser ownership/E2E verification is still required before using real health data.
