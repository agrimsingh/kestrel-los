---
name: reset-demo-state
description: Return the repo, its demo branches and the Google Drive brief to the pre-demo state after a run of the workshop.
---

# Reset the demo state

1. Run `git status`. List what changed and ask before discarding anything. Demo beats leave:
   - Hardship deferral files from `/multitask @hardship-deferral.md`: `legacy-core/**/HardshipDeferral*`, `servicing-api/**/deferrals/`, `servicing-ui/src/deferrals/`, plus edits to `kestrel-handlers.xml`, `contracts/openapi.yaml`, `servicing-ui/src/api/schema.d.ts` and `servicing-ui/src/App.tsx`.
   - The plan the agent wrote in `.cursor/plans/`.
   - The logging fix from the review beat: edits under `lambdas/export_delinquency_report/`.
   - A `create-api` skill in `.cursor/skills/` from the skills beat.
   Once confirmed, restore tracked files with `git restore .` and delete only those untracked paths.
2. Remove linked worktrees left by parallel agents: `git worktree list`, then `git worktree remove --force <path>` for each one that is not the main checkout, then `git worktree prune`.
3. Close every open pull request whose head branch starts with `demo/`, deleting the branch: `gh pr close <number> --delete-branch`.
4. Switch to `main` and delete local `demo/*` branches and branches left by the removed worktrees with `git branch -D`. Never delete `main`.
5. Search Google Drive for documents titled exactly `Hardship deferrals - product brief` and trash them, so the next `/stage-demo` starts with no comments. Trash nothing else.
6. Look for a personal `create-api` skill in `~/.cursor/skills/create-api` and in `~/Library/Application Support/Cursor/AgentStores/*/files/skills/create-api`. If one exists, ask, then remove it.
7. Report what was removed, then remind the presenter to do these by hand:
   - Close the demo chats.
   - Stop the API and UI servers.
   - Run `/stage-demo` before the next run.
