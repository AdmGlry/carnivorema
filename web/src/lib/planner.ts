import { Category, categoryLabels, foodById } from "./foods";
import { Profile, Targets, recipeAllowed } from "./nutrition";
import { Nutrition, Recipe, recipeNutrition, recipes } from "./recipes";

export type DayPlan = {
  meals: { recipe: Recipe; scale: number }[];
  totals: Nutrition;
};

export type WeekPlan = {
  days: DayPlan[];
  weekCostPerPerson: number;
  shopping: ShoppingItem[];
  shoppingTotal: number;
  error?: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  category: Category;
  grams: number;
  packs: number;
  packLabel: string;
  cost: number;
};

const MIN_SCALE = 0.6;
const MAX_SCALE = 2;

function add(a: Nutrition, b: Nutrition): Nutrition {
  return { kcal: a.kcal + b.kcal, protein: a.protein + b.protein, carbs: a.carbs + b.carbs, fat: a.fat + b.fat, cost: a.cost + b.cost };
}

function scoreDay(n: Nutrition, t: Targets) {
  const kcalGap = Math.abs(n.kcal - t.kcal) / t.kcal;
  const proteinGap = Math.max(0, t.protein - n.protein) / t.protein;
  const carbGap = Math.max(0, n.carbs - t.carbs) / Math.max(t.carbs, 30);
  // Pour les régimes non plafonnés, on évite aussi une journée trop pauvre en glucides.
  const lowCarbGap = Math.max(0, t.carbs * 0.6 - n.carbs) / Math.max(t.carbs, 30);
  const budgetGap = Math.max(0, n.cost - t.dailyBudgetPerPerson) / t.dailyBudgetPerPerson;
  return kcalGap * 2 + proteinGap * 1.5 + carbGap + lowCarbGap * 0.5 + budgetGap * 3;
}

export function buildWeek(p: Profile, t: Targets): WeekPlan {
  const allowed = recipes.filter((r) => recipeAllowed(r, p));
  const breakfasts = allowed.filter((r) => r.meal === "petit-dej");
  const mains = allowed.filter((r) => r.meal === "plat");
  const empty: WeekPlan = { days: [], weekCostPerPerson: 0, shopping: [], shoppingTotal: 0 };

  if (breakfasts.length === 0 || mains.length < 2) {
    return { ...empty, error: "Pas encore assez de recettes pour cette combinaison de régime et d'allergies." };
  }

  // Toutes les journées possibles (petit-déj + déjeuner + dîner, avec ou sans collation),
  // mises à l'échelle des calories visées.
  const singles = allowed.filter((r) => r.meal === "collation");
  const snackSets: Recipe[][] = [[], ...singles.map((r) => [r]), ...singles.flatMap((a, i) => singles.slice(i + 1).map((b) => [a, b]))];
  const nutrition = new Map(allowed.map((r) => [r.id, recipeNutrition(r)]));
  const candidates: { day: DayPlan; score: number; key: string }[] = [];
  for (const b of breakfasts) {
    for (const l of mains) {
      for (const d of mains) {
        if (l.id >= d.id) continue;
        for (const extra of snackSets) {
          const meals = [b, l, d, ...extra];
          const base = meals.map((r) => nutrition.get(r.id)!).reduce(add);
          const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.kcal / base.kcal));
          const totals: Nutrition = {
            kcal: base.kcal * scale,
            protein: base.protein * scale,
            carbs: base.carbs * scale,
            fat: base.fat * scale,
            cost: base.cost * scale,
          };
          candidates.push({
            day: { meals: meals.map((recipe) => ({ recipe, scale })), totals },
            // Légère préférence pour les journées avec moins de collations.
            score: scoreDay(totals, t) + extra.length * 0.02,
            key: meals.map((r) => r.id).join("|"),
          });
        }
      }
    }
  }
  candidates.sort((a, b) => a.score - b.score);

  // 7 journées variées : un plat au plus 2 fois dans la semaine, si possible.
  const days: DayPlan[] = [];
  const used = new Map<string, number>();
  const picked = new Set<string>();
  for (const maxUse of [2, 3, 7]) {
    for (const c of candidates) {
      if (days.length === 7) break;
      if (picked.has(c.key)) continue;
      const plats = c.day.meals.filter((m) => m.recipe.meal === "plat").map((m) => m.recipe.id);
      if (plats.some((id) => (used.get(id) ?? 0) >= maxUse)) continue;
      days.push(c.day);
      picked.add(c.key);
      plats.forEach((id) => used.set(id, (used.get(id) ?? 0) + 1));
    }
  }
  while (days.length < 7) days.push(candidates[days.length % candidates.length].day);

  // Liste de courses du foyer pour la semaine.
  const grams = new Map<string, number>();
  for (const day of days) {
    for (const { recipe, scale } of day.meals) {
      for (const i of recipe.ingredients) grams.set(i.id, (grams.get(i.id) ?? 0) + i.grams * scale * p.people);
    }
  }
  const shopping: ShoppingItem[] = [...grams.entries()].map(([id, g]) => {
    const f = foodById[id];
    const packs = Math.ceil(g / f.packG);
    return { id, name: f.name, category: f.category, grams: g, packs, packLabel: f.packLabel, cost: packs * f.priceMad };
  });
  const order = Object.keys(categoryLabels);
  shopping.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name));

  return {
    days,
    weekCostPerPerson: days.reduce((s, d) => s + d.totals.cost, 0),
    shopping,
    shoppingTotal: shopping.reduce((s, i) => s + i.cost, 0),
  };
}
