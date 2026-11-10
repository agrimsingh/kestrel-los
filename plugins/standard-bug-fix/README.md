# Standard bug fix

A local plugin for the MCP beat of the 201 track. Add it from **Customize > Plugins > Add > From Local Repository** and choose this directory.

It ships:

- The `/standard-bug-fix` skill: claim a GitHub issue, comment a hypothesis and debugging notes, fix it with a test, and open a PR that closes the issue.
- A rule with the write-back, branch, and PR conventions.
- The GitHub MCP server. Set the plugin's GitHub token when prompted.

Example:

```
/standard-bug-fix Nightly delinquency export logs full loan numbers
```
