import type { Metadata } from "next";
import Link from "next/link";
import { PRICE_DATE, PRICE_SOURCE, mad } from "@/lib/foods";
import { diets } from "@/lib/nutrition";
import { mealLabels, recipeNutrition, recipes } from "@/lib/recipes";
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
      cost: mad(n.cost),
      diets: ds.map((d) => d.id),
      dietLabels: ds.map((d) => d.name).join(", "),
      emojis: ds.map((d) => d.emoji).join(" "),
    };
  });
  const meals = (Object.keys(mealLabels) as (keyof typeof mealLabels)[])
    .filter((m) => recipes.some((r) => r.meal === m))
    .map((m) => ({ id: m, label: mealLabels[m] }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Accueil</Link> / <span aria-current="page">Recettes</span>
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        {recipes.length} recettes, chacune chiffrée ingrédient par ingrédient avec les prix {PRICE_SOURCE} du {PRICE_DATE}. Filtre par régime ou
        par repas.
      </p>
      <div className="mt-10">
        <RecipeFilter recipes={cards} diets={diets.map((d) => ({ id: d.id, label: d.name }))} meals={meals} />
      </div>
    </div>
  );
}
