# CareAI Storage Specification

**Status:** Planned  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [Privacy](../10-security/privacy.md), [Firestore Schema](./firestore-schema.md)

Cloud Firestore is the structured database for profiles, vitals, and analyses. Firebase Storage is for binary files only.

## Current state

**NOT IMPLEMENTED.** No Firebase Storage package/configuration or upload UI exists. Current UI can display an auth avatar URL but does not upload it.

## Target

Optional approved file path: `users/{uid}/profile/avatar.<validated-extension>`. Apply ownership rules, MIME/size validation, and metadata restrictions. Never store normal vital records, analyses, profile JSON, API logs, or database exports as Storage files.
