---
name: dispatch-subagents
description: Launch isolated subagents in one parallel turn for independent Kestrel work. Use for /multitask, when the user asks to run workers at the same time, or when a plan in .cursor/plans names parallel agents.
---

# Dispatch subagents

Each subagent starts with clean context and cannot see this chat, so its prompt carries everything it needs.

## Launch

1. Read the plan. Only pieces that do not depend on each other's diffs run in parallel.
2. In one turn, launch one subagent per piece, each on its own worktree. The first launches are the named workers. Never launch a single wrapper subagent to "implement the plan".
3. Put each worker's owned paths, the shared contract, what is out of scope, and its verify step in its prompt.
4. Wait for every worker, then apply their diffs from the main checkout in the plan's order.
5. Run every module's tests and report what each worker changed and the results. Leave review to the user.

## Conflicts

Owned paths are disjoint. If two diffs touch the same file, one worker strayed: keep the owner's hunk, revert the other, and say so.

## Stay on the main checkout

This chat stays in the primary checkout. Do not check out a worker branch here or move this chat's root to a worker worktree. Read worker diffs from their worktree paths.

Do not merge or commit unless asked.
