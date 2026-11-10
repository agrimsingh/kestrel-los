import type { Loan } from "../fixtures/loans";
import { formatCents } from "../format";
import { delinquencyStatus } from "./status";

export function LoanSummary({ loan }: { loan: Loan }) {
  const status = delinquencyStatus(loan.daysDelinquent);

  return (
    <section className="summary" aria-label="Loan summary">
      <header className="summary__header">
        <div>
          <p className="eyebrow">Loan ending {loan.loanNumberLast4}</p>
          <h1 className="summary__borrower">{loan.borrower}</h1>
          <p className="summary__meta">
            {loan.product} · {loan.propertyCity}
          </p>
        </div>
        <span className={`badge badge--${status.tone}`}>{status.label}</span>
      </header>

      <dl className="stats">
        <div className="stats__item">
          <dt>Principal balance</dt>
          <dd>{formatCents(loan.principalBalanceCents)}</dd>
        </div>
        <div className="stats__item">
          <dt>Scheduled payment</dt>
          <dd>{formatCents(loan.scheduledPaymentCents)}</dd>
        </div>
        <div className="stats__item">
          <dt>Days past due</dt>
          <dd className={`stats__value--${status.tone}`}>{loan.daysDelinquent}</dd>
        </div>
      </dl>
    </section>
  );
}
