// =====================================================================
// good-code.ts — version REFACTOREE de bad-code.ts.
//
// En realite, dans un vrai projet, on eclaterait ce fichier en :
//   - src/config/business.ts       (les seuils et taux)
//   - src/lib/pricing/index.ts     (calculs prix)
//   - src/lib/orders/index.ts      (cycle de vie commande)
//
// Ici on garde un seul fichier pour la lisibilite de la demo, mais on
// montre la philosophie : config separee, fonctions petites, pas de TODO,
// erreurs explicites, pas de magic number business.
// =====================================================================

// --- CONFIG (en vrai : src/config/business.ts) ----------------------

const BUSINESS_CONFIG = {
  /** Seuil au-dela duquel on declenche la remise grossiste. */
  WHOLESALE_PRICE_THRESHOLD: 99.99,
  /** Remise grossiste appliquee quand le seuil est atteint. */
  WHOLESALE_DISCOUNT_RATIO: 0.10,
  /** Codes promo connus et leur ratio de remise. */
  PROMO_CODES: {
    PROMO10: 0.10,
    PROMO20: 0.20,
  } as const,
  /** Taux TVA standard France (2026). */
  TVA_STANDARD_RATE: 0.20,
  /** Age minimum pour creer un compte. */
  MIN_USER_AGE: 18,
} as const;

// --- TYPES ----------------------------------------------------------

export interface User {
  readonly id: string;
  readonly email: string;
  readonly age: number;
  readonly country: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly stock: number;
}

// --- VALIDATION (petite fonction, erreurs explicites) ---------------

export interface ValidationResult {
  readonly ok: boolean;
  readonly reason?: string;
}

/**
 * Valide un user. Pas de try/catch silencieux : on renvoie un Result
 * explicite que le caller doit traiter.
 */
export function validateUser(user: User): ValidationResult {
  if (!user.email.includes("@")) {
    return { ok: false, reason: "INVALID_EMAIL" };
  }
  if (user.age < BUSINESS_CONFIG.MIN_USER_AGE) {
    return { ok: false, reason: "UNDERAGE" };
  }
  return { ok: true };
}

// --- PRICING (fonction pure, source unique des taux) ----------------

/**
 * Calcule le prix HT pour une quantite donnee.
 * Applique la remise grossiste si seuil atteint.
 */
export function calculateBasePrice(
  product: Product,
  quantity: number,
): number {
  if (quantity <= 0) {
    throw new Error(`Quantity must be > 0, got ${quantity}`);
  }
  const base = product.price * quantity;
  if (base > BUSINESS_CONFIG.WHOLESALE_PRICE_THRESHOLD) {
    return roundCents(base * (1 - BUSINESS_CONFIG.WHOLESALE_DISCOUNT_RATIO));
  }
  return roundCents(base);
}

/**
 * Applique un code promo. JAMAIS de fallback silencieux.
 * @throws Error si le code n'est pas connu.
 */
export function applyPromoCode(price: number, code: string): number {
  const ratio =
    BUSINESS_CONFIG.PROMO_CODES[code as keyof typeof BUSINESS_CONFIG.PROMO_CODES];
  if (ratio === undefined) {
    throw new Error(`Unknown promo code: ${code}`);
  }
  return roundCents(price * (1 - ratio));
}

/**
 * Formatte un prix HT en TTC avec la TVA standard.
 * Source unique du taux : BUSINESS_CONFIG.TVA_STANDARD_RATE.
 */
export function formatPriceTtc(priceHt: number): string {
  const ttc = roundCents(priceHt * (1 + BUSINESS_CONFIG.TVA_STANDARD_RATE));
  return `${ttc.toFixed(2)} EUR`;
}

// --- HELPER PUR -----------------------------------------------------

/** Arrondi commercial a 2 decimales (centimes). Source unique. */
function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}
