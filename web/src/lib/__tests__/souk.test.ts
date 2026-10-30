import { describe, expect, it } from "vitest";
import { foodById } from "../foods";
import { computeTargets } from "../nutrition";
import { buildWeek } from "../planner";
import { pricePerGram } from "../recipes";
import { MARKUP_HIGH, MARKUP_LOW, retailRange, soukPricePerKg, wholesale } from "../souk";
import { baseProfile } from "./fixtures";

describe("prix au souk", () => {
  it("chaque produit de gros est cohérent et relié à un produit existant", () => {
    for (const w of wholesale) {
      expect(w.min).toBeGreaterThan(0);
      expect(w.max).toBeGreaterThanOrEqual(w.min);
      if (w.foodId) expect(foodById[w.foodId], w.foodId).toBeDefined();
    }
  });

  it("la fourchette de détail encadre le prix de gros moyen multiplié par la marge", () => {
    const tomate = wholesale.find((w) => w.slug === "tomate")!;
    const mid = (tomate.min + tomate.max) / 2;
    const r = retailRange(tomate);
    expect(r.low).toBeCloseTo(Math.round(mid * MARKUP_LOW * 2) / 2);
    expect(r.high).toBeCloseTo(Math.round(mid * MARKUP_HIGH * 2) / 2);
    expect(r.mid).toBeGreaterThan(r.low - 0.5);
    expect(r.mid).toBeLessThan(r.high + 0.5);
  });

  it("n'affecte que les fruits et légumes suivis", () => {
    expect(soukPricePerKg("tomate")).toBeDefined();
    expect(soukPricePerKg("entrecote")).toBeUndefined();
    expect(pricePerGram("entrecote", "souk")).toBe(pricePerGram("entrecote", "supermarche"));
    expect(pricePerGram("tomate", "souk")).toBeCloseTo(soukPricePerKg("tomate")! / 1000);
  });

  it("la liste de courses passe au poids pour les produits du souk", () => {
    const p = { ...baseProfile, diet: "vegan" as const, produce: "souk" as const };
    const week = buildWeek(p, computeTargets(p));
    const souk = week.shopping.filter((s) => s.soukKg !== undefined);
    expect(souk.length).toBeGreaterThan(0);
    for (const s of souk) {
      expect(s.soukKg! * 1000).toBeGreaterThanOrEqual(s.grams);
      expect(s.cost).toBeCloseTo(s.soukKg! * soukPricePerKg(s.id)!);
    }
    // Les produits non suivis restent au paquet du supermarché.
    for (const s of week.shopping.filter((x) => x.soukKg === undefined)) expect(s.packs).toBeGreaterThanOrEqual(1);
  });
});
