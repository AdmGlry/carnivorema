import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { categoryUrl, collect, toPriceRow } from "./collect.js";
import { refineCategory } from "./config.js";
import { toCsv } from "./output.js";

const fixture = (name: string) => readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");
const p1 = fixture("boucherie-29-p1.html");
const p2 = fixture("boucherie-29-p2.html");
const store = [{ storeSlug: "carrefour-hypermarket", categories: [{ bringoSlug: "boucherie-29", categorySlug: "viande" }] }];

describe("collect", () => {
  it("parcourt les pages et s'arrête quand plus rien de nouveau n'arrive", async () => {
    const calls: string[] = [];
    const pages = [p1, p2, p2];
    const report = await collect(store, async (url) => {
      calls.push(url);
      return pages[calls.length - 1] ?? "";
    }, "2026-10-29T05:17:00.000Z");
    expect(calls).toEqual([1, 2, 3].map((n) => categoryUrl("carrefour-hypermarket", "boucherie-29", n)));
    expect(report.pages).toBe(3);
    expect(report.errors).toEqual([]);
    expect(report.rows.length).toBeGreaterThan(30);
    expect(new Set(report.rows.map((r) => r.product_ext_id)).size).toBe(report.rows.length);
  });

  it("note l'erreur d'une catégorie sans bloquer le reste", async () => {
    const report = await collect(store, async () => {
      throw new Error("HTTP 503");
    });
    expect(report.rows).toEqual([]);
    expect(report.errors[0]).toContain("HTTP 503");
  });

  it("produit des lignes conformes à la table prices", async () => {
    const { rows } = await collect(store, async (url) => (url.endsWith("page=1") ? p1 : ""), "2026-10-29T05:17:00.000Z");
    const entrecote = rows.find((r) => r.name.startsWith("Entrecôte de Boeuf 500g"))!;
    expect(entrecote).toMatchObject({
      store_slug: "carrefour-hypermarket",
      category_slug: "viande",
      price_mad: 79.95,
      promo: "-2%",
      pack_grams: 500,
      price_per_kg: 159.9,
      scraped_at: "2026-10-29T05:17:00.000Z",
    });
  });
});

describe("toPriceRow", () => {
  it("ne calcule pas de prix au kg pour un prix indicatif", () => {
    const row = toPriceRow(
      { store_slug: "s", category_slug: "legume", product_ext_id: "1", name: "Salade Iceberg à La Pièce.", price_mad: 9.95, approximate: true, promo: null, url: "u" },
      "t",
    );
    expect(row.price_per_kg).toBeNull();
  });
});

describe("refineCategory", () => {
  it("reclasse les légumineuses du rayon féculents", () => {
    expect(refineCategory("feculent", "Lentilles Twimen 500g")).toBe("legumineuse");
    expect(refineCategory("feculent", "Pois Chiches Rosana 500g.")).toBe("legumineuse");
    expect(refineCategory("feculent", "Spaghetti Kayna 500G")).toBe("feculent");
    expect(refineCategory("legume", "Haricot Vert 250g.")).toBe("legume");
  });
});

describe("toCsv", () => {
  it("échappe les virgules et guillemets", () => {
    const csv = toCsv([
      { store_slug: "s", product_ext_id: "1", name: 'Fromage "Brie", 100g', category_slug: "laitier", price_mad: 17.95, promo: null, pack_grams: 100, pack_ml: null, unit_count: null, price_per_kg: 179.5, url: "u", scraped_at: "t" },
    ]);
    expect(csv.split("\n")[1]).toBe('s,1,"Fromage ""Brie"", 100g",laitier,17.95,,100,,,179.5,u,t');
  });
});
