import { describe, expect, it } from "vitest";
import { foodById } from "../foods";
import { Profile, computeTargets, diets, recipeAllowed } from "../nutrition";
import { recipes } from "../recipes";
import { baseProfile } from "./fixtures";


const ANIMAL = ["viande", "volaille", "poisson", "oeuf", "laitier"];

describe("computeTargets", () => {
  it("applique Mifflin-St Jeor pour un homme", () => {
    const t = computeTargets(baseProfile);
    // 10×80 + 6,25×178 − 5×30 + 5
    expect(t.bmr).toBeCloseTo(1767.5, 5);
    expect(t.tdee).toBeCloseTo(1767.5 * 1.55, 5);
    expect(t.kcal).toBeCloseTo(1767.5 * 1.55 - 500, 5);
  });

  it("applique Mifflin-St Jeor pour une femme", () => {
    const t = computeTargets({ ...baseProfile, sex: "femme", weightKg: 60, heightCm: 165, age: 25, goal: "maintenir" });
    // 10×60 + 6,25×165 − 5×25 − 161
    expect(t.bmr).toBeCloseTo(1345.25, 5);
    expect(t.kcal).toBeCloseTo(1345.25 * 1.55, 5);
  });

  it("calcule l'IMC et sa catégorie", () => {
    const t = computeTargets(baseProfile);
    expect(t.bmi).toBeCloseTo(80 / 1.78 ** 2, 5);
    expect(t.bmiLabel).toBe("Surpoids");
    expect(computeTargets({ ...baseProfile, weightKg: 70 }).bmiLabel).toBe("Corpulence normale");
    expect(computeTargets({ ...baseProfile, weightKg: 100 }).bmiLabel).toBe("Obésité");
    expect(computeTargets({ ...baseProfile, weightKg: 55 }).bmiLabel).toBe("Insuffisance pondérale");
  });

  it("ne descend jamais sous le plancher calorique et prévient", () => {
    const femme = computeTargets({ ...baseProfile, sex: "femme", weightKg: 45, heightCm: 150, age: 60, activity: 1.2 });
    expect(femme.kcal).toBe(1200);
    expect(femme.warnings.some((w) => w.includes("1200"))).toBe(true);

    const homme = computeTargets({ ...baseProfile, weightKg: 50, heightCm: 160, age: 70, activity: 1.2 });
    expect(homme.kcal).toBeGreaterThanOrEqual(1500);
  });

  it("refuse la perte de poids si l'IMC est bas", () => {
    const p = { ...baseProfile, weightKg: 50, heightCm: 180 };
    const t = computeTargets(p);
    expect(t.bmi).toBeLessThan(18.5);
    expect(t.kcal).toBeCloseTo(t.tdee, 5);
    expect(t.warnings.some((w) => w.includes("IMC"))).toBe(true);
  });

  it("prévient pour les mineurs", () => {
    expect(computeTargets({ ...baseProfile, age: 16 }).warnings.some((w) => w.includes("18 ans"))).toBe(true);
    expect(computeTargets(baseProfile).warnings).toHaveLength(0);
  });

  it("fixe les glucides des régimes plafonnés", () => {
    expect(computeTargets({ ...baseProfile, diet: "keto" }).carbs).toBe(30);
    expect(computeTargets({ ...baseProfile, diet: "carnivore" }).carbs).toBe(10);
    expect(computeTargets({ ...baseProfile, diet: "low-carb" }).carbs).toBe(100);
  });

  it.each(diets.map((d) => d.id))("répartit toutes les calories en macros (%s)", (diet) => {
    for (const goal of ["perdre", "maintenir", "prendre"] as const) {
      const t = computeTargets({ ...baseProfile, diet, goal });
      const sum = t.protein * 4 + t.carbs * 4 + t.fat * 9;
      expect(Math.abs(sum - t.kcal) / t.kcal).toBeLessThan(0.01);
      expect(t.protein).toBeGreaterThan(0);
      expect(t.fat).toBeGreaterThan(0);
    }
  });

  it("calcule le budget par jour et par personne", () => {
    expect(computeTargets(baseProfile).dailyBudgetPerPerson).toBeCloseTo(3000 / 30 / 2, 5);
  });
});

describe("recipeAllowed", () => {
  const allowed = (diet: Profile["diet"], extra: Partial<Profile> = {}) =>
    recipes.filter((r) => recipeAllowed(r, { diet, glutenFree: false, lactoseFree: false, ...extra }));
  const categories = (r: (typeof recipes)[number]) => r.ingredients.map((i) => foodById[i.id].category);

  it("le carnivore n'inclut que des produits animaux", () => {
    const list = allowed("carnivore");
    expect(list.length).toBeGreaterThan(0);
    for (const r of list) expect(categories(r).every((c) => ANIMAL.includes(c))).toBe(true);
  });

  it("le végan n'inclut aucun produit animal", () => {
    const list = allowed("vegan");
    expect(list.length).toBeGreaterThan(0);
    for (const r of list) expect(categories(r).some((c) => ANIMAL.includes(c))).toBe(false);
  });

  it("le végétarien exclut viande, volaille et poisson", () => {
    for (const r of allowed("vegetarien")) {
      expect(categories(r).some((c) => ["viande", "volaille", "poisson"].includes(c))).toBe(false);
    }
  });

  it("sans gluten exclut couscous et spaghetti", () => {
    const list = allowed("equilibre", { glutenFree: true });
    for (const r of list) expect(r.ingredients.some((i) => foodById[i.id].gluten)).toBe(false);
    expect(list.some((r) => r.ingredients.some((i) => i.id === "couscous" || i.id === "spaghetti"))).toBe(false);
    expect(allowed("equilibre").some((r) => r.ingredients.some((i) => i.id === "couscous"))).toBe(true);
  });

  it("sans lactose exclut les produits lactés", () => {
    for (const r of allowed("equilibre", { lactoseFree: true })) {
      expect(r.ingredients.some((i) => foodById[i.id].lactose)).toBe(false);
    }
  });
});
