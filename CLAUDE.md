# tata-hackathon — AI Instructions

## Project Overview

This repository is a modern Turborepo workspace built with Next.js, pnpm, and Tailwind CSS.
It is connected to the remote repository: `https://github.com/wakeupguruu/airix.git`.

### App Layout
- **`apps/web`**: Primary Next.js application.
- **`apps/docs`**: Documentation Next.js application.
- **`packages/ui`**: Shared UI component library.
- **`packages/tailwind-config`**: Shared Tailwind CSS configurations.
- **`packages/typescript-config`**: Shared TypeScript compilation rules.
- **`packages/eslint-config`**: Shared ESLint settings.

---

## 🛠️ Commands Reference

Run these commands from the root directory:

- **Install dependencies**: `pnpm install`
- **Start all dev servers**: `pnpm run dev`
- **Build all packages/apps**: `pnpm run build`
- **Run all linting checks**: `pnpm run lint`
- **Run type safety checks**: `pnpm run check-types`
- **Format codebase**: `pnpm run format`

---

## 📋 Coding Conventions & Guidelines

### 1. Type Safety
- TypeScript is strictly required. Never use `any` unless absolutely necessary and documented.
- Always run `pnpm run check-types` before submitting code changes.

### 2. Styling (Tailwind CSS v4)
- This project utilizes Tailwind CSS v4.
- Styles are imported using `@import "tailwindcss";` in `@repo/tailwind-config/shared-styles.css`.
- Theme values are configured inside `@theme { ... }` blocks in CSS files.
- Avoid legacy `tailwind.config.js` setups; keep styling configurations inside the CSS theme boundaries where possible.

### 3. Workspace Separation
- Keep apps isolated. Use workspace imports (e.g. `@repo/ui`) to share React components, types, and configs.
- Do not import code directly using relative paths from other applications in `apps/`.

---

## 🌿 Git & Commit Guidelines

- **Narrative Commit Style**: Follow Conventional Commits format (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).
- **Commit Atomicity**: Keep commits small and logical. Do not squash unrelated changes.
- **Pre-commit Checks**: Ensure TypeScript compiler (`check-types`), lint (`lint`), and formatting checks pass locally before staging or pushing.
