---
name: grill-with-docs
description: >
  Grilling session that challenges your plan against the existing domain model,
  sharpens terminology, and updates documentation (CONTEXT.md, ADRs) inline
  as decisions crystallise. Use when user wants to stress-test a plan against
  their project's language and documented decisions.
---

# /grill-with-docs

Interview the user relentlessly about every aspect of their plan until a shared understanding is reached. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask questions one at a time, waiting for feedback on each before continuing.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Supporting Documentation

The following formats must be followed when creating or updating domain documentation:

### [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md)
Structure for `CONTEXT.md` to establish shared domain language.

### [ADR-FORMAT.md](./ADR-FORMAT.md)
Format for Architectural Decision Records in `docs/adr/`.
