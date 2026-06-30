/**
 * Taux TVA officiels France metropolitaine (2026).
 * Source unique : ne JAMAIS hardcoder ces valeurs ailleurs dans le code.
 */

export type TvaType = "standard" | "reduit" | "super-reduit";

export const TVA_RATES: Record<TvaType, number> = {
  standard: 0.20, // 20 % — biens et services courants
  reduit: 0.10, // 10 % — restauration, transports, travaux
  "super-reduit": 0.055, // 5,5 % — alimentation, livres, gaz/electricite
};

/** Plafond de remise applicable, exprime en fraction du montant HT. */
export const MAX_DISCOUNT_RATIO = 0.5;
