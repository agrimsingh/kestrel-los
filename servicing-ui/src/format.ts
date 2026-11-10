const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Whole cents as US dollars, such as 125000 to "$1,250.00". */
export function formatCents(cents: number): string {
  return dollars.format(cents / 100);
}
