---
name: react-next-project-audit
description: Audit and refactor a React/Next.js project. Use this when asked to review the whole project, find bugs, improve architecture, clean code, optimize performance, and safely refactor.
---

# React/Next.js Project Audit & Refactor

## Goal

Perform a full project review and safe refactor without breaking existing behavior.

Focus on:
- bugs
- TypeScript issues
- React/Next.js anti-patterns
- unnecessary re-renders
- duplicated code
- bad folder structure
- unclear naming
- dead code
- unsafe async logic
- bad API/data fetching patterns
- poor component decomposition
- styling inconsistencies
- performance problems
- build/lint/test errors

## Workflow

1. Inspect the project structure first.
2. Detect package manager: npm, pnpm, yarn, or bun.
3. Read:
   - package.json
   - tsconfig.json
   - next.config.*
   - eslint config
   - src/app, src/pages, src/components, src/features, src/entities, src/shared if present
4. Run available checks:
   - install only if dependencies are missing
   - lint
   - typecheck
   - tests
   - build
5. Do not make large refactors immediately.
6. First create an audit summary:
   - critical bugs
   - architecture problems
   - code quality issues
   - performance issues
   - suggested refactor plan
7. Refactor in small safe steps.
8. After every meaningful change, re-run the relevant check.
9. Preserve existing public behavior unless explicitly asked to change it.
10. Do not add new libraries unless there is a strong reason.

## Refactor rules

- Prefer simple readable code over clever abstractions.
- Keep components small and focused.
- Move reusable UI to shared/components or shared/ui.
- Move business logic to hooks, services, stores, or feature modules.
- Remove duplicated code.
- Improve naming.
- Avoid prop drilling when a local store/context is already appropriate.
- Do not mix API calls directly inside deeply nested UI components if a cleaner layer exists.
- Keep server/client boundaries correct in Next.js.
- Add `"use client"` only when necessary.
- Do not convert everything to client components.
- Do not break routing, auth, environment variables, or API contracts.

## Next.js specific checks

Check for:
- incorrect server/client component usage
- unnecessary client components
- bad metadata usage
- wrong route structure
- middleware/proxy issues
- hydration problems
- incorrect environment variable usage
- slow loading caused by blocking client logic
- bad image/font usage
- duplicated layout logic

## Zustand / React Query / Axios checks

If the project uses Zustand:
- keep stores minimal
- avoid storing derived state unnecessarily
- avoid huge global stores

If the project uses TanStack Query:
- check query keys
- check staleTime/cacheTime/gcTime usage
- avoid duplicated fetching
- avoid fetching inside random effects when query should be used

If the project uses Axios:
- check baseURL
- check interceptors
- check error handling
- check token refresh logic if present

## Output format

Always respond with:

1. What I checked
2. Problems found
3. Refactor plan
4. Changes made
5. Files changed
6. Commands run
7. Remaining risks / TODO

## Safety

- Never delete large files or folders without explaining why.
- Never rewrite the whole project at once.
- Never change business logic silently.
- Never expose secrets from .env files.
- If tests/build fail before changes, clearly say that they were already failing.