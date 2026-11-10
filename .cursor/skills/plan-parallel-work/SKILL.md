---
name: plan-parallel-work
description: Turn a product brief or feature request into a plan in .cursor/plans that /multitask can run across three parallel agents. Use when asked to plan a feature for several agents, split work across agents, or turn a brief into a plan.
---

# Plan parallel work

Write a plan that three agents can build at the same time without merge conflicts. [example.md](example.md) is a plan that built and merged cleanly. Keep its structure and level of detail.

1. Read the brief. If the user names a document rather than a file, find it in Google Drive. Then read `docs/servicing-policy.md` and the code the brief touches: `contracts/openapi.yaml`, `PaymentAppliedHandler`, the `com.kestrel.api.payments` package and `servicing-ui/src/payments/`.
2. Decide the scope. Build what the brief asks that the stack supports today. Where the brief conflicts with existing code or rules, or leaves a question open, take the narrower option and list it under **Open questions**. Leave anything with no home in the stack yet, such as email or new read endpoints, for later, and list it too.
3. Write the shared contract once: HTTP path and `operationId`, body fields with types and rules, responses, the legacy payload, audit event type and save key. Every agent builds to it, and no agent changes it.
4. Split by layer:
   - Agent 1 owns `legacy-core/**`.
   - Agent 2 owns `contracts/openapi.yaml`, `servicing-api/**` and the regenerated `servicing-ui/src/api/schema.d.ts`.
   - Agent 3 owns a new `servicing-ui/src/<feature>/` folder, `servicing-ui/src/App.tsx` and any single named CSS change.

   Give each agent an **Owns** list, a **Contract** and a **Verify** step naming the tests that prove each rule. Owned paths never overlap.
5. Copy the run order and worker notes from the example: workers run `npm install` in their worktrees, Maven runs offline first, and the UI type check fails until Agent 2's diff is applied.
6. Save it as `.cursor/plans/<feature>.md`, where `<feature>` is the feature in lowercase singular words joined by hyphens, such as `hardship-deferral.md`. Put the `/multitask @<file> Run each agent in its own worktree.` line at the top.
7. Summarize the scope decisions and open questions for the user. Do not start building.
