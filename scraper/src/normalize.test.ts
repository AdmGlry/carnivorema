import { describe, expect, it } from "vitest";
import { parsePack, pricePerKg } from "./normalize.js";

describe("parsePack", () => {
  it.each([
    ["Entrecôte de Boeuf 500g - Filière Qualité", { pack_grams: 500, pack_ml: null, unit_count: null }],
    ["Tomate 500g", { pack_grams: 500, pack_ml: null, unit_count: null }],
    ["Concombre Filet 1Kg", { pack_grams: 1000, pack_ml: null, unit_count: null }],
    ["Oignon Rouge Filet 1kg.", { pack_grams: 1000, pack_ml: null, unit_count: null }],
    ["Poivron Rouge 250 g", { pack_grams: 250, pack_ml: null, unit_count: null }],
    ["Framboise 250G", { pack_grams: 250, pack_ml: null, unit_count: null }],
    ["Poulet Entier au kg", { pack_grams: 1000, pack_ml: null, unit_count: null }],
    ["Agnelle Entière au Kg.", { pack_grams: 1000, pack_ml: null, unit_count: null }],
    ["Pomme de terre 1,5kg", { pack_grams: 1500, pack_ml: null, unit_count: null }],
    ["Crème UHT Fluide 12%Mg Carrefour 3x20cl", { pack_grams: null, pack_ml: 600, unit_count: 3 }],
    ["Compotes Pomme Pêche Carrefour Classic 4x100g", { pack_grams: 400, pack_ml: null, unit_count: 4 }],
    ["Crottin de Chèvre 45% Mg Carrefour 2x60g", { pack_grams: 120, pack_ml: null, unit_count: 2 }],
    ["Lait UHT Entier Président 1L.", { pack_grams: null, pack_ml: 1000, unit_count: null }],
    ["Vinaigre de Cidre Carrefour Bio 50cl", { pack_grams: null, pack_ml: 500, unit_count: null }],
    ["Yaourt à Boire Protéiné Vanille Chergui SPORT 450ml", { pack_grams: null, pack_ml: 450, unit_count: null }],
    ["Huile de Table Twimen 5L.", { pack_grams: null, pack_ml: 5000, unit_count: null }],
    ["Pack Lait UHT Entier Jaouda 1L 6 unités", { pack_grams: null, pack_ml: 6000, unit_count: 6 }],
    ["Œufs Frais Calibre M Baidy Plateau 30 unités", { pack_grams: null, pack_ml: null, unit_count: 30 }],
    ["Œufs Enrichis Vitamine Gros Calibre Ovocorp x30u", { pack_grams: null, pack_ml: null, unit_count: 30 }],
    ["Carré Gervais à la Crème 8 unités", { pack_grams: null, pack_ml: null, unit_count: 8 }],
    ["Salade Iceberg à La Pièce.", { pack_grams: null, pack_ml: null, unit_count: 1 }],
    ["Coriandre en Botte", { pack_grams: null, pack_ml: null, unit_count: null }],
  ])("%s", (label, expected) => {
    expect(parsePack(label)).toEqual(expected);
  });
});

describe("pricePerKg", () => {
  it("calcule le prix au kg pour un produit en grammes", () => {
    expect(pricePerKg(79.95, { pack_grams: 500, pack_ml: null, unit_count: null })).toEqual({ value: 159.9, unit: "kg" });
  });

  it("calcule le prix au litre pour un liquide", () => {
    expect(pricePerKg(45.95, { pack_grams: null, pack_ml: 600, unit_count: 3 })).toEqual({ value: 76.58, unit: "L" });
  });

  it("renvoie null sans poids ni volume", () => {
    expect(pricePerKg(33.5, { pack_grams: null, pack_ml: null, unit_count: 30 })).toBeNull();
  });
});
