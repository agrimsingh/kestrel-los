# Hardship deferrals

*Product brief · Servicing Product, Kestrel Home Loans · Draft for engineering review*

## Why

Borrowers who hit a hardship call our servicing team asking to pause payments. Today servicers log these requests in a shared inbox and Loan Operations keys them in by hand a few days later. Requests get lost, and there is no audit trail of who approved what. Examiners flagged this in the last review.

## Who uses it

- **Servicers** on the servicing desk, while the borrower is on the phone.
- **Loan Operations**, who act on the request.
- **Compliance**, who need every request on the audit trail.

## What we need

1. A servicer can request a hardship deferral from the servicing desk, on the loan they have open.
2. The request records who asked for it: the servicer's ID.
3. The servicer picks a reason: **medical hardship**, **job loss** or **natural disaster**.
4. The servicer picks how long to defer: **1 to 6 months**.
5. Every request is written to the audit trail before anything else happens.
6. The borrower gets an **email confirming the request** within one business day.
7. Once requested, the loan summary on the desk shows that a deferral is active.

## Out of scope

- Approving or declining the request. Loan Operations does that in their own system.
- Changing the payment schedule or interest. That follows once a request is approved.
- Borrower self-service. Requests come through a servicer for now.

## Success

- No hardship requests handled through the shared inbox after launch.
- Every request is on the audit trail with the servicer's ID and the reason.
