# Hardship deferral requests - three parallel agents

Implements the first slice of the "Hardship deferrals" product brief. Where the brief and this plan disagree, this plan wins until product answers the open questions.

```
/multitask @hardship-deferral.md
```

Launch shape is `.cursor/skills/dispatch-subagents/SKILL.md`. The parent chat coordinates and does not implement.

## Goal

A servicer can request a hardship deferral on a loan from the servicing desk, and the API accepts it. The legacy module gets a handler that records a deferral with an audit entry. Connecting the API to that handler is a later change, as it is for payments.

## Open questions

- The brief allows 1 to 6 months, but `docs/servicing-policy.md` caps a deferral at 3. This plan follows the policy until product and Loan Operations agree.
- The brief asks for a borrower email. Nothing in the stack sends email, so it is left for later.
- The brief wants the loan summary to show an active deferral. There is no endpoint to read deferrals back yet, so it is left for later.

## Run order

1. In one turn, launch Agent 1, Agent 2 and Agent 3, each on its own worktree from `main`. Exactly three implementers. Each worker runs `npm install` in `servicing-ui/` if it needs it, because worktrees start without `node_modules`.
2. When all three finish, summarize each diff. The owned paths are disjoint, so a conflict means an agent edited a file it does not own: revert that hunk.
3. Apply in order: legacy, then API, then UI.
4. From the main checkout, run every module's tests plus `npm run typecheck` and `npm run check:api` in `servicing-ui/`. Report the results and stop; the user runs the review.

The UI type check fails in Agent 3's worktree until Agent 2's diff is applied, because the generated types come from Agent 2's spec change. That is expected. Agent 3's tests still pass, and the type check passes after step 3.

## Shared contract (do not fork)

**HTTP:** `POST /loans/{loanId}/deferrals`, `operationId: requestDeferral`, `loanId` is a UUID path parameter.

**Body** (`DeferralRequest`, all required):

| Field | Type | Rule |
|---|---|---|
| `requestedBy` | string | Servicer ID, not blank |
| `reasonCode` | string | One of `HARDSHIP_MEDICAL`, `HARDSHIP_JOB_LOSS`, `HARDSHIP_DISASTER` |
| `months` | integer | 1 to 3 |

**Responses:** `202` accepted, `400` when the body breaks any rule.

**Legacy payload:** `HardshipDeferralPayload(String loanId, String requestedBy, String reasonCode, int months)`. Audit event type `HARDSHIP_DEFERRAL_REQUESTED`. Persist with `KestrelRepository.save(loanId, "hardshipDeferral", reasonCode + ":" + months)`. The legacy module trusts `loanId`; the API validates it.

**Out of scope for all three:** the payments endpoint, the delinquency Lambda, the root `README.md`, and `.cursor/`.

Run Maven offline first: `mvn -q -o test`, and drop `-o` only if dependencies are missing.

---

### Agent 1 - legacy handler

| | |
|---|---|
| **Owns** | `legacy-core/**` only |
| **Contract** | `HardshipDeferralHandler` and `HardshipDeferralPayload` in `com.kestrel.servicing`, following `.cursor/skills/add-kestrel-handler/SKILL.md`. Check every body rule from the contract before the audit call; a broken rule throws `IllegalArgumentException`, and nothing is audited or saved. |
| **Verify** | Maven tests in `legacy-core/`. A valid request is audited and saved, and a 4-month request, an unknown reason code and a blank servicer ID each throw with nothing saved. |

### Agent 2 - API contract and endpoint

| | |
|---|---|
| **Owns** | `contracts/openapi.yaml`, `servicing-api/**` (including its README), and `servicing-ui/src/api/schema.d.ts` (regenerated, never hand-edited) |
| **Contract** | Change the spec first: add the operation with `202` and `400` responses and the `DeferralRequest` schema, with every rule expressed in it (`enum`, `minimum: 1`, `maximum: 3`, `minLength: 1`). Then add a controller, service and request record under `com.kestrel.api.deferrals`, mirroring the payments package. Keep `reasonCode` a `String` validated with `@Pattern`, to match the legacy payload. Add `DeferralsContractTest` next to `PaymentsContractTest` and `DeferralControllerTest` next to `PaymentControllerTest`. Regenerate the UI types with `npm run generate:api` in `servicing-ui/`. |
| **Verify** | Maven tests in `servicing-api/`: a valid body returns 202, and `months: 4`, an unknown `reasonCode` and a blank `requestedBy` each return 400. `npm run check:api` passes in `servicing-ui/`. |

### Agent 3 - servicer UI form

| | |
|---|---|
| **Owns** | `servicing-ui/src/deferrals/**`, `servicing-ui/src/App.tsx`, and one change to `servicing-ui/src/index.css`: add `.field select` alongside the existing `.field input` selectors |
| **Contract** | `RequestDeferralForm`, rendered as a third card in `.panels`, consistent with `ApplyPaymentForm`: same `card`, `field`, `button` and `notice` classes. Labels are "Requested by", "Reason" and "Months", with ids that do not clash with the payment form's. Reason is a `<select>` of the three codes, written as a list in the form. Months is a text input that accepts only 1, 2 or 3, checked before any API call. Call `api.POST("/loans/{loanId}/deferrals", ...)` through the existing client and do not edit `src/api/`. Deferrals do not appear in the activity list. |
| **Verify** | `npm test` in `servicing-ui/`, with tests that a valid request posts the contract body, a blank servicer ID shows an error without calling the API, and `months: 4` is blocked. |
