import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseCategoryPage, parsePrice } from "./parse.js";

const fixture = (name: string) => readFileSync(new URL(`../fixtures/${name}.html`, import.meta.url), "utf8");
const ctx = (categorySlug: string) => ({ storeSlug: "carrefour-hypermarket", categorySlug });

const boucherie = [
  ...parseCategoryPage(fixture("boucherie-29-p1"), ctx("boucherie")),
  ...parseCategoryPage(fixture("boucherie-29-p2"), ctx("boucherie")),
];
const legumes = parseCategoryPage(fixture("legumes-45-p1"), ctx("legumes"));

describe("parsePrice", () => {
  it.each([
    ["47,45 MAD", 47.45],
    ["  206,90 MAD ", 206.9],
    ["1 234,50 MAD", 1234.5],
    ["0,00 MAD /", 0],
    ["Prix indisponible", null],
  ])("%s → %s", (text, expected) => {
    expect(parsePrice(text)).toBe(expected);
  });
});

describe("parseCategoryPage", () => {
  it("lit plus de 30 produits de boucherie sur les deux pages", () => {
    expect(boucherie.length).toBeGreaterThan(30);
  });

  it("lit les produits de la page légumes", () => {
    expect(legumes.length).toBeGreaterThanOrEqual(15);
  });

  it("renvoie des prix numériques strictement positifs et des champs complets", () => {
    for (const p of [...boucherie, ...legumes]) {
      expect(p.price_mad).toBeGreaterThan(0);
      expect(p.name.length).toBeGreaterThan(2);
      expect(p.product_ext_id).toMatch(/^\d+$/);
      expect(p.url).toMatch(/^https:\/\/www\.bringo\.ma\/fr_MA\/stores\/carrefour-hypermarket\/.+\/products\/.+\/\d+$/);
      expect(p.store_slug).toBe("carrefour-hypermarket");
    }
  });

  it("retrouve des produits connus avec leur prix", () => {
    const entrecote = boucherie.find((p) => p.name === "Entrecôte de Boeuf 500g - Filière Qualité");
    expect(entrecote?.price_mad).toBe(79.95);
    expect(entrecote?.promo).toBe("-2%");

    const tagine = boucherie.find((p) => p.name.startsWith("Tagine de Bœuf avec Os 500g"));
    expect(tagine).toMatchObject({ price_mad: 47.45, promo: "-3%", product_ext_id: "26253" });
  });

  it("utilise le prix indicatif à la pièce quand le prix principal est à 0", () => {
    const approx = legumes.filter((p) => p.approximate);
    expect(approx.length).toBeGreaterThan(0);
    for (const p of approx) expect(p.price_mad).toBeGreaterThan(0);
  });

  it("n'a pas de doublon d'identifiant", () => {
    const ids = boucherie.map((p) => p.product_ext_id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("renvoie une liste vide pour une page sans produit", () => {
    expect(parseCategoryPage("<html><body><p>Aucun produit</p></body></html>", ctx("vide"))).toEqual([]);
  });
});
