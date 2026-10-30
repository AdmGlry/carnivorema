import { Category, categoryLabels, foodById } from "./foods";
import { Profile, STUDENT_MAX_MINUTES, Targets, dietById, recipeAllowed } from "./nutrition";
import { Nutrition, Recipe, recipeNutrition, recipes } from "./recipes";
import { soukPricePerKg } from "./souk";

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
  // Acheté au poids au souk : quantité arrondie au quart de kilo.
  soukKg?: number;
};

const MIN_SCALE = 0.6;
const MAX_SCALE = 2;
// Au-delà de ce facteur, on préfère ajouter une collation plutôt que grossir les portions.
const COMFORT_SCALE = 1.4;

// Présélection : nombre de recettes gardées par type de repas avant de combiner.
const K_BREAKFAST = 8;
const K_MAIN = 20;
const K_SNACK = 8;

// Part des calories de la journée attendue pour chaque type de repas.
const SHARE = { "petit-dej": 0.25, plat: 0.35, collation: 0.12 } as const;

type Weights = { protein: number };

// Féculents : ils comptent pour l'assiette complète, pas comme légumes.
const STARCHES = new Set(["riz", "couscous", "spaghetti", "quinoa", "semoule", "pain-mie", "pdt", "patate-douce", "flocons-avoine"]);

// La recette demande-t-elle un four ? Sans champ equipment, on le devine à partir des étapes
// (« au four », « Préchauffe »… mais pas « fourchette »).
export function needsOven(r: Recipe) {
  if (r.equipment) return r.equipment.includes("four");
  return r.steps.some((s) => /\bfours?\b|préchauff/i.test(s));
}

// Mode étudiant : forte pénalité au-delà de 20 min ou avec un four, petit bonus aux recettes étiquetées.
function studentPenalty(r: Recipe) {
  let pen = 0;
  if (r.minutes > STUDENT_MAX_MINUTES) pen += 1 + (r.minutes - STUDENT_MAX_MINUTES) / 30;
  if (needsOven(r)) pen += 1.5;
  if (!r.tags?.includes("etudiant")) pen += 0.05;
  return pen;
}

// Pénalité d'une recette : on préfère les assiettes complètes (légumes + féculent ou légumineuses)
// et les recettes rapides, sans exclure les plats mijotés.
function recipePenalty(r: Recipe, p: Profile) {
  let pen = (Math.max(0, r.minutes - 30) / 60) * 0.3;
  if (p.kitchen === "etudiant") pen += studentPenalty(r);
  if (r.meal !== "plat" || p.diet === "carnivore") return pen;
  const veg = r.ingredients.reduce((g, i) => (foodById[i.id].category === "legume" && !STARCHES.has(i.id) ? g + i.grams : g), 0);
  if (veg < 100) pen += veg < 50 ? 0.3 : 0.15;
  const base = r.ingredients.some((i) => STARCHES.has(i.id) || foodById[i.id].category === "legumineuse");
  if (!base && dietById[p.diet].maxCarbs === undefined) pen += 0.15;
  return pen;
}

function add(a: Nutrition, b: Nutrition): Nutrition {
  return { kcal: a.kcal + b.kcal, protein: a.protein + b.protein, carbs: a.carbs + b.carbs, fat: a.fat + b.fat, cost: a.cost + b.cost };
}

function scaleNutrition(n: Nutrition, s: number): Nutrition {
  return { kcal: n.kcal * s, protein: n.protein * s, carbs: n.carbs * s, fat: n.fat * s, cost: n.cost * s };
}

function clampScale(targetKcal: number, kcal: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetKcal / kcal));
}

function weightsFor(p: Profile): Weights {
  // Protéines prioritaires pour le régime riche en protéines et quand on perd ou prend du poids.
  return { protein: p.diet === "proteine" || p.goal !== "maintenir" ? 3 : 1.5 };
}

function scoreDay(n: Nutrition, t: Targets, w: Weights) {
  const kcalGap = Math.abs(n.kcal - t.kcal) / t.kcal;
  const proteinGap = Math.max(0, t.protein - n.protein) / t.protein;
  const carbGap = Math.max(0, n.carbs - t.carbs) / Math.max(t.carbs, 30);
  // Pour les régimes non plafonnés, on évite aussi une journée trop pauvre en glucides.
  const lowCarbGap = Math.max(0, t.carbs * 0.6 - n.carbs) / Math.max(t.carbs, 30);
  const budgetGap = Math.max(0, n.cost - t.dailyBudgetPerPerson) / t.dailyBudgetPerPerson;
  return kcalGap * 2 + proteinGap * w.protein + carbGap + lowCarbGap * 0.5 + budgetGap * 3;
}

// Garde les k recettes qui, seules et ramenées à leur part de calories, collent le mieux aux objectifs.
function preselect(list: Recipe[], k: number, nutrition: Map<string, Nutrition>, t: Targets, w: Weights, penalty: (r: Recipe) => number): Recipe[] {
  if (list.length <= k) return list;
  const scored = list.map((r) => {
    const share = SHARE[r.meal];
    const part: Targets = { ...t, kcal: t.kcal * share, protein: t.protein * share, carbs: t.carbs * share, dailyBudgetPerPerson: t.dailyBudgetPerPerson * share };
    const n = nutrition.get(r.id)!;
    return { r, score: scoreDay(scaleNutrition(n, clampScale(part.kcal, n.kcal)), part, w) + penalty(r) };
  });
  scored.sort((a, b) => a.score - b.score || a.r.id.localeCompare(b.r.id));
  return scored.slice(0, k).map((s) => s.r);
}

export function buildWeek(p: Profile, t: Targets, pool: Recipe[] = recipes): WeekPlan {
  const allowed = pool.filter((r) => recipeAllowed(r, p));
  const empty: WeekPlan = { days: [], weekCostPerPerson: 0, shopping: [], shoppingTotal: 0 };
  if (allowed.filter((r) => r.meal === "petit-dej").length === 0 || allowed.filter((r) => r.meal === "plat").length < 2) {
    return { ...empty, error: "Pas encore assez de recettes pour cette combinaison de régime et d'allergies." };
  }

  const w = weightsFor(p);
  const nutrition = new Map(allowed.map((r) => [r.id, recipeNutrition(r, 1, p.produce)]));
  const byId = (a: Recipe, b: Recipe) => a.id.localeCompare(b.id);
  const penalty = (r: Recipe) => recipePenalty(r, p);
  const breakfasts = preselect(allowed.filter((r) => r.meal === "petit-dej"), K_BREAKFAST, nutrition, t, w, penalty).sort(byId);
  const mains = preselect(allowed.filter((r) => r.meal === "plat"), K_MAIN, nutrition, t, w, penalty).sort(byId);
  const singles = preselect(allowed.filter((r) => r.meal === "collation"), K_SNACK, nutrition, t, w, penalty).sort(byId);
  const snackSets: Recipe[][] = [[], ...singles.map((r) => [r]), ...singles.flatMap((a, i) => singles.slice(i + 1).map((b) => [a, b]))];

  const nb = breakfasts.map((r) => nutrition.get(r.id)!);
  const nm = mains.map((r) => nutrition.get(r.id)!);
  const pb = breakfasts.map(penalty);
  const pm = mains.map(penalty);
  const ps = snackSets.map((set) => set.reduce((x, r) => x + penalty(r), 0));
  const ns = snackSets.map((set) => set.map((r) => nutrition.get(r.id)!).reduce(add, { kcal: 0, protein: 0, carbs: 0, fat: 0, cost: 0 }));

  // Toutes les journées possibles (petit-déj + déjeuner + dîner + 0 à 2 collations), mises à l'échelle
  // des calories visées. On ne garde que des indices pour rester rapide.
  type Candidate = { b: number; l: number; d: number; s: number; scale: number; score: number; kcalGap: number };
  const candidates: Candidate[] = [];
  for (let b = 0; b < nb.length; b++) {
    for (let l = 0; l < nm.length; l++) {
      for (let d = l + 1; d < nm.length; d++) {
        const meal = add(add(nb[b], nm[l]), nm[d]);
        for (let s = 0; s < ns.length; s++) {
          const base = add(meal, ns[s]);
          const scale = clampScale(t.kcal, base.kcal);
          const kcalGap = Math.abs(base.kcal * scale - t.kcal) / t.kcal;
          const score =
            scoreDay(scaleNutrition(base, scale), t, w) +
            // Légère préférence pour les journées avec moins de collations et des portions raisonnables.
            snackSets[s].length * 0.02 +
            Math.max(0, scale - COMFORT_SCALE) * 0.15 +
            // Assiettes complètes et recettes rapides.
            (pb[b] + pm[l] + pm[d] + ps[s]) * 0.7;
          candidates.push({ b, l, d, s, scale, score, kcalGap });
        }
      }
    }
  }
  // Tri déterministe : à score égal, ordre des indices (eux-mêmes triés par identifiant).
  candidates.sort((x, y) => x.score - y.score || x.b - y.b || x.l - y.l || x.d - y.d || x.s - y.s);

  // 7 journées variées : un plat au plus 2 fois, un petit-déj ou une collation au plus 3 fois, si possible.
  // Une journée qui manque sa cible calorique de plus de 3 % n'est retenue qu'en dernier recours.
  const chosen: Candidate[] = [];
  const picked = new Set<Candidate>();
  const usedMain = new Map<number, number>();
  const usedBreakfast = new Map<number, number>();
  const usedSnack = new Map<string, number>();
  const caps = [
    { main: 2, other: 3, maxGap: 0.03 },
    { main: 3, other: 4, maxGap: 0.03 },
    { main: 7, other: 7, maxGap: Infinity },
  ];
  for (const cap of caps) {
    for (const c of candidates) {
      if (chosen.length === 7) break;
      if (picked.has(c) || c.kcalGap > cap.maxGap) continue;
      const snackIds = snackSets[c.s].map((r) => r.id);
      if ((usedMain.get(c.l) ?? 0) >= cap.main || (usedMain.get(c.d) ?? 0) >= cap.main) continue;
      if ((usedBreakfast.get(c.b) ?? 0) >= cap.other) continue;
      if (snackIds.some((id) => (usedSnack.get(id) ?? 0) >= cap.other)) continue;
      chosen.push(c);
      picked.add(c);
      usedMain.set(c.l, (usedMain.get(c.l) ?? 0) + 1);
      usedMain.set(c.d, (usedMain.get(c.d) ?? 0) + 1);
      usedBreakfast.set(c.b, (usedBreakfast.get(c.b) ?? 0) + 1);
      snackIds.forEach((id) => usedSnack.set(id, (usedSnack.get(id) ?? 0) + 1));
    }
  }
  while (chosen.length < 7) chosen.push(candidates[chosen.length % candidates.length]);

  const days: DayPlan[] = chosen.map((c) => {
    const meals = [breakfasts[c.b], mains[c.l], mains[c.d], ...snackSets[c.s]];
    const totals = scaleNutrition(meals.map((r) => nutrition.get(r.id)!).reduce(add), c.scale);
    return { meals: meals.map((recipe) => ({ recipe, scale: c.scale })), totals };
  });

  // Liste de courses du foyer pour la semaine.
  const grams = new Map<string, number>();
  for (const day of days) {
    for (const { recipe, scale } of day.meals) {
      for (const i of recipe.ingredients) grams.set(i.id, (grams.get(i.id) ?? 0) + i.grams * scale * p.people);
    }
  }
  const shopping: ShoppingItem[] = [...grams.entries()].map(([id, g]) => {
    const f = foodById[id];
    const souk = p.produce === "souk" ? soukPricePerKg(id) : undefined;
    if (souk !== undefined) {
      // Au souk, on achète au poids : arrondi au quart de kilo.
      const kg = Math.max(0.25, Math.ceil(g / 250) / 4);
      return { id, name: f.name, category: f.category, grams: g, packs: 1, packLabel: "", cost: kg * souk, soukKg: kg };
    }
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
