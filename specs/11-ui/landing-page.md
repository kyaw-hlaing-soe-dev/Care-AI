# CareAI Landing Page Specification

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Design System](./design-system.md), [Privacy](../10-security/privacy.md)

## Current implementation — IMPLEMENTED

Route `/` composes `LandingNav`, `Hero`, `DashboardPreview`, `Features`, `HowItWorks`, `AiAnalysis`, `HealthTrends`, `TrustSection`, `CtaSection`, and `LandingFooter` over `AmbientBackground`.

It must retain its public/product purpose: navbar, hero, product/dashboard preview, features, workflow, trends/history preview, CareAI insight section, final CTA, and footer. The landing doctor is a visual asset; it must not imply a clinician relationship or diagnostic capability.

**CARE-UI-001 — P1 / IMPLEMENTED:** Marketing preview values are illustrative demo data only. Never read `useAuth`, profile, vitals, Firestore, or private dashboard state into public marketing sections. Links may route visitors to login/get started; marketing copy must use informational health language.
