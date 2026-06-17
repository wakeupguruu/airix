---
trigger: always_on
---

# Git & Commit Discipline (The Narrative Commit Style)

This project strictly follows the **Narrative Commit Style** to ensure changes are logical, reviewable, and tell a clear evolutionary story of the codebase.

## 1. No Mass Squashing
- **Do NOT squash all changes into a single monolithic commit.** 
- Separate refactoring, feature additions, and bug fixes into distinct commits.

## 2. Commit Atomicity & Validity (Critical)
- Each commit must represent **one coherent change** that can be understood in isolation.
- **Every commit must leave the repository in a usable, buildable state.** 
- Never commit partial implementations that break builds, reference missing variables, or depend on files not yet committed.
- When spanning large changes across multiple files, order your commits so that dependencies are introduced *before* they are used.

## 3. Clear Intent
- Commits are a permanent engineering record.
- Focus the commit body on the *why* and *how* of non-obvious design decisions, not just repeating *what* the diff shows.

## 4. Multi-Service Changes
- If a feature requires changes in both `apps/backend` and `apps/web`, group them logically. First introduce the API contract changes in the backend, then consume them in the frontend in subsequent commits.

## 5. 
