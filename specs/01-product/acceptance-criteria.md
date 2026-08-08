# CareAI Acceptance Criteria

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Product Requirements](./product-requirements.md), [Testing Strategy](../13-testing/testing-strategy.md)

## AC-AUTH-001

**Related requirement:** CARE-PROD-003  
**Status:** NOT IMPLEMENTED

**GIVEN** a visitor is unauthenticated  
**WHEN** they complete Google authentication through Firebase  
**THEN** an existing profile routes them to `/dashboard`, and a missing profile routes them to `/create-profile` without exposing another user’s state.

## AC-PROFILE-001

**Related requirement:** CARE-PROD-004  
**Status:** PARTIAL

**GIVEN** an authenticated user without a profile  
**WHEN** they submit valid required profile fields  
**THEN** the profile is written under the UID derived from the trusted session and `/dashboard` opens after the success state.

## AC-VITAL-001

**Related requirement:** CARE-PROD-001  
**Status:** IMPLEMENTED (client); NOT IMPLEMENTED (server)

**GIVEN** a profile-complete user  
**WHEN** they submit five numeric readings inside technical limits  
**THEN** one reading is created and duplicate clicks do not create a second record.

## AC-SCORE-001

**Related requirement:** CARE-PROD-002  
**Status:** IMPLEMENTED

**GIVEN** identical valid input values  
**WHEN** the score is calculated  
**THEN** score, status, and range-derived lists are identical on every run.

## AC-AI-001

**Related requirement:** CARE-PROD-006  
**Status:** NOT IMPLEMENTED for provider integration

**GIVEN** a validated, saved reading  
**WHEN** the protected AI provider is available  
**THEN** only minimal permitted context is sent, its response is normalized to the approved schema, and the UI shows the disclaimer.

## AC-DASH-001

**Related requirement:** CARE-PROD-007  
**Status:** PARTIAL

**GIVEN** an authenticated user with readings  
**WHEN** dashboard data loads  
**THEN** the latest score, vitals, trend summaries, insight, and recent logs derive only from that user’s records; empty, loading, and failure states are distinguishable.

## AC-HISTORY-001

**Related requirement:** CARE-PROD-008  
**Status:** IMPLEMENTED locally; NOT IMPLEMENTED remotely

**GIVEN** a user has saved readings  
**WHEN** they open history  
**THEN** readings are newest first, date filtering is accurate, and an expanded item shows the linked analysis.

## AC-SEC-001

**Related requirement:** CARE-PROD-005  
**Status:** NOT IMPLEMENTED

**GIVEN** User A is authenticated  
**WHEN** User A requests profile, reading, or analysis data  
**THEN** data belonging to User B is unavailable by client query, rule evaluation, and backend token verification.

## AC-UI-001

**Related requirement:** CARE-PROD-009  
**Status:** PARTIAL / NOT VERIFIED

**GIVEN** a supported viewport and keyboard-only interaction  
**WHEN** the user navigates forms, dialogs, charts, and menus  
**THEN** controls have names, visible focus, usable target sizes, no horizontal overflow, and reduced motion is respected.

## AC-UI-002

**Related requirement:** CARE-PROD-010  
**Status:** IMPLEMENTED

**GIVEN** a visitor loads `/`  
**WHEN** they view product previews  
**THEN** only illustrative demo values are rendered and no authenticated local or remote record is read.
