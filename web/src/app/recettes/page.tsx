import type { Metadata } from "next";
import Link from "next/link";
import { PRICE_DATE, PRICE_SOURCE, foodById, mad } from "@/lib/foods";
import { diets } from "@/lib/nutrition";
import { equipmentLabels, mealLabels, recipeNutrition, recipes, tagLabels } from "@/lib/recipes";
import { compatibleDiets, round } from "../_site";
import RecipeFilter, { RecipeCard } from "./RecipeFilter";

const title = "Recettes chiffrées pour tous les régimes";
const description = `${recipes.length} recettes avec calories, protéines et coût par personne au prix réel des supermarchés marocains : équilibré, méditerranéen, végétarien, végan, cétogène, carnivore…`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/recettes" },
  openGraph: { title, description, url: "/recettes" },
};

export default function RecipesPage() {
  // Tout est calculé ici, côté serveur : le client ne reçoit que des données simples (sérialisables).
  const cards: RecipeCard[] = recipes.map((r) => {
    const n = recipeNutrition(r);
    const ds = compatibleDiets(r);
    return {
      id: r.id,
      name: r.name,
      meal: r.meal,
      mealLabel: mealLabels[r.meal],
      minutes: r.minutes,
      kcal: round(n.kcal),
      protein: round(n.protein),
      carbs: round(n.carbs),
      fat: round(n.fat),
      cost: mad(n.cost),
      costValue: Math.round(n.cost * 100) / 100,
      diets: ds.map((d) => d.id),
      dietLabels: ds.map((d) => d.name).join(", "),
      emojis: ds.map((d) => d.emoji).join(" "),
      tags: r.tags ?? [],
      tagLabels: (r.tags ?? []).map((t) => tagLabels[t]),
      equipment: r.equipment ?? [],
      equipmentLabels: (r.equipment ?? []).map((e) => equipmentLabels[e]),
      ingredients: r.ingredients.map((i) => foodById[i.id]?.name ?? i.id),
    };
  });
  const meals = (Object.keys(mealLabels) as (keyof typeof mealLabels)[])
    .filter((m) => recipes.some((r) => r.meal === m))
    .map((m) => ({ id: m, label: mealLabels[m] }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Accueil</Link> / <span aria-current="page">Recettes</span>
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        {recipes.length} recettes, chacune chiffrée ingrédient par ingrédient avec les prix {PRICE_SOURCE} du {PRICE_DATE}. Filtre, trie, ou laisse le
        hasard choisir pour toi.
      </p>
      <div className="mt-8">
        <RecipeFilter recipes={cards} diets={diets.map((d) => ({ id: d.id, label: `${d.emoji} ${d.name}` }))} meals={meals} />
      </div>
    </div>
  );
}
