# Kestrel LOS

A small sample codebase for practising Cursor on a stack shaped like a mortgage lender's:
a legacy Java module on an in-house framework, an OpenAPI contract, a newer Spring and React
service, and Python Lambdas. Kestrel Home Loans is fictional, and so is its framework.

The in-house framework is the point. No model has seen it, so without help an agent writes
Spring-style code that does not fit. The `.cursor/` folder shows how a short rule, one
reference handler and a skill fix that.

## What's here

| Path | What it is | State |
|------|------------|-------|
| `legacy-core/` | Java 17 and Maven. The Kestrel framework plus loan servicing handlers. | One reference handler and a unit test |
| `contracts/openapi.yaml` | OpenAPI 3.1 contract between the API and the UI. | One endpoint: `POST /loans/{loanId}/payments` |
| `servicing-api/` | Spring Boot service that implements the contract. | The one endpoint, a controller test and a contract test |
| `servicing-ui/` | React UI that consumes the contract through a generated client. | A servicing desk: loan queue, apply-payment form and tests |
| `lambdas/export_delinquency_report/` | Python Lambda that exports a delinquency CSV for reporting. | Handler and a test |
| `docs/` | `architecture.md` and `compliance-logging.md`. | |
| `.cursor/` | Project rule, skill and Bugbot guidance. | |

## Prerequisites

- Cursor
- JDK 17 and Maven 3.9 or later (`brew install maven` on macOS)
- Python 3.9 or later, with pytest (`python3 -m pip install pytest`)
- Node.js 22.22 or later, then `cd servicing-ui && npm install`

There is no database. Everything runs on in-memory fixtures.

## Run the tests

```bash
cd legacy-core && mvn -q test
```

```bash
cd servicing-api && mvn -q test
```

```bash
cd servicing-ui && npm test
```

```bash
cd lambdas/export_delinquency_report && python3 -m pytest -q
```

## The Kestrel framework in one minute

Handlers in `legacy-core` are not Spring beans. Every handler:

1. Extends `KestrelHandler<T>`, where `T` is the payload type.
2. Implements `handle(KestrelContext ctx, T payload)`.
3. Is registered by class name in `legacy-core/src/main/resources/META-INF/kestrel-handlers.xml`.
4. Calls `AuditGateway.record(...)` before any customer-impacting write.
5. Persists through `KestrelRepository`. There is no JPA in this module.

[`PaymentAppliedHandler`](legacy-core/src/main/java/com/kestrel/servicing/PaymentAppliedHandler.java)
is the reference handler. [docs/architecture.md](docs/architecture.md) has the wider picture.

## How Cursor is set up in this repo

| File | What it does |
|------|--------------|
| [`.cursor/rules/kestrel-legacy.mdc`](.cursor/rules/kestrel-legacy.mdc) | Project rule with the framework conventions. It is scoped to `legacy-core/**`, so it only applies when that code is in play. |
| [`.cursor/skills/add-kestrel-handler/SKILL.md`](.cursor/skills/add-kestrel-handler/SKILL.md) | Project skill for the repeatable job of adding a handler. Run it with `/add-kestrel-handler`. |
| [`.cursor/BUGBOT.md`](.cursor/BUGBOT.md) | Review guidance for Bugbot on pull requests. Bugbot reads it from the pull request's base branch. |
| [`.cursor/skills/stage-github/SKILL.md`](.cursor/skills/stage-github/SKILL.md) | Presenter skill. Creates the demo issues in [`presenter/github-issues.md`](presenter/github-issues.md) on this repo's GitHub Issues. |
| [`.cursor/skills/reset-demo-state/SKILL.md`](.cursor/skills/reset-demo-state/SKILL.md) | Presenter skill. Closes demo PRs, deletes demo branches and issues, and lists the manual cleanup. |
| [`plugins/standard-bug-fix/`](plugins/standard-bug-fix/README.md) | Local plugin for the MCP beat: a bug-fix skill, a rule and the GitHub MCP server. Add it from Customize > Plugins. |
| [`.cursor/plans/hardship-deferral.md`](.cursor/plans/hardship-deferral.md) | Plan for the parallel beat. Splits hardship deferrals across three agents. Run it with `/multitask @hardship-deferral.md`. |
| [`.cursor/skills/dispatch-subagents/SKILL.md`](.cursor/skills/dispatch-subagents/SKILL.md) | How the coordinator launches parallel agents and merges their work. |
| [`.cursor/agents/kestrel-reviewer.md`](.cursor/agents/kestrel-reviewer.md) | Read-only reviewer subagent that runs the tests and checks the repo's rules. |

Open the rule file first. It is six bullets long, which is about the right size.

## Things to try

Start a new chat for each one. The prompts are examples of intent, not scripts. Say them in
your own words, typed or by voice. You should not need to name files or tag them: the rule
and the reference handler carry the detail.

1. **Add a handler with the skill.**

   ```
   /add-kestrel-handler We need to handle hardship deferral requests. A servicer asks to
   defer payments on a loan, so we need the loan, who requested it, a reason code, and how
   many months to defer, three at most.
   ```

   In the diff, look for the base class, the registry entry, the audit call before the save,
   and a unit test. You asked for none of them.

2. **Correct it once, then make it a rule.** Tell the agent a convention it could not have
   known, and ask it to save that convention for next time. For example:

   ```
   One thing you couldn't have known: deferral reason codes are checked against a fixed
   list before anything is saved. Fix the handler, then save that to our rules for the
   legacy module so nobody has to say it again.
   ```

3. **Go spec first.** In Plan mode:

   ```
   Let's expose hardship deferrals through the servicing API, with the same fields the
   deferral handler takes. Start with the API contract and show me that change before
   writing any code.
   ```

4. **Carry it through to the UI.** Once the API serves the new endpoint:

   ```
   Now carry that through to the servicer UI. Add a deferral request form next to the
   payment form, and keep it consistent with what's already there.
   ```

   Look for the client being regenerated from the spec rather than written by hand.

5. **Cover the Lambda.**

   ```
   The nightly delinquency export is barely tested. Add tests for it: every loan we pass in
   should come out as one row, and an export with no loans should still write the header.
   ```

6. **Write the review notes.**

   ```
   Write up a pull request description for this branch: what changed and why, anything
   compliance should know, the test evidence, and how we'd roll it back.
   ```

## Using this on your own codebase

- **Keep rules short.** State what must be true. Leave out anything the agent can read in the code.
- **Scope rules with globs** so framework conventions only load when that code is being changed.
- **Point at one reference file** rather than pasting code into a rule. Say which pattern is current if the codebase has an older one.
- **Turn it into a skill** once you have explained the same multi-step job twice.
- **Commit `.cursor/`** so the whole team gets the same behaviour.
