import { foods } from "../foods";
import { MealType, Recipe } from "../recipes";

// Générateur pseudo-aléatoire déterministe (mulberry32).
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Jeu synthétique : recettes construites à partir des vrais produits.
export function syntheticRecipes(counts: Record<MealType, number>, seed = 42): Recipe[] {
  const rand = rng(seed);
  const out: Recipe[] = [];
  for (const [meal, n] of Object.entries(counts) as [MealType, number][]) {
    for (let i = 0; i < n; i++) {
      const k = meal === "collation" ? 1 : 2 + Math.floor(rand() * 3);
      const ids = new Set<string>();
      while (ids.size < k) ids.add(foods[Math.floor(rand() * foods.length)].id);
      out.push({
        id: `${meal}-${String(i).padStart(3, "0")}`,
        name: `${meal} ${i}`,
        meal,
        minutes: 20,
        ingredients: [...ids].map((id) => ({ id, grams: 40 + Math.floor(rand() * 200) })),
      });
    }
  }
  return out;
}
