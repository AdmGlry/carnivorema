import { mad } from "@/lib/foods";
import { mealLabels, recipeNutrition, recipes } from "@/lib/recipes";
import { OG_SIZE, ogCard } from "../../_og/card";

export const alt = "Recette chiffrée : calories, protéines et coût par personne";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = recipes.find((x) => x.id === id);
  if (!r) return ogCard({ kicker: "Recette", title: "Recette introuvable", subtitle: "" });
  const n = recipeNutrition(r);
  return ogCard({
    kicker: `${mealLabels[r.meal]} · ${r.minutes} min`,
    title: r.name,
    subtitle: `${Math.round(n.kcal)} kcal · ${Math.round(n.protein)} g de protéines · ${mad(n.cost)} par personne`,
  });
}
