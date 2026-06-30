/**
 * Entree dans la table des codes postaux.
 * Structure exacte du JSON dans data/postal-codes.json.
 */
export interface PostalEntry {
  readonly city: string;
  readonly department: string;
  readonly region: string;
}

/** Table complete : code postal (5 chiffres, string) -> entree. */
export type PostalTable = Record<string, PostalEntry>;
