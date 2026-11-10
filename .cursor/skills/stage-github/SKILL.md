---
name: stage-github
description: Create or reconcile the demo issues on this repo's GitHub Issues from presenter/github-issues.md. Run before the MCP beat.
---

# Stage GitHub issues

Staging uses the `gh` CLI so it works before the GitHub MCP is connected. The MCP is what the audience sees later.

1. Confirm the repo with `gh repo view --json nameWithOwner,url`. Stage only onto this repo.
2. Create the `compliance` label if it is missing: `gh label create compliance --color B60205 --description "Regulatory or audit impact"`.
3. For each issue in `presenter/github-issues.md`, look it up by exact title with `gh issue list --state all --search 'in:title "<title>"' --json number,title,state`.
   - Open match: leave it.
   - Closed match: reopen it and reset its body and labels from the catalog.
   - No match: create it with the catalog body and labels.
4. Report each issue's number, title, and URL.

Never create an issue that is not in the catalog, and never open a second issue with a catalog title.
