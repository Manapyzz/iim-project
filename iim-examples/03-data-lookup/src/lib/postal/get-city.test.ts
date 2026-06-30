import { describe, it, expect } from "vitest";
import { getCity, listKnownPostalCodes } from "./get-city.js";

describe("getCity — codes connus", () => {
  it("trouve Paris 1er pour 75001", () => {
    expect(getCity("75001")).toEqual({
      city: "Paris 1er",
      department: "Paris",
      region: "Ile-de-France",
    });
  });

  it("trouve Marseille pour 13001", () => {
    const result = getCity("13001");
    expect(result?.city).toBe("Marseille");
    expect(result?.region).toBe("Provence-Alpes-Cote d'Azur");
  });

  it("trouve Lyon pour 69001", () => {
    expect(getCity("69001")?.city).toBe("Lyon");
  });

  it("trouve Nice pour 06000 (zero initial preserve)", () => {
    expect(getCity("06000")?.city).toBe("Nice");
  });

  it("trouve les 20 arrondissements de Paris", () => {
    for (let i = 1; i <= 20; i++) {
      const code = `750${i.toString().padStart(2, "0")}`;
      const entry = getCity(code);
      expect(entry).not.toBeNull();
      expect(entry?.region).toBe("Ile-de-France");
    }
  });
});

describe("getCity — codes inconnus : renvoie null, JAMAIS d'invention", () => {
  it("renvoie null pour un code valide mais absent de la table (75021)", () => {
    expect(getCity("75021")).toBeNull();
  });

  it("renvoie null pour un code de departement non couvert (99999)", () => {
    expect(getCity("99999")).toBeNull();
  });

  it("renvoie null pour 00000", () => {
    expect(getCity("00000")).toBeNull();
  });
});

describe("getCity — format invalide : throw", () => {
  it("throw pour un code trop court", () => {
    expect(() => getCity("7500")).toThrow(/Format de code postal invalide/);
  });

  it("throw pour un code trop long", () => {
    expect(() => getCity("750010")).toThrow(/Format de code postal invalide/);
  });

  it("throw pour un code contenant des lettres", () => {
    expect(() => getCity("7500A")).toThrow(/Format de code postal invalide/);
  });

  it("throw pour une string vide", () => {
    expect(() => getCity("")).toThrow(/Format de code postal invalide/);
  });
});

describe("listKnownPostalCodes", () => {
  it("renvoie au moins 30 codes connus", () => {
    const codes = listKnownPostalCodes();
    expect(codes.length).toBeGreaterThanOrEqual(30);
  });

  it("renvoie une liste triee", () => {
    const codes = listKnownPostalCodes();
    const sorted = [...codes].sort();
    expect(codes).toEqual(sorted);
  });

  it("contient 75001 et 13001", () => {
    const codes = listKnownPostalCodes();
    expect(codes).toContain("75001");
    expect(codes).toContain("13001");
  });
});
