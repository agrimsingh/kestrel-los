export type Tone = "ok" | "warn" | "danger";

/** How a loan's delinquency reads on screen. 30 days or more past due is serious. */
export function delinquencyStatus(daysDelinquent: number): { tone: Tone; label: string } {
  if (daysDelinquent === 0) {
    return { tone: "ok", label: "Current" };
  }
  return {
    tone: daysDelinquent >= 30 ? "danger" : "warn",
    label: `${daysDelinquent} days past due`,
  };
}
