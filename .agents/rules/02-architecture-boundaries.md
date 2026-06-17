---
trigger: always_on
---

# Architecture Boundaries & Workspace Communication

This project is a Turborepo monorepo using pnpm workspaces. Strict boundaries exist to prevent cross-app spaghetti code and maintain clean separation of concerns.

## 1. App-to-App Separation
- **`apps/web`** and **`apps/docs`** are fully independent Next.js applications.
- **NEVER** import code, assets, or types directly between apps (e.g., do not import files in `apps/web` from `apps/docs` or vice-versa).
- They must not communicate directly except through standard hyperlinks or shared services/APIs.

## 2. Shared Workspace Packages
- Common styling configs, linters, TypeScript configs, and UI components live in the `packages/` directory:
  - `@repo/ui` — Shared UI components built with Tailwind CSS.
  - `@repo/tailwind-config` — Shared Tailwind configurations and styling bases.
  - `@repo/typescript-config` — Shared TypeScript compiler options.
  - `@repo/eslint-config` — Shared linting rules.
- If components or utilities are needed by both `web` and `docs`, they **must** be abstracted into a shared package under `packages/` rather than copied or directly imported.

## 3. Package Scopes
- All shared packages must use the `@repo/` workspace prefix for clear identification.
- Ensure any new package is defined in `pnpm-workspace.yaml` and reference it in application `package.json` files using `workspace:*` versions.
