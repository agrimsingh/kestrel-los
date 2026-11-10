# Hardship deferral requests - three parallel agents

Tracks GitHub issue "Servicers can request a hardship deferral".

```
/multitask @hardship-deferral.md
```

Launch shape is `.cursor/skills/dispatch-subagents/SKILL.md`. The parent chat coordinates and does not implement.

## Goal

A servicer can request a hardship deferral on a loan from the servicing desk. The API accepts it, and the legacy module records it with an audit entry.

## Run order

1. In one turn, launch Agent 1, Agent 2 and Agent 3 on isolated worktrees. Exactly three implementers.
2. When all three finish, summarize each diff. The owned paths are disjoint, so a conflict means an agent edited a file it does not own: revert that hunk.
3. Apply in order: legacy, then API, then UI.
4. Run every suite from the repo root checkout, then launch `kestrel-reviewer` on the combined diff.

The UI type check fails in Agent 3's worktree until Agent 2's diff is applied, because the generated types come from Agent 2's spec change. That is expected. Agent 3's tests still pass.

## Shared contract (do not fork)

**HTTP:** `POST /loans/{loanId}/deferrals`, `operationId: requestDeferral`, `loanId` is a UUID path parameter.

**Body** (`DeferralRequest`, all required):

| Field | Type | Rule |
|---|---|---|
| `requestedBy` | string | Servicer ID, not blank |
| `reasonCode` | string enum | `HARDSHIP_MEDICAL`, `HARDSHIP_JOB_LOSS`, `HARDSHIP_DISASTER` |
| `months` | integer | 1 to 3 |

**Responses:** `202` accepted, `400` when the body breaks a rule.

**Legacy payload:** `HardshipDeferralPayload(String loanId, String requestedBy, String reasonCode, int months)`. Audit event type `HARDSHIP_DEFERRAL_REQUESTED`.

**Out of scope for all three:** the payments endpoint, the delinquency Lambda, the README, and `.cursor/`.

---

### Agent 1 - legacy handler

| | |
|---|---|
| **Owns** | `legacy-core/**` only |
| **Contract** | `HardshipDeferralHandler` and `HardshipDeferralPayload` in `com.kestrel.servicing`, built the way `/add-kestrel-handler` describes. Reject months outside 1 to 3 and unknown reason codes before the audit call. |
| **Verify** | `mvn -q test` in `legacy-core/`. The test shows the audit call comes before the save, and a 4-month request is rejected with nothing saved. |

### Agent 2 - API contract and endpoint

| | |
|---|---|
| **Owns** | `contracts/openapi.yaml`, `servicing-api/**`, and `servicing-ui/src/api/schema.d.ts` (regenerated, never hand-edited) |
| **Contract** | Add the operation and `DeferralRequest` schema to the spec first. Then add a controller, service and request type under `com.kestrel.api.deferrals`, mirroring the payments package, with bean validation for the rules. Add `DeferralsContractTest` next to `PaymentsContractTest`. Regenerate the UI types with `npm run generate:api` in `servicing-ui/` (run `npm install` first if `node_modules` is missing). |
| **Verify** | `mvn -q test` in `servicing-api/`. A valid body returns 202, `months: 4` returns 400. `npm run check:api` passes in `servicing-ui/`. |

### Agent 3 - servicer UI form

| | |
|---|---|
| **Owns** | `servicing-ui/src/deferrals/**` and `servicing-ui/src/App.tsx` |
| **Contract** | `RequestDeferralForm` next to the payment form, consistent with `ApplyPaymentForm`: same `card`, `field`, `button` and `notice` classes, no new CSS. Reason code is a select, months is 1 to 3. Call `api.POST("/loans/{loanId}/deferrals", ...)` through the existing client. Do not edit `src/api/`. |
| **Verify** | `npm test` in `servicing-ui/` (run `npm install` first if `node_modules` is missing), with a test that a valid request posts the contract body and a missing servicer ID shows an error. |
