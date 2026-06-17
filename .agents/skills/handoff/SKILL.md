---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
---

# /handoff

Write a handoff document summarising the current conversation so a fresh agent can continue the work.

## Rules

1. **Portable**: Summarise context so a fresh agent can pick up.
2. **References**: Do not duplicate content in PRDs, plans, ADRs, or issues. Reference them by path/URL.
3. **Skill Suggestions**: Suggest which skills the next agent should use.
4. **Tailored**: Use provided arguments to focus the handoff on the next session's goal.
