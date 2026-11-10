---
name: standard-bug-fix
description: Pull one bug from this repo's GitHub Issues by title or number, fix only that bug, and write the hypothesis, debugging notes, and fix PR back to the issue. Use when the user runs /standard-bug-fix or asks for a standard bug fix on a GitHub issue.
---

# Standard bug fix

Work one GitHub issue on this repository and keep the issue current as you go. Follow this plugin's `standard-bug-fix` rule.

## GitHub access

Use the GitHub MCP server this plugin ships. If its tools are unavailable, say so once and continue with the `gh` CLI for the same steps. Do not stop to wait for a token. Pushing a branch always uses local `git`.

If the repo has no open issues, tell the user to run `/stage-github`.

## Sequence

1. **Find the issue.** Read the owner and repo from `git remote get-url origin`. List open issues and match the user's number, or the closest title. If more than one issue could match, ask.
2. **Claim it.** Look up your GitHub login. If someone else is assigned, stop and ask. Otherwise add yourself and keep any existing assignees.
3. **Branch.** Create `demo/bug-<issue-number>-<slug>` before editing anything. The slug is two to five lowercase words from the title, joined with hyphens.
4. **Hypothesis comment.** Comment with the template, filling the title line, The Core Problem marked as a hypothesis, and the Owner. Leave the other sections as `TBD`.
5. **Reproduce.** Write a test that shows the bug, run it, and confirm it fails.
6. **Debugging comment.** Comment again. Update The Core Problem with what you confirmed and fill Quick Takeaways.
7. **Fix.** Make the smallest change that resolves the issue and run the module's tests until they pass.
8. **Pull request.** Commit with a message ending `Fixes #<issue-number>`, push with `git push -u origin <branch>`, and open a PR against `main` whose body says `Fixes #<issue-number>` and gives the before and after test summary. Assign it to yourself. Do not merge it.
9. **Fix PR comment.** Comment with every section filled, the Fixes item ticked, and the PR link.

## Test commands

| Module | Command |
|---|---|
| `lambdas/<name>/` | `cd lambdas/<name> && python3 -m pytest -q` |
| `legacy-core/`, `servicing-api/` | `mvn -q test` in that directory |
| `servicing-ui/` | `npm test` in that directory |

Quote only the pass and fail summary line in comments and PRs. Assertion output can contain loan numbers, so never paste it. Treat fixture identifiers as real.

## Template

```markdown
### Bug Fix Summary: [Module affected] - [Short description]

#### 1. The Core Problem (Why it happened)
* **Immediate Trigger:** [What made the bug visible.]
* **Underlying Flaw:** [Why the code allowed it.]

#### 2. Quick Takeaways
* **Good:** [What helped find or fix it.]
* **Bad:** [What slowed it down or let it ship.]

#### 3. Compliance impact
* [Audit, logging, or customer-data impact, including data already exposed, or "None".]

#### 4. Fixes
- [ ] **Action:** [What shipped] | **Owner:** @[assignee] | **PR:** [link]
```

## Scope

- Edit only the module the issue is about. Leave `legacy-core`, the API contract, and the UI alone unless the issue names them.
- Follow `docs/compliance-logging.md` for anything that logs.
- Keep comments short.
