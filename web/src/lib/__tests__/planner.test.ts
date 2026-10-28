import { describe, expect, it } from "vitest";
import { foodById } from "../foods";
import { Profile, computeTargets, diets } from "../nutrition";
import { buildWeek } from "../planner";
import { recipes } from "../recipes";
import { baseProfile } from "./fixtures";
import { syntheticRecipes } from "./synthetic";

const plan = (p: Profile) => {
  const t = computeTargets(p);
  return { t, week: buildWeek(p, t) };
};
const avg = (week: ReturnType<typeof buildWeek>, key: "kcal" | "protein") => week.days.reduce((s, d) => s + d.totals[key], 0) / week.days.length;

const femme: Profile = { ...baseProfile, sex: "femme", weightKg: 60, heightCm: 165, age: 28, goal: "maintenir" };

describe("buildWeek", () => {
  it.each(diets.map((d) => d.id))("renvoie 7 jours au bon niveau de calories (%s)", (diet) => {
    for (const profile of [baseProfile, femme]) {
      const { t, week } = plan({ ...profile, diet });
      expect(week.error).toBeUndefined();
      expect(week.days).toHaveLength(7);
      expect(Math.abs(avg(week, "kcal") - t.kcal) / t.kcal).toBeLessThan(0.03);
      for (const d of week.days) {
        expect(d.meals.length).toBeGreaterThanOrEqual(3);
        expect(d.totals.cost).toBeGreaterThan(0);
        for (const m of d.meals) {
          expect(m.scale).toBeGreaterThanOrEqual(0.6);
          expect(m.scale).toBeLessThanOrEqual(2);
        }
      }
    }
  });

  it("produit une liste de courses cohérente avec les repas", () => {
    const p = { ...baseProfile, people: 3 };
    const { week } = plan(p);
    const grams = new Map<string, number>();
    for (const d of week.days) {
      for (const { recipe, scale } of d.meals) {
        for (const i of recipe.ingredients) grams.set(i.id, (grams.get(i.id) ?? 0) + i.grams * scale * p.people);
      }
    }
    expect(week.shopping.map((s) => s.id).sort()).toEqual([...grams.keys()].sort());
    for (const item of week.shopping) {
      const f = foodById[item.id];
      expect(item.grams).toBeCloseTo(grams.get(item.id)!, 6);
      expect(item.packs).toBe(Math.ceil(item.grams / f.packG));
      expect(item.packs * f.packG).toBeGreaterThanOrEqual(item.grams);
      expect(item.cost).toBeCloseTo(item.packs * f.priceMad, 6);
      expect(item.cost).toBeGreaterThan(0);
    }
    expect(week.shoppingTotal).toBeCloseTo(week.shopping.reduce((s, i) => s + i.cost, 0), 6);
    expect(week.weekCostPerPerson).toBeCloseTo(week.days.reduce((s, d) => s + d.totals.cost, 0), 6);
  });

  it("signale une erreur quand il n'y a pas assez de recettes", () => {
    const t = computeTargets(baseProfile);
    expect(buildWeek(baseProfile, t, []).error).toBeDefined();
    expect(buildWeek(baseProfile, t, recipes.filter((r) => r.meal !== "petit-dej")).error).toBeDefined();
    expect(buildWeek(baseProfile, t, recipes.filter((r) => r.meal !== "plat")).error).toBeDefined();
  });

  it("est déterministe", () => {
    const ids = (w: ReturnType<typeof buildWeek>) => w.days.map((d) => d.meals.map((m) => `${m.recipe.id}×${m.scale}`).join(","));
    for (const diet of ["equilibre", "keto", "vegan"] as const) {
      expect(ids(plan({ ...baseProfile, diet }).week)).toEqual(ids(plan({ ...baseProfile, diet }).week));
    }
  });

  it("varie les repas : un plat au plus 2 fois, un petit-déj au plus 3 fois", () => {
    for (const diet of ["equilibre", "mediterraneen", "vegetarien", "keto"] as const) {
      const { week } = plan({ ...baseProfile, diet });
      const count = (pred: (m: { recipe: (typeof recipes)[number] }) => boolean) => {
        const c = new Map<string, number>();
        week.days.forEach((d) => d.meals.filter(pred).forEach((m) => c.set(m.recipe.id, (c.get(m.recipe.id) ?? 0) + 1)));
        return Math.max(...c.values());
      };
      expect(count((m) => m.recipe.meal === "plat")).toBeLessThanOrEqual(2);
      expect(count((m) => m.recipe.meal === "petit-dej")).toBeLessThanOrEqual(3);
    }
  });

  it("atteint presque les protéines pour le régime riche en protéines", () => {
    for (const goal of ["perdre", "prendre"] as const) {
      const { t, week } = plan({ ...baseProfile, diet: "proteine", goal });
      expect(avg(week, "protein")).toBeGreaterThanOrEqual(t.protein * 0.9);
    }
  });

  it("ajoute des collations pour les gros besoins plutôt que de grossir les portions", () => {
    const p: Profile = { ...baseProfile, age: 25, weightKg: 90, heightCm: 185, activity: 1.725, goal: "prendre", people: 1, monthlyBudget: 4000 };
    const { t, week } = plan(p);
    expect(t.kcal).toBeGreaterThan(3500);
    expect(week.days.some((d) => d.meals.some((m) => m.recipe.meal === "collation"))).toBe(true);
    expect(Math.abs(avg(week, "kcal") - t.kcal) / t.kcal).toBeLessThan(0.05);
  });

  it("reste rapide avec 80 recettes dont 12 collations", () => {
    const pool = syntheticRecipes({ "petit-dej": 15, plat: 53, collation: 12 });
    const t = computeTargets(baseProfile);
    buildWeek(baseProfile, t, pool); // échauffement
    let best = Infinity;
    for (let i = 0; i < 3; i++) {
      const t0 = performance.now();
      expect(buildWeek(baseProfile, t, pool).days).toHaveLength(7);
      best = Math.min(best, performance.now() - t0);
    }
    expect(best).toBeLessThan(150);
  });
});
