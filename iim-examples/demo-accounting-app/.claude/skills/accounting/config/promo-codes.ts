/**
 * Codes promo actifs et leur règle.
 *
 * Toute nouvelle règle promo est ajoutée ici, jamais dans le calcul.
 * La remise s'applique TOUJOURS sur le HT AVANT calcul de la TVA
 * (règle fiscale française).
 */
export type PromoRule = {
  code: string;
  discountRate: number; // 0..1
  minAmountHt?: number; // seuil minimum HT pour appliquer
  description: string;
};

export const PROMO_CODES: Record<string, PromoRule> = {
  WELCOME10: {
    code: 'WELCOME10',
    discountRate: 0.10,
    description: '-10 % pour nouveau client',
  },
  STUDENT20: {
    code: 'STUDENT20',
    discountRate: 0.20,
    description: '-20 % étudiants (asso IIMPACT)',
  },
  BLACKFRIDAY: {
    code: 'BLACKFRIDAY',
    discountRate: 0.30,
    minAmountHt: 100,
    description: '-30 % Black Friday (min 100 € HT)',
  },
};

/**
 * Plafond de remise absolu — jamais plus de 50 % du HT quelle que soit la
 * combinaison de codes. Protège contre les erreurs de saisie.
 */
export const MAX_DISCOUNT_RATE = 0.50;

export function isKnownPromo(code: string): boolean {
  return code in PROMO_CODES;
}
