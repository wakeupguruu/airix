---
name: to-prd
description: >
  Turn the current conversation context into a PRD and publish it to the project
  issue tracker. Use when user wants to create a PRD from the current context.
---

# /to-prd

Synthesize current context into a Product Requirements Document (PRD).

## Process

1. **Explore**: Understand current state. Use domain glossary and respect ADRs.
2. **Sketch Modules**: Identify new or modified modules. Focus on **deep modules** with simple, testable interfaces. Confirm with user.
3. **Write PRD**: Use the template and publish to the issue tracker with `ready-for-agent` label.

## PRD Template

```markdown
## Problem Statement
[User's perspective]

## Solution
[User's perspective]

## User Stories
1. As an <actor>, I want a <feature>, so that <benefit>
...

## Implementation Decisions
- Modules/Interfaces
- Architectural decisions
- API contracts
(No stale file paths. Prototype snippets allowed.)

## Testing Decisions
- Behavioral testing focus
- Modules to be tested
- Prior art references

## Out of Scope
[What will NOT be built]

## Further Notes
```
