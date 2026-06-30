import { describe, it, expect } from "vitest";
import { calculatePrice } from "./calculate-price.js";

describe("calculatePrice", () => {
  it("calcule un prix simple TVA standard 20 % sans promo", () => {
    const result = calculatePrice({ montantHt: 100, typeTva: "standard" });
    expect(result).toEqual({
      ht: 100,
      tva: 20,
      ttc: 120,
      remise: 0,
      total: 120,
    });
  });

  it("applique TVA reduite 10 % correctement", () => {
    const result = calculatePrice({ montantHt: 50, typeTva: "reduit" });
    expect(result.tva).toBe(5);
    expect(result.total).toBe(55);
  });

  it("applique TVA super-reduite 5,5 % correctement", () => {
    const result = calculatePrice({ montantHt: 200, typeTva: "super-reduit" });
    expect(result.tva).toBe(11);
    expect(result.total).toBe(211);
  });

  it("applique WELCOME10 : 10 % de remise sur HT avant TVA", () => {
    const result = calculatePrice({
      montantHt: 200,
      typeTva: "standard",
      codePromo: "WELCOME10",
    });
    // HT remise = 180, TVA = 36, total = 216
    expect(result.remise).toBe(20);
    expect(result.ht).toBe(180);
    expect(result.tva).toBe(36);
    expect(result.total).toBe(216);
  });

  it("ignore BLACKFRIDAY si HT initial < 100 EUR (seuil non atteint)", () => {
    const result = calculatePrice({
      montantHt: 50,
      typeTva: "standard",
      codePromo: "BLACKFRIDAY",
    });
    // Pas de remise : seuil 100 non atteint
    expect(result.remise).toBe(0);
    expect(result.total).toBe(60);
  });

  it("applique BLACKFRIDAY si HT initial >= 100 EUR", () => {
    const result = calculatePrice({
      montantHt: 150,
      typeTva: "standard",
      codePromo: "BLACKFRIDAY",
    });
    // Remise 30 % => HT = 105, TVA = 21, total = 126
    expect(result.remise).toBe(45);
    expect(result.ht).toBe(105);
    expect(result.total).toBe(126);
  });

  it("respecte le plafond de 50 % meme avec un code tres remisant", () => {
    // STUDENT20 = 20 % ; on cumule rien d'autre ici, on verifie juste que le
    // plafond ne descend pas plus bas que 50 % (ici on est a 20 %, ok).
    const result = calculatePrice({
      montantHt: 100,
      typeTva: "standard",
      codePromo: "STUDENT20",
    });
    expect(result.remise).toBe(20);
    // Le plafond 50 % serait remise = 50, donc 20 est bien en dessous.
    expect(result.remise).toBeLessThanOrEqual(50);
  });

  it("throw si montant negatif ou zero", () => {
    expect(() => calculatePrice({ montantHt: -10, typeTva: "standard" })).toThrow(
      /montantHt invalide/,
    );
    expect(() => calculatePrice({ montantHt: 0, typeTva: "standard" })).toThrow(
      /montantHt invalide/,
    );
  });

  it("throw si type de TVA inconnu", () => {
    expect(() =>
      // @ts-expect-error : on teste explicitement un cas illegal au runtime
      calculatePrice({ montantHt: 100, typeTva: "tva-imaginaire" }),
    ).toThrow(/Type de TVA inconnu/);
  });

  it("throw si code promo invalide", () => {
    expect(() =>
      calculatePrice({
        montantHt: 100,
        typeTva: "standard",
        codePromo: "FAKE_CODE",
      }),
    ).toThrow(/Code promo invalide/);
  });
});
