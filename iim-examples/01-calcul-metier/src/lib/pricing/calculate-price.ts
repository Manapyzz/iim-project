import { TVA_RATES, MAX_DISCOUNT_RATIO, type TvaType } from "../../config/tva.js";

/**
 * Codes promo supportes. Source unique : si tu ajoutes un code, il vient ici,
 * et nulle part ailleurs. Pas de string magique disseminee dans le code.
 */
interface PromoRule {
  /** Reduction exprimee en fraction du HT (0.10 = 10 %). */
  readonly discount: number;
  /** Seuil HT minimum pour que le code s'applique (0 = pas de seuil). */
  readonly minTotalHt: number;
}

const PROMO_CODES: Record<string, PromoRule> = {
  WELCOME10: { discount: 0.10, minTotalHt: 0 },
  STUDENT20: { discount: 0.20, minTotalHt: 0 },
  BLACKFRIDAY: { discount: 0.30, minTotalHt: 100 },
};

export interface PriceInput {
  /** Montant HT en euros, strictement positif. */
  readonly montantHt: number;
  readonly typeTva: TvaType;
  /** Code promo optionnel. Si fourni, doit etre connu. */
  readonly codePromo?: string;
}

export interface PriceBreakdown {
  /** HT apres remise eventuelle. */
  readonly ht: number;
  /** Montant de la TVA appliquee sur le HT remise. */
  readonly tva: number;
  /** TTC : HT remise + TVA. */
  readonly ttc: number;
  /** Montant de la remise en euros (0 si aucune). */
  readonly remise: number;
  /** Total final a payer par le client (= ttc). */
  readonly total: number;
}

/**
 * Arrondi commercial a 2 decimales (centimes).
 * Pas de magic number : on passe par cette helper pour TOUS les arrondis.
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calcule le prix final d'une commande.
 *
 * Regles metier (immuables) :
 *   1. La remise s'applique sur le HT, AVANT calcul de TVA.
 *   2. La remise est plafonnee a 50 % du HT (cf. MAX_DISCOUNT_RATIO).
 *   3. BLACKFRIDAY ne s'applique que si le HT initial >= 100 EUR.
 *   4. Tout code promo inconnu => exception (jamais d'application silencieuse).
 *   5. Montant <= 0 => exception. Taux TVA inconnu => exception.
 *
 * @throws Error si l'input est invalide.
 */
export function calculatePrice(input: PriceInput): PriceBreakdown {
  const { montantHt, typeTva, codePromo } = input;

  if (!Number.isFinite(montantHt) || montantHt <= 0) {
    throw new Error(
      `montantHt invalide : ${montantHt}. Doit etre un nombre strictement positif.`,
    );
  }

  const tvaRate = TVA_RATES[typeTva];
  if (tvaRate === undefined) {
    throw new Error(`Type de TVA inconnu : ${typeTva}`);
  }

  let discountRatio = 0;
  if (codePromo !== undefined) {
    const rule = PROMO_CODES[codePromo];
    if (rule === undefined) {
      throw new Error(`Code promo invalide : ${codePromo}`);
    }
    // Seuil non atteint : on n'applique simplement pas la remise (pas d'exception).
    if (montantHt >= rule.minTotalHt) {
      discountRatio = rule.discount;
    }
  }

  // Plafond legal : on ne descend jamais sous 50 % du HT initial.
  const cappedDiscountRatio = Math.min(discountRatio, MAX_DISCOUNT_RATIO);

  const remise = round2(montantHt * cappedDiscountRatio);
  const ht = round2(montantHt - remise);
  const tva = round2(ht * tvaRate);
  const ttc = round2(ht + tva);

  return {
    ht,
    tva,
    ttc,
    remise,
    total: ttc,
  };
}
