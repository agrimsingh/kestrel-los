/**
 * In-memory loans for the sample. Only the last four digits of the loan number are
 * held here: full loan numbers never reach the UI (see docs/compliance-logging.md).
 */
export type Loan = {
  loanId: string;
  loanNumberLast4: string;
  borrower: string;
  product: string;
  propertyCity: string;
  principalBalanceCents: number;
  scheduledPaymentCents: number;
  daysDelinquent: number;
};

export const LOANS: Loan[] = [
  {
    loanId: "3f2b8c1e-6d4a-4b7e-9c1a-2e5f8a7b6c4d",
    loanNumberLast4: "7890",
    borrower: "Marisol Ortega",
    product: "30-year fixed",
    propertyCity: "Columbus, OH",
    principalBalanceCents: 28_641_275,
    scheduledPaymentCents: 218_437,
    daysDelinquent: 45,
  },
  {
    loanId: "a8d5e2f1-0b3c-4d6e-8f9a-1c2b3d4e5f60",
    loanNumberLast4: "3210",
    borrower: "Daniel Whitaker",
    product: "15-year fixed",
    propertyCity: "Tucson, AZ",
    principalBalanceCents: 14_230_918,
    scheduledPaymentCents: 164_290,
    daysDelinquent: 12,
  },
  {
    loanId: "5c9e1b7a-2f4d-4a83-b6c0-7d1e9f3a2b58",
    loanNumberLast4: "4471",
    borrower: "Priya Raman",
    product: "30-year fixed",
    propertyCity: "Raleigh, NC",
    principalBalanceCents: 41_205_560,
    scheduledPaymentCents: 297_815,
    daysDelinquent: 0,
  },
];
