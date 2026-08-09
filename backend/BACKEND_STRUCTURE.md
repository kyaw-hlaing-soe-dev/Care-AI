# CareAI Backend Structure

## Selected Root

`functions/` is the backend root for the CareAI MVP. The specs prefer Firebase Cloud Functions or an equivalent protected server, and Firebase Cloud Functions is the smallest fit because the planned stack is Firebase Auth, Cloud Firestore, Firebase Storage for files only, Firebase Admin SDK, and OpenRouter.

## Folder Tree

```text
functions/
├── .env.example
├── BACKEND_STRUCTURE.md
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── auth/
│   │   └── verifyAuth.ts
│   ├── config/
│   │   ├── env.ts
│   │   └── firebase.ts
│   ├── constants/
│   │   └── errorCodes.ts
│   ├── data/
│   │   ├── firestoreClient.ts
│   │   └── firestorePaths.ts
│   ├── functions/
│   │   ├── analyzeVitals.ts
│   │   ├── getDashboard.ts
│   │   ├── getHistory.ts
│   │   └── manageProfile.ts
│   ├── providers/
│   │   └── openRouterProvider.ts
│   ├── services/
│   │   ├── aiAnalysisService.ts
│   │   ├── dashboardService.ts
│   │   ├── healthScoreService.ts
│   │   ├── historyService.ts
│   │   ├── profileService.ts
│   │   ├── preferenceService.ts
│   │   └── vitalService.ts
│   ├── utils/
│   │   ├── errors.ts
│   │   └── logger.ts
│   └── validators/
│       ├── aiOutputValidator.ts
│       ├── historyQueryValidator.ts
│       ├── profileValidator.ts
│       └── vitalValidator.ts
└── test/
    ├── README.md
    ├── functions/
    │   └── README.md
    ├── services/
    │   └── README.md
    └── validators/
        └── README.md
```

## Responsibilities

`src/index.ts`: Cloud Functions export boundary. Future callable or HTTPS functions should be registered here after their handlers are implemented.

`src/auth/`: Firebase Authentication boundary. Future code verifies ID tokens and derives the trusted UID from Firebase, never from request input.

`src/config/`: Environment and provider configuration. Future code reads Firebase/OpenRouter settings without exposing secrets to browser bundles.

`src/constants/`: Shared stable backend constants such as safe error categories and algorithm version identifiers.

`src/data/`: Firestore boundary for clients and path helpers. This is not a repository layer; services can use it directly for the MVP.

`src/functions/`: Cloud Function handler files for the API operations described by the specs.

`src/providers/`: External provider integrations. OpenRouter belongs here because the API key must stay server-side.

`src/services/`: Core backend workflows for profile, vitals, health score, AI analysis, dashboard, history, and preferences.

`src/validators/`: Request and provider-output validation. Server validation must repeat client checks before any trusted write or AI call.

`src/utils/`: Small shared helpers for safe errors and privacy-safe logging.

`test/`: Future backend tests grouped by functions, services, and validators.

## Confirmed Data Model

```text
users/{uid}
users/{uid}/vitals/{readingId}
users/{uid}/analyses/{analysisId}
```

Firestore stores structured profiles, preferences, vital readings, health scores, and AI analyses. Firebase Storage is reserved for optional files such as profile avatars.

## Recommended Implementation Order

Phase 1: Firebase project setup, Firebase Admin initialization, local emulator/deploy configuration, and server environment access.

Phase 2: Firebase authentication verification and UID derivation.

Phase 3: Profile create/read/update for `users/{uid}`, including `preferredLanguage`.

Phase 4: Server vital validation using the documented technical input limits.

Phase 5: Deterministic health-score service ported from the current documented algorithm.

Phase 6: Vital submission function that validates, scores, writes the reading, and prevents duplicate submissions.

Phase 7: OpenRouter provider using server-only `OPENROUTER_*` configuration.

Phase 8: AI output normalization, fallback status handling, and analysis persistence.

Phase 9: Dashboard and history functions with bounded UID-scoped Firestore queries and pagination.

Phase 10: Safe error contract, privacy-safe logging, unit/integration tests, Firestore/Storage rules verification, and deployment.
