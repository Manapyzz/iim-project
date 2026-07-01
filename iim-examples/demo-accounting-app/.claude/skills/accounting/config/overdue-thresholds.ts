/**
 * Seuils pour la détection d'impayés.
 *
 * Une facture est en retard si :
 *   - paid_at est null
 *   - ET (today - due_at) > gracePeriodDays
 *
 * gracePeriodDays varie selon le montant TTC — plus le montant est gros,
 * plus on est tolérant sur le retard (pratique business commune).
 */
export const OVERDUE_TIERS = [
  {maxTtc: 100, gracePeriodDays: 3},
  {maxTtc: 500, gracePeriodDays: 7},
  {maxTtc: Infinity, gracePeriodDays: 15},
] as const;

export function gracePeriodFor(amountTtc: number): number {
  const tier = OVERDUE_TIERS.find((t) => amountTtc <= t.maxTtc);
  // OVERDUE_TIERS se termine par maxTtc: Infinity, donc tier est jamais null.
  return tier!.gracePeriodDays;
}
