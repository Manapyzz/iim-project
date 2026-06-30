import postalCodesData from "../../../data/postal-codes.json" with { type: "json" };
import type { PostalEntry, PostalTable } from "./types.js";

/**
 * Table immutable des codes postaux supportes.
 * Source : data/postal-codes.json. JAMAIS d'invention en dehors de ce fichier.
 */
const POSTAL_TABLE: PostalTable = postalCodesData as PostalTable;

/** Format attendu : exactement 5 chiffres ASCII. */
const POSTAL_CODE_REGEX = /^\d{5}$/;

/**
 * Cherche une ville par son code postal francais.
 *
 * @param postalCode Code postal au format 5 chiffres (ex: "75001", "13001").
 * @returns L'entree complete si trouvee, `null` sinon. JAMAIS d'invention.
 * @throws Error si le format du code postal est invalide (pas 5 chiffres).
 *
 * Regle d'or : si le code n'est pas dans le JSON, on renvoie `null`.
 * On ne fabrique pas une ville. On ne fait pas un fallback "Ville inconnue".
 * On ne devine pas d'apres les 2 premiers chiffres.
 */
export function getCity(postalCode: string): PostalEntry | null {
  if (typeof postalCode !== "string") {
    throw new Error(
      `Code postal invalide : attendu une string, recu ${typeof postalCode}.`,
    );
  }
  if (!POSTAL_CODE_REGEX.test(postalCode)) {
    throw new Error(
      `Format de code postal invalide : "${postalCode}". Attendu : 5 chiffres.`,
    );
  }

  const entry = POSTAL_TABLE[postalCode];
  return entry ?? null;
}

/**
 * Liste les codes postaux disponibles dans la table.
 * Utile pour un autocomplete ou pour debugger ce que sait le systeme.
 */
export function listKnownPostalCodes(): string[] {
  return Object.keys(POSTAL_TABLE).sort();
}
