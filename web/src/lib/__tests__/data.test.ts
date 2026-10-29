import { describe, expect, it } from "vitest";
import { categoryLabels, foodById, foods } from "../foods";
import { diets, recipeAllowed } from "../nutrition";
import { recipes } from "../recipes";

describe("données produits et recettes", () => {
  it("chaque produit a un identifiant unique, un rayon connu et des valeurs cohérentes", () => {
    expect(new Set(foods.map((f) => f.id)).size).toBe(foods.length);
    for (const f of foods) {
      expect(categoryLabels[f.category]).toBeDefined();
      expect(f.priceMad).toBeGreaterThan(0);
      expect(f.packG).toBeGreaterThan(0);
      // Calories cohérentes avec les macros (4/4/9 kcal par gramme), à 20 % près.
      const fromMacros = f.protein * 4 + f.carbs * 4 + f.fat * 9;
      expect(Math.abs(fromMacros - f.kcal)).toBeLessThanOrEqual(Math.max(15, f.kcal * 0.2));
    }
  });

  it("chaque recette a un identifiant unique, des ingrédients connus et des étapes", () => {
    expect(new Set(recipes.map((r) => r.id)).size).toBe(recipes.length);
    for (const r of recipes) {
      expect(r.ingredients.length).toBeGreaterThan(0);
      for (const i of r.ingredients) {
        expect(foodById[i.id], `${r.id} → ${i.id}`).toBeDefined();
        expect(i.grams).toBeGreaterThan(0);
      }
      expect(r.steps.length).toBeGreaterThanOrEqual(2);
    }
  });

  it.each(diets.map((d) => d.id))("le régime %s a assez de recettes pour varier la semaine", (diet) => {
    const ok = recipes.filter((r) => recipeAllowed(r, { diet, glutenFree: false, lactoseFree: false }));
    expect(ok.filter((r) => r.meal === "petit-dej").length).toBeGreaterThanOrEqual(6);
    expect(ok.filter((r) => r.meal === "collation").length).toBeGreaterThanOrEqual(4);
    expect(ok.filter((r) => r.meal === "plat").length).toBeGreaterThanOrEqual(12);
  });
});
