import { type FormEvent, useState } from "react";
import { api } from "../api/client";
import type { Loan } from "../fixtures/loans";
import { formatCents } from "../format";

export type AppliedPayment = {
  loanId: string;
  amountCents: number;
  appliedBy: string;
};

type Props = {
  loan: Loan;
  onApplied?: (payment: AppliedPayment) => void;
};

type FieldErrors = { amount?: string; appliedBy?: string };
type Result = { kind: "accepted" | "failed"; message: string };

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Dollars as typed ("1250" or "1250.50") to whole cents, or null if not a positive amount. */
function toCents(amount: string): number | null {
  const trimmed = amount.trim();
  if (!AMOUNT_PATTERN.test(trimmed)) {
    return null;
  }
  const cents = Math.round(Number(trimmed) * 100);
  return cents > 0 ? cents : null;
}

export function ApplyPaymentForm({ loan, onApplied }: Props) {
  const [amount, setAmount] = useState("");
  const [appliedBy, setAppliedBy] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Start clean when the servicer moves to another loan, but keep who they are.
  const [shownLoanId, setShownLoanId] = useState(loan.loanId);
  if (shownLoanId !== loan.loanId) {
    setShownLoanId(loan.loanId);
    setAmount("");
    setErrors({});
    setResult(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountCents = toCents(amount);
    const servicer = appliedBy.trim();
    setErrors({
      amount: amountCents === null ? "Enter an amount in dollars, such as 1250.00." : undefined,
      appliedBy: servicer === "" ? "Enter who is applying the payment." : undefined,
    });
    setResult(null);
    if (amountCents === null || servicer === "") {
      return;
    }

    setSubmitting(true);
    try {
      const { response } = await api.POST("/loans/{loanId}/payments", {
        params: { path: { loanId: loan.loanId } },
        body: { amountCents, appliedBy: servicer },
      });
      if (!response.ok) {
        setResult({
          kind: "failed",
          message: "The payment was not accepted. Check the details and try again.",
        });
        return;
      }
      setResult({
        kind: "accepted",
        message: `Payment of ${formatCents(amountCents)} accepted for loan ending ${loan.loanNumberLast4}.`,
      });
      setAmount("");
      onApplied?.({ loanId: loan.loanId, amountCents, appliedBy: servicer });
    } catch {
      setResult({ kind: "failed", message: "Could not reach the servicing API." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={onSubmit} noValidate aria-labelledby="apply-payment-title">
      <header className="card__header">
        <h2 id="apply-payment-title">Apply a payment</h2>
        <p>To loan ending {loan.loanNumberLast4}</p>
      </header>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <div className="money">
          <span className="money__prefix" aria-hidden="true">
            $
          </span>
          <input
            id="amount"
            className="money__input"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            aria-invalid={errors.amount ? true : undefined}
            aria-describedby={errors.amount ? "amount-error" : undefined}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        {errors.amount && (
          <p id="amount-error" className="field__error" role="alert">
            {errors.amount}
          </p>
        )}
        <button
          type="button"
          className="chip"
          onClick={() => setAmount((loan.scheduledPaymentCents / 100).toFixed(2))}
        >
          Use scheduled payment · {formatCents(loan.scheduledPaymentCents)}
        </button>
      </div>

      <div className="field">
        <label htmlFor="appliedBy">Applied by</label>
        <input
          id="appliedBy"
          autoComplete="off"
          placeholder="Your servicer ID, such as agent-42"
          value={appliedBy}
          aria-invalid={errors.appliedBy ? true : undefined}
          aria-describedby={errors.appliedBy ? "appliedBy-error" : undefined}
          onChange={(event) => setAppliedBy(event.target.value)}
        />
        {errors.appliedBy && (
          <p id="appliedBy-error" className="field__error" role="alert">
            {errors.appliedBy}
          </p>
        )}
      </div>

      <button type="submit" className="button" disabled={submitting}>
        {submitting ? "Applying…" : "Apply payment"}
      </button>

      {result?.kind === "accepted" && (
        <p className="notice notice--ok" role="status">
          {result.message}
        </p>
      )}
      {result?.kind === "failed" && (
        <p className="notice notice--error" role="alert">
          {result.message}
        </p>
      )}
    </form>
  );
}
