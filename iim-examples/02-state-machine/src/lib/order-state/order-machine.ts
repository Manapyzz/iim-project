import type {
  OrderState,
  OrderEvent,
  TransitionResult,
} from "./types.js";

/**
 * Table des transitions legales.
 *
 * Lecture : `TRANSITIONS[currentState][event] = nextState`.
 * Si une entree est absente, la transition est ILLEGALE — pas d'invention.
 *
 * Cette table est la SOURCE DE VERITE du cycle de vie d'une commande.
 * Le LLM, l'UI, les routes API, les webhooks : tout le monde passe par
 * `transition()`. Aucun setState() libre nulle part.
 */
const TRANSITIONS: Partial<Record<OrderState, Partial<Record<OrderEvent, OrderState>>>> = {
  cart: {
    checkout: "pending",
  },
  pending: {
    payment_validated: "confirmed",
    payment_failed: "cancelled",
    user_cancel: "cancelled",
  },
  confirmed: {
    ship: "shipped",
    admin_cancel: "cancelled",
  },
  shipped: {
    deliver: "delivered",
  },
  delivered: {
    refund: "refunded",
  },
  // cancelled et refunded sont des etats TERMINAUX : aucune transition sortante.
};

/**
 * Etats terminaux : on peut y entrer, jamais en sortir.
 * Liste explicite (et non "tout etat sans transition sortante"), pour
 * documenter l'intention metier sans ambiguite.
 */
const TERMINAL_STATES: ReadonlySet<OrderState> = new Set<OrderState>([
  "cancelled",
  "refunded",
]);

/**
 * Tente une transition. Renvoie le nouvel etat ou une erreur typee.
 *
 * On NE THROW PAS : l'appelant doit traiter le cas d'echec (UI : afficher
 * un message, webhook : log + retour 422, etc.).
 */
export function transition(
  currentState: OrderState,
  event: OrderEvent,
): TransitionResult {
  if (TERMINAL_STATES.has(currentState)) {
    return {
      ok: false,
      error: {
        code: "TERMINAL_STATE",
        message: `L'etat ${currentState} est terminal : aucune transition possible (event recu : ${event}).`,
        currentState,
        event,
      },
    };
  }

  const transitionsForState = TRANSITIONS[currentState];
  if (transitionsForState === undefined) {
    // Cas defensif : un OrderState non couvert dans la table. Ne devrait
    // jamais arriver si la table reste complete (le TS aide a le voir).
    return {
      ok: false,
      error: {
        code: "ILLEGAL_TRANSITION",
        message: `Aucune transition definie depuis l'etat ${currentState}.`,
        currentState,
        event,
      },
    };
  }

  const nextState = transitionsForState[event];
  if (nextState === undefined) {
    return {
      ok: false,
      error: {
        code: "UNKNOWN_EVENT_FOR_STATE",
        message: `L'event ${event} n'est pas accepte depuis l'etat ${currentState}.`,
        currentState,
        event,
      },
    };
  }

  return { ok: true, nextState };
}

/**
 * Utilitaire d'introspection : liste les events legaux depuis un etat.
 * Utile pour generer dynamiquement les boutons d'action dans l'UI.
 */
export function legalEventsFrom(state: OrderState): OrderEvent[] {
  if (TERMINAL_STATES.has(state)) return [];
  const transitions = TRANSITIONS[state];
  if (!transitions) return [];
  return Object.keys(transitions) as OrderEvent[];
}

/** Indique si un etat est terminal (commande figee). */
export function isTerminal(state: OrderState): boolean {
  return TERMINAL_STATES.has(state);
}
