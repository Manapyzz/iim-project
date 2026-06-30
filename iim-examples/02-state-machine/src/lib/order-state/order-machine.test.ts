import { describe, it, expect } from "vitest";
import { transition, legalEventsFrom, isTerminal } from "./order-machine.js";

describe("transition — happy paths", () => {
  it("cart -> checkout -> pending", () => {
    const result = transition("cart", "checkout");
    expect(result).toEqual({ ok: true, nextState: "pending" });
  });

  it("pending -> payment_validated -> confirmed", () => {
    const result = transition("pending", "payment_validated");
    expect(result.ok && result.nextState).toBe("confirmed");
  });

  it("confirmed -> ship -> shipped", () => {
    const result = transition("confirmed", "ship");
    expect(result.ok && result.nextState).toBe("shipped");
  });

  it("shipped -> deliver -> delivered", () => {
    const result = transition("shipped", "deliver");
    expect(result.ok && result.nextState).toBe("delivered");
  });

  it("delivered -> refund -> refunded (refund flow)", () => {
    const result = transition("delivered", "refund");
    expect(result.ok && result.nextState).toBe("refunded");
  });

  it("happy path complet : cart -> pending -> confirmed -> shipped -> delivered", () => {
    let state = "cart" as const;

    const r1 = transition(state, "checkout");
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;

    const r2 = transition(r1.nextState, "payment_validated");
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;

    const r3 = transition(r2.nextState, "ship");
    expect(r3.ok).toBe(true);
    if (!r3.ok) return;

    const r4 = transition(r3.nextState, "deliver");
    expect(r4.ok && r4.nextState).toBe("delivered");
  });
});

describe("transition — cancellation flows", () => {
  it("pending -> user_cancel -> cancelled", () => {
    const result = transition("pending", "user_cancel");
    expect(result.ok && result.nextState).toBe("cancelled");
  });

  it("pending -> payment_failed -> cancelled", () => {
    const result = transition("pending", "payment_failed");
    expect(result.ok && result.nextState).toBe("cancelled");
  });

  it("confirmed -> admin_cancel -> cancelled", () => {
    const result = transition("confirmed", "admin_cancel");
    expect(result.ok && result.nextState).toBe("cancelled");
  });
});

describe("transition — erreurs", () => {
  it("refuse cart -> ship (transition sautee, illegale)", () => {
    const result = transition("cart", "ship");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_EVENT_FOR_STATE");
    }
  });

  it("refuse confirmed -> checkout (event inconnu pour cet etat)", () => {
    const result = transition("confirmed", "checkout");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_EVENT_FOR_STATE");
    }
  });

  it("refuse toute transition depuis l'etat terminal cancelled", () => {
    const result = transition("cancelled", "ship");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TERMINAL_STATE");
    }
  });

  it("refuse toute transition depuis l'etat terminal refunded", () => {
    const result = transition("refunded", "refund");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TERMINAL_STATE");
    }
  });

  it("refuse delivered -> ship (on ne re-expedie pas une commande livree)", () => {
    const result = transition("delivered", "ship");
    expect(result.ok).toBe(false);
  });
});

describe("legalEventsFrom", () => {
  it("liste les 3 events legaux depuis pending", () => {
    const events = legalEventsFrom("pending");
    expect(events.sort()).toEqual(
      ["payment_validated", "payment_failed", "user_cancel"].sort(),
    );
  });

  it("renvoie une liste vide pour un etat terminal", () => {
    expect(legalEventsFrom("cancelled")).toEqual([]);
    expect(legalEventsFrom("refunded")).toEqual([]);
  });

  it("renvoie un seul event depuis cart (checkout)", () => {
    expect(legalEventsFrom("cart")).toEqual(["checkout"]);
  });
});

describe("isTerminal", () => {
  it("identifie correctement les etats terminaux", () => {
    expect(isTerminal("cancelled")).toBe(true);
    expect(isTerminal("refunded")).toBe(true);
    expect(isTerminal("cart")).toBe(false);
    expect(isTerminal("delivered")).toBe(false);
  });
});
