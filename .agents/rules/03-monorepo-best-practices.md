---
trigger: always_on
---

# Monorepo & Configuration Best Practices

This Turborepo is configured with `pnpm` workspaces and `turbo` for caching and build optimization. Follow these practices to maintain a healthy monorepo.

## 1. Environment Variable Safety in Next.js
- **Frontend/Client Variables**: Any variable exposed to the browser MUST be prefixed with `NEXT_PUBLIC_`.
- **Server Variables**: Secret keys, API tokens, and database URLs must NOT have the `NEXT_PUBLIC_` prefix. They must reside in local `.env.local` files and remain strictly server-side.
- Never commit `.env` or `.env.local` files containing actual credentials to the git repository.

## 2. Abstraction Protocol for Shared Packages
- Keep utilities localized to their respective apps (`apps/web` or `apps/docs`) unless there is a clear, stable need to share them.
- Abstract code to `packages/` only when:
  1. It is used in multiple applications/packages.
  2. The interface is stable and well-defined.
- When adding packages, make sure to configure exports correctly in `package.json` and configure `tsconfig.json` paths to reference the package source files or dist build maps.

## 3. Dependency Management via pnpm
- Always run `pnpm` commands at the root. Avoid running `npm` or `yarn` commands which will corrupt the `pnpm-lock.yaml` file.
- Add dependencies to a specific application or package using filters:
  ```bash
  pnpm --filter <app-name> add <package-name>
  ```
- Run root commands with `-w` (e.g. `pnpm add -Dw prettier` for global devDependencies).

## 4. Pipeline and Cache Utilization
- All builds, tests, type checks, and lint runs must go through Turborepo:
  - `pnpm run build`
  - `pnpm run lint`
  - `pnpm run check-types`
- Do not bypass Turbo config unless debugging a specific configuration. Ensure output paths in `turbo.json` align with package output directories (e.g. `.next`, `dist`).
