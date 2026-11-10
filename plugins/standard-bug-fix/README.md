# Standard bug fix

A local plugin for the MCP beat of the 201 track. Add it from **Customize > Plugins > Add > From Local Repository** and choose this directory.

It ships:

- The `/standard-bug-fix` skill: claim a GitHub issue, comment a hypothesis and debugging notes, fix it with a test, and open a PR that closes the issue.
- A rule with the write-back, branch, and PR conventions.
- GitHub's MCP server, run locally with your `gh` login, so it needs no token or Marketplace plugin. Install it first:

  ```bash
  brew install github-mcp-server gh && gh auth login
  ```

Example:

```
/standard-bug-fix Nightly delinquency export logs full loan numbers
```
