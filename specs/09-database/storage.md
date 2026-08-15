# CareAI Storage Specification

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Privacy](../10-security/privacy.md), [Firestore Schema](./firestore-schema.md)

Cloud Firestore is the structured database for profiles, vitals, and analyses. Firebase Storage is for binary files only.

## Current state

**DENY-BY-DEFAULT RULES IMPLEMENTED, FILE FEATURE NOT IMPLEMENTED.** `storage.rules` denies every read/write and no upload UI exists. The authenticated Google avatar remains a provider URL; no CareAI file persistence is enabled.

## Target

Optional approved file path: `users/{uid}/profile/avatar.<validated-extension>`. Apply ownership rules, MIME/size validation, and metadata restrictions. Never store normal vital records, analyses, profile JSON, API logs, or database exports as Storage files.
