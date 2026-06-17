---
trigger: always_on
---

# Code Quality, Type Safety & Reliability

Since this workspace contains user-facing web applications, maintaining type safety and robust error handling is critical for reliability.

## 1. Type Safety and Compilation
- **No `any` Types**: Write clean, explicit interfaces and types. Avoid resolving compiler issues with `any` or `@ts-ignore` comments unless there is a well-documented compiler limitation.
- **Type Checking**: Run `pnpm run check-types` before committing. All TypeScript compilation errors must be resolved before code is merged.

## 2. React & Next.js Best Practices
- **Hydration Safety**: Avoid hydration mismatches by ensuring server-side rendered layouts match client-side outputs. Guard client-only features properly (e.g. using `useEffect` or checking if window is defined).
- **Error Boundaries**: Wrap major UI sections in React Error Boundaries to prevent a single JavaScript error from crashing the entire page.
- **Console Warnings**: Do not commit code that triggers React keys, console warnings, or layout shifts.

## 3. Strict Error Handling
- Never write empty catch blocks (e.g. `try { ... } catch(e) {}`).
- If an error is expected and should be ignored, explicitly comment why it is ignored or log it at a debug level.

## 4. Scope and Regressions
- Solve only the requested changes. Avoid refactoring unrelated code, upgrading major versions of frameworks, or changing shared package configurations without discussing with the team.
- Ensure that modifying components in `@repo/ui` does not break styles or functionality in any other app that imports them.
