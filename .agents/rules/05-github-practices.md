---
trigger: always_on
---

# GitHub Practices & Secrets Management

This project is hosted on GitHub at `https://github.com/wakeupguruu/airix.git`. Follow these rules to keep git history clean, trackable, and secure.

## 1. Branching and Pull Request Strategy
- **Development Branch**: The primary branch is `main`.
- **Feature Branches**: For all non-trivial changes, create a branch from `main`:
  - `feature/<name>` for new features.
  - `fix/<name>` for bug fixes.
  - `chore/<name>` for tooling, config, dependency updates.
- **Pull Requests (PRs)**: 
  - Every PR must describe **What** changed, **Why** it was changed, and **How to test** the changes.
  - Keep PRs scoped to a single responsibility. Avoid combining multiple features or refactoring unrelated files.

## 2. Commit Conventions (Conventional Commits)
- Follow standard Conventional Commit formats:
  - `feat: <description>` (adds a new feature)
  - `fix: <description>` (resolves a bug)
  - `refactor: <description>` (reorganizes code without changing behavior)
  - `chore: <description>` (updates packages, configs, or lockfiles)
  - `docs: <description>` (modifies markdown or code documentation)
- Each commit must represent a single logical change. Do not squash different tasks together.

## 3. Mandatory Secret Redaction
- **NEVER** commit secret keys, cloud provider credentials, passwords, or tokens.
- Add sensitive config values to `.env.local` (which is git-ignored).
- If a secret is accidentally committed:
  1. Revoke and rotate the secret immediately.
  2. Rewrite git history to remove it.

## 4. Keeping Main Healthy
- Before opening a PR or pushing changes, pull the latest `main` branch and merge/rebase it into your local branch to resolve any conflicts:
  ```bash
  git checkout main
  git pull origin main
  git checkout <your-branch>
  git merge main
  ```
- Make sure all pre-commit checks and tests pass locally before proposing a merge.
