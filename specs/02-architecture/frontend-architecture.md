# CareAI Frontend Architecture

**Status:** Active  
**Version:** 1.0  
**Last Updated:** 2026-08-10
**Related:** [System Architecture](./system-architecture.md), [Design System](../11-ui/design-system.md)

## Actual structure

- `src/routes`: file routes for `/`, `/login`, `/create-profile`, `/dashboard`, `/add`, `/history`, and `/history/$id`.
- `src/components`: shared app shell, auth/profile experience, dashboard, history, landing, glass primitives, and UI components.
- `src/lib/auth-context.tsx`: Firebase Authentication session context and one-time legacy local-data cutover.
- `src/lib/profile-context.tsx`: protected API-backed profile context.
- `src/lib/api-client.ts`: token-bearing profile, vital, dashboard, and history API client; `vitals-store.ts`: submission adapter.
- `src/hooks/use-vitals.ts`: React Query dashboard/history/detail hooks.
- `src/router.tsx`, `src/start.ts`, and `src/server.ts`: TanStack Start application setup.

`__root.tsx` supplies React Query, `AuthProvider`, `ProfileProvider`, and the toast host. `ProtectedRoute` gates authenticated/profile-complete app pages and wraps them in `AppShell`.

## State and data — IMPLEMENTED IN CODE, NOT DEPLOYED

Firebase Auth supplies identity and ID tokens. Profile and vital data travel through the protected backend API, while React Query owns dashboard, paginated history, and detail state. The browser no longer persists private profile or vital records; only language preference and a non-sensitive one-time cutover marker remain in localStorage.

## Target boundaries

Keep visual components presentational. Move identity and remote data access behind dedicated Firebase/API services and feature hooks. Do not make components construct Firestore paths, send UIDs, or contain OpenRouter secrets. Preserve current route responsibilities and app-shell protection.
