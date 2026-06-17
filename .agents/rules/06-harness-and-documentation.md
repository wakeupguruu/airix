---
trigger: always_on
---

# Harness Verification & Documentation

This rule ensures that the build pipeline and styling architecture remain clean, documented, and fully verified.

## 1. Local Pre-Verification
- Before committing, always run the validation checks locally:
  - `pnpm run lint` — Runs ESLint checks on all code.
  - `pnpm run check-types` — Validates TypeScript compilers for both web and docs.
- The project build MUST pass:
  - `pnpm run build` — Runs the full Turborepo optimization build.

## 2. Shared Component Documentation
- When adding new shared UI components to the `@repo/ui` package:
  - Ensure typescript types and interfaces for the component props are fully exported.
  - Test that the styling compiles correctly with Tailwind CSS v4 setup.
  - Document usage instructions or props details inside the package or in a README so other team members can easily integrate it.

## 3. Project README Updates
- Keep root and app-level `README.md` files updated with any new workspace packages or environment setup changes.
