import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { LOANS } from "../fixtures/loans";
import { ApplyPaymentForm } from "./ApplyPaymentForm";

const LOAN = LOANS[0];

function stubApi(status: number) {
  const fetchMock = vi.fn(async (_request: Request) => new Response(null, { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderForm() {
  const onApplied = vi.fn();
  render(<ApplyPaymentForm loan={LOAN} onApplied={onApplied} />);
  return onApplied;
}

async function fillAndSubmit(amount: string, appliedBy: string) {
  const user = userEvent.setup();
  if (amount) {
    await user.type(screen.getByLabelText("Amount"), amount);
  }
  if (appliedBy) {
    await user.type(screen.getByLabelText("Applied by"), appliedBy);
  }
  await user.click(screen.getByRole("button", { name: "Apply payment" }));
}

test("posts the payment in cents to the loan and confirms it", async () => {
  const fetchMock = stubApi(202);
  const onApplied = renderForm();

  await fillAndSubmit("1250.00", "agent-42");

  expect(await screen.findByRole("status")).toHaveTextContent(
    "Payment of $1,250.00 accepted for loan ending 7890.",
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const request = fetchMock.mock.calls[0][0];
  expect(request.method).toBe("POST");
  expect(new URL(request.url).pathname).toBe(`/loans/${LOAN.loanId}/payments`);
  expect(await request.json()).toEqual({ amountCents: 125000, appliedBy: "agent-42" });
  expect(onApplied).toHaveBeenCalledWith({
    loanId: LOAN.loanId,
    amountCents: 125000,
    appliedBy: "agent-42",
  });
});

test("fills in the scheduled payment on request", async () => {
  const fetchMock = stubApi(202);
  renderForm();

  await userEvent.click(screen.getByRole("button", { name: /Use scheduled payment/ }));
  expect(screen.getByLabelText("Amount")).toHaveValue("2184.37");

  await fillAndSubmit("", "agent-42");

  await screen.findByRole("status");
  expect(await fetchMock.mock.calls[0][0].json()).toMatchObject({ amountCents: 218437 });
});

test("tells the servicer when the API rejects the payment", async () => {
  stubApi(400);
  const onApplied = renderForm();

  await fillAndSubmit("1250.00", "agent-42");

  expect(await screen.findByRole("alert")).toHaveTextContent("The payment was not accepted.");
  expect(onApplied).not.toHaveBeenCalled();
});

test("does not call the API for an amount that is not valid dollars", async () => {
  const fetchMock = stubApi(202);
  renderForm();

  await fillAndSubmit("12.345", "agent-42");

  expect(await screen.findByRole("alert")).toHaveTextContent("Enter an amount in dollars");
  expect(screen.getByLabelText("Amount")).toBeInvalid();
  expect(fetchMock).not.toHaveBeenCalled();
});

test("asks for both fields when the form is submitted empty", async () => {
  const fetchMock = stubApi(202);
  renderForm();

  await fillAndSubmit("", "");

  expect(await screen.findByText("Enter an amount in dollars, such as 1250.00.")).toBeVisible();
  expect(screen.getByText("Enter who is applying the payment.")).toBeVisible();
  expect(fetchMock).not.toHaveBeenCalled();
});
