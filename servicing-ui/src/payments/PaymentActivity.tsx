import { formatCents } from "../format";
import type { AppliedPayment } from "./ApplyPaymentForm";

export type ActivityEntry = AppliedPayment & { id: number; at: Date };

const clock = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

/** Payments applied since the page loaded. The API has no way to read payments back yet. */
export function PaymentActivity({ entries }: { entries: ActivityEntry[] }) {
  return (
    <section className="card" aria-labelledby="activity-title">
      <header className="card__header">
        <h2 id="activity-title">Activity</h2>
        <p>Payments applied this session</p>
      </header>

      {entries.length === 0 ? (
        <p className="empty">Nothing applied to this loan yet.</p>
      ) : (
        <ul className="activity">
          {entries.map((entry) => (
            <li key={entry.id} className="activity__item">
              <span className="activity__mark" aria-hidden="true" />
              <div className="activity__body">
                <span className="activity__amount">{formatCents(entry.amountCents)}</span>
                <span className="activity__meta">Payment applied by {entry.appliedBy}</span>
              </div>
              <time className="activity__time" dateTime={entry.at.toISOString()}>
                {clock.format(entry.at)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
