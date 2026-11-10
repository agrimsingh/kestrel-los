import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { App } from "./App";
import { LOANS } from "./fixtures/loans";

test("applies a payment to the loan picked from the queue and lists it under that loan", async () => {
  const fetchMock = vi.fn(async (_request: Request) => new Response(null, { status: 202 }));
  vi.stubGlobal("fetch", fetchMock);
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /Daniel Whitaker/ }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Daniel Whitaker");

  await user.type(screen.getByLabelText("Amount"), "500");
  await user.type(screen.getByLabelText("Applied by"), "agent-42");
  await user.click(screen.getByRole("button", { name: "Apply payment" }));

  const activity = within(screen.getByRole("region", { name: "Activity" }));
  expect(await activity.findByText("$500.00")).toBeVisible();
  expect(activity.getByText("Payment applied by agent-42")).toBeVisible();
  expect(new URL(fetchMock.mock.calls[0][0].url).pathname).toBe(
    `/loans/${LOANS[1].loanId}/payments`,
  );

  // Another loan starts with a clean form and its own activity, but keeps the servicer.
  await user.click(screen.getByRole("button", { name: /Marisol Ortega/ }));
  expect(activity.getByText("Nothing applied to this loan yet.")).toBeVisible();
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Applied by")).toHaveValue("agent-42");
});
