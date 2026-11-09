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
| `servicing-api/` | Spring Boot service that implements the contract. | Not scaffolded yet |
| `servicing-ui/` | React UI that consumes the contract. | Not scaffolded yet |
| `lambdas/export_delinquency_report/` | Python Lambda that exports a delinquency CSV for reporting. | Handler and a test |
| `docs/` | `architecture.md` and `compliance-logging.md`. | |
| `.cursor/` | Project rule, skill and Bugbot guidance. | |

## Prerequisites

- Cursor
- JDK 17 and Maven 3.9 or later (`brew install maven` on macOS)
- Python 3.9 or later, with pytest (`python3 -m pip install pytest`)

There is no database. Everything runs on in-memory fixtures.

## Run the tests

```bash
cd legacy-core && mvn -q test
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

Open the rule file first. It is six bullets long, which is about the right size.

## Things to try

Start a new chat for each one.

1. **Add a handler with the skill.**

   ```
   /add-kestrel-handler Add a hardship deferral request handler.
   Payload: loanId, requestedBy, reasonCode, deferralMonths (max 3).
   ```

   In the diff, look for the base class, the registry entry, the audit call before the save,
   and a unit test.

2. **Correct it once, then make it a rule.** Tell the agent a convention it could not have
   known, and ask it to save that convention to the legacy rule file. For example:

   ```
   Deferral reason codes are validated against a fixed list before anything is saved.
   Fix the handler, then add this to .cursor/rules/kestrel-legacy.mdc.
   ```

3. **Go spec first.** In Plan mode:

   ```
   Add POST /loans/{loanId}/deferrals to @contracts/openapi.yaml, matching the payload of
   the deferral handler. Show me the spec diff before writing any code.
   ```

4. **Cover the Lambda.**

   ```
   Add pytest cases for @lambdas/export_delinquency_report/handler.py:
   one CSV row per input row, and an empty input still writes the header.
   ```

5. **Write the review notes.**

   ```
   Write a pull request description for this branch: what changed and why,
   compliance notes, test evidence, and a rollback plan.
   ```

## Using this on your own codebase

- **Keep rules short.** State what must be true. Leave out anything the agent can read in the code.
- **Scope rules with globs** so framework conventions only load when that code is being changed.
- **Point at one reference file** rather than pasting code into a rule. Say which pattern is current if the codebase has an older one.
- **Turn it into a skill** once you have explained the same multi-step job twice.
- **Commit `.cursor/`** so the whole team gets the same behaviour.
