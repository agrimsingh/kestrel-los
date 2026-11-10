import type { Loan } from "../fixtures/loans";
import { delinquencyStatus } from "./status";

type Props = {
  loans: Loan[];
  selectedLoanId: string;
  onSelect: (loanId: string) => void;
};

export function LoanQueue({ loans, selectedLoanId, onSelect }: Props) {
  return (
    <nav className="queue" aria-label="Loan queue">
      <div className="queue__heading">
        <span>Loan queue</span>
        <span className="queue__count">{loans.length}</span>
      </div>
      <ul className="queue__list">
        {loans.map((loan) => {
          const status = delinquencyStatus(loan.daysDelinquent);
          const selected = loan.loanId === selectedLoanId;
          return (
            <li key={loan.loanId}>
              <button
                type="button"
                className="queue__item"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(loan.loanId)}
              >
                <span className="queue__borrower">{loan.borrower}</span>
                <span className="queue__meta">
                  <span>Ending {loan.loanNumberLast4}</span>
                  <span className={`queue__status queue__status--${status.tone}`}>
                    {status.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
