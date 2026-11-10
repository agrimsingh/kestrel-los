---
name: standard-bug-fix
description: Pull one bug from this repo's GitHub Issues by title or number, fix only that bug, and write the hypothesis, debugging notes, and fix PR back to the issue. Use when the user runs /standard-bug-fix or asks for a standard bug fix on a GitHub issue.
---

# Standard bug fix

Work one GitHub issue on this repository and keep the issue current as you go.

## Prerequisites

This plugin ships the GitHub MCP server. If its tools are unavailable, ask the user to set the plugin's GitHub token, then continue. If the MCP still cannot connect, use the `gh` CLI for the same steps and say so. If the repo has no open issues, tell the user to run `/stage-github`.

## Sequence

1. **Find the issue.** Read the owner and repo from `git remote get-url origin`. List open issues with the GitHub MCP and match the user's title or number. Work only that issue.
2. **Claim it.** Assign the issue to the authenticated user.
3. **Hypothesis comment.** Before editing code, comment with the template. Fill the title line and The Core Problem. Leave the other sections as `TBD`.
4. **Reproduce.** Write a failing test that shows the bug before you fix it.
5. **Debugging comment.** Comment again with the template. Keep The Core Problem and fill Quick Takeaways from what you actually found.
6. **Fix.** Make the smallest change that resolves the issue, on branch `demo/bug-<issue-number>-<short-slug>`. Run the tests for the module you changed.
7. **Pull request.** Push the branch and open a PR whose body says `Fixes #<issue-number>`, with the test evidence. Do not merge it.
8. **Fix PR comment.** Comment with the full template. Tick the Fixes item and put the PR link in it.

## Template

```markdown
# Bug Fix Summary: [Module affected] - [Short description]

## 1. The Core Problem (Why it happened)
* **Immediate Trigger:** [What made the bug visible.]
* **Underlying Flaw:** [Why the code allowed it.]

## 2. Quick Takeaways
* **Good:** [What helped find or fix it.]
* **Bad:** [What slowed it down or let it ship.]

## 3. Compliance impact
* [Audit, logging, or customer-data impact, or "None".]

## 4. Fixes
- [ ] **Action:** [What shipped] | **Owner:** @[assignee] | **PR:** [link]
```

## Scope

- Edit only the module the issue is about. Leave `legacy-core`, the API contract, and the UI alone unless the issue names them.
- Follow `docs/compliance-logging.md` for anything that logs.
- Keep comments short. No real customer data.
