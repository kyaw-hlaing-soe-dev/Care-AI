# CareAI Frontend Architecture

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-08  
**Related:** [System Architecture](./system-architecture.md), [Design System](../11-ui/design-system.md)

## Actual structure

- `src/routes`: file routes for `/`, `/login`, `/create-profile`, `/dashboard`, `/add`, `/history`, and `/history/$id`.
- `src/components`: shared app shell, auth/profile experience, dashboard, history, landing, glass primitives, and UI components.
- `src/lib/auth-context.tsx`: mock localStorage identity context.
- `src/lib/profile-context.tsx`: local profile context.
- `src/lib/vitals.ts`: score/range/analysis logic; `vitals-store.ts`: local persistence.
- `src/hooks/use-vitals.ts`: subscription-based local data hook.
- `src/router.tsx`, `src/start.ts`, and `src/server.ts`: TanStack Start application setup.

`__root.tsx` supplies React Query, `AuthProvider`, `ProfileProvider`, and the toast host. `ProtectedRoute` gates authenticated/profile-complete app pages and wraps them in `AppShell`.

## State and data — CURRENT

No Redux, Firebase client, API client, or remote-query integration is implemented. React Context holds mock auth/profile state; `useVitals` reads localStorage and observes custom/storage events. React Query is configured but no project query usage was found.

## Target boundaries

Keep visual components presentational. Move identity and remote data access behind dedicated Firebase/API services and feature hooks. Do not make components construct Firestore paths, send UIDs, or contain OpenRouter secrets. Preserve current route responsibilities and app-shell protection.
