/**
 * Etats possibles d'une commande e-commerce.
 *
 * Source unique de verite : si tu rajoutes un etat, il vient ici, et nulle
 * part ailleurs. Le compilateur TS te forcera a couvrir le nouveau cas
 * partout ou on switch sur OrderState.
 */
export type OrderState =
  | "cart"
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

/**
 * Evenements declencheurs. Un event represente une INTENTION (cliquer "payer",
 * recevoir un webhook Stripe, etc.) — il n'est pas garanti d'aboutir : c'est
 * la machine d'etat qui dit si la transition est legale.
 */
export type OrderEvent =
  | "checkout" // panier -> envoye en paiement
  | "payment_validated" // paiement OK
  | "payment_failed" // paiement KO
  | "user_cancel" // utilisateur annule avant validation
  | "admin_cancel" // admin annule apres validation
  | "ship" // commande expediee
  | "deliver" // commande livree
  | "refund"; // remboursement post-livraison

/**
 * Resultat d'une transition. On ne `throw` PAS : on renvoie un objet
 * discriminant pour forcer l'appelant a gerer le cas d'erreur explicitement.
 * (C'est l'esprit du Result<T, E> de Rust, en TS idiomatique.)
 */
export type TransitionResult =
  | { ok: true; nextState: OrderState }
  | { ok: false; error: TransitionError };

export interface TransitionError {
  readonly code:
    | "ILLEGAL_TRANSITION"
    | "TERMINAL_STATE"
    | "UNKNOWN_EVENT_FOR_STATE";
  readonly message: string;
  readonly currentState: OrderState;
  readonly event: OrderEvent;
}
