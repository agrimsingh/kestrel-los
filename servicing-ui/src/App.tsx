import { useState } from "react";
import { LOANS } from "./fixtures/loans";
import { LoanQueue } from "./loans/LoanQueue";
import { LoanSummary } from "./loans/LoanSummary";
import { type AppliedPayment, ApplyPaymentForm } from "./payments/ApplyPaymentForm";
import { type ActivityEntry, PaymentActivity } from "./payments/PaymentActivity";

export function App() {
  const [selectedLoanId, setSelectedLoanId] = useState(LOANS[0].loanId);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  const loan = LOANS.find((candidate) => candidate.loanId === selectedLoanId) ?? LOANS[0];

  function recordPayment(payment: AppliedPayment) {
    setActivity((entries) => [{ ...payment, id: entries.length + 1, at: new Date() }, ...entries]);
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" />
            <path d="M6 11.5c4.6.2 7.9 2 10 5.6 2.1-3.6 5.4-5.4 10-5.6-1.3 5.8-4.6 9.6-10 11.5-5.4-1.9-8.7-5.7-10-11.5Z" />
          </svg>
          <div>
            <p className="brand__name">Kestrel</p>
            <p className="brand__sub">Servicing desk</p>
          </div>
        </div>

        <LoanQueue loans={LOANS} selectedLoanId={loan.loanId} onSelect={setSelectedLoanId} />

        <p className="sidebar__note">Sample data, held in memory.</p>
      </aside>

      <main className="main">
        <LoanSummary loan={loan} />
        <div className="panels">
          <ApplyPaymentForm loan={loan} onApplied={recordPayment} />
          <PaymentActivity entries={activity.filter((entry) => entry.loanId === loan.loanId)} />
        </div>
      </main>
    </div>
  );
}
