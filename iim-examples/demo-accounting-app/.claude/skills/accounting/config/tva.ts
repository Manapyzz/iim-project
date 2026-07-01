/**
 * Taux de TVA français applicables (2026).
 *
 * SSOT (Single Source of Truth) — toute nouvelle utilisation doit lire ici,
 * jamais hardcoder une valeur dans un script.
 */
export const TVA_RATES = {
  standard: 0.20, // biens/services courants
  reduit: 0.10, // restauration, transport, hôtellerie
  'super-reduit': 0.055, // livres, alimentation de base, culture
} as const;

export type TvaType = keyof typeof TVA_RATES;

export function isTvaType(x: string): x is TvaType {
  return x in TVA_RATES;
}
