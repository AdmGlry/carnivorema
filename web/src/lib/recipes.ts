import { foodById } from "./foods";

export type MealType = "petit-dej" | "plat" | "collation";

export const mealLabels: Record<MealType, string> = { "petit-dej": "Petit-déjeuner", plat: "Plat", collation: "Collation" };

export type Recipe = {
  id: string;
  name: string;
  meal: MealType;
  minutes: number;
  // grammes crus par personne
  ingredients: { id: string; grams: number }[];
};

export const recipes: Recipe[] = [
  // Petits-déjeuners
  { id: "omelette", name: "Omelette au beurre", meal: "petit-dej", minutes: 10, ingredients: [{ id: "oeuf", grams: 180 }, { id: "beurre", grams: 10 }] },
  { id: "omelette-fromage", name: "Omelette au gruyère", meal: "petit-dej", minutes: 10, ingredients: [{ id: "oeuf", grams: 120 }, { id: "gruyere", grams: 30 }, { id: "beurre", grams: 5 }] },
  { id: "oeufs-avocat", name: "Œufs brouillés & avocat", meal: "petit-dej", minutes: 10, ingredients: [{ id: "oeuf", grams: 120 }, { id: "avocat", grams: 100 }] },
  { id: "kefir-banane", name: "Kéfir, banane & clémentine", meal: "petit-dej", minutes: 3, ingredients: [{ id: "kefir", grams: 250 }, { id: "banane", grams: 120 }, { id: "clementine", grams: 100 }] },
  { id: "bissara", name: "Bissara (soupe de fèves)", meal: "petit-dej", minutes: 40, ingredients: [{ id: "feves", grams: 80 }, { id: "citron", grams: 15 }] },

  // Collations
  { id: "oeufs-durs", name: "Œufs durs", meal: "collation", minutes: 10, ingredients: [{ id: "oeuf", grams: 120 }] },
  { id: "kefir", name: "Verre de kéfir", meal: "collation", minutes: 1, ingredients: [{ id: "kefir", grams: 250 }] },
  { id: "banane-clementine", name: "Banane & clémentine", meal: "collation", minutes: 1, ingredients: [{ id: "banane", grams: 150 }, { id: "clementine", grams: 100 }] },
  { id: "avocat", name: "Demi-avocat citronné", meal: "collation", minutes: 3, ingredients: [{ id: "avocat", grams: 150 }, { id: "citron", grams: 10 }] },
  { id: "gruyere", name: "Gruyère", meal: "collation", minutes: 1, ingredients: [{ id: "gruyere", grams: 40 }] },
  { id: "pois-chiches-grilles", name: "Pois chiches grillés", meal: "collation", minutes: 30, ingredients: [{ id: "pois-chiche", grams: 50 }] },

  // Plats
  { id: "kefta-salade", name: "Kefta grillée & salade de tomates", meal: "plat", minutes: 20, ingredients: [{ id: "hache", grams: 180 }, { id: "tomate", grams: 120 }, { id: "oignon", grams: 40 }] },
  { id: "steak-oeuf", name: "Steak haché & œuf au plat", meal: "plat", minutes: 15, ingredients: [{ id: "hache", grams: 180 }, { id: "oeuf", grams: 60 }] },
  { id: "entrecote-beurre", name: "Entrecôte au beurre", meal: "plat", minutes: 15, ingredients: [{ id: "entrecote", grams: 220 }, { id: "beurre", grams: 10 }] },
  { id: "entrecote-hv", name: "Entrecôte & haricots verts", meal: "plat", minutes: 20, ingredients: [{ id: "entrecote", grams: 200 }, { id: "haricot-vert", grams: 150 }, { id: "beurre", grams: 10 }] },
  { id: "tagine-boeuf", name: "Tagine de bœuf aux légumes", meal: "plat", minutes: 120, ingredients: [{ id: "tagine-os", grams: 250 }, { id: "pdt", grams: 150 }, { id: "carotte", grams: 100 }, { id: "oignon", grams: 50 }] },
  { id: "foie-poele", name: "Foie de bœuf poêlé", meal: "plat", minutes: 10, ingredients: [{ id: "foie", grams: 160 }, { id: "beurre", grams: 10 }] },
  { id: "tagine-kefta-oeufs", name: "Tagine kefta aux œufs", meal: "plat", minutes: 35, ingredients: [{ id: "hache", grams: 150 }, { id: "oeuf", grams: 60 }, { id: "tomate", grams: 150 }, { id: "oignon", grams: 40 }] },
  { id: "bolognaise", name: "Spaghetti bolognaise", meal: "plat", minutes: 30, ingredients: [{ id: "spaghetti", grams: 100 }, { id: "hache", grams: 120 }, { id: "tomate", grams: 150 }, { id: "oignon", grams: 30 }] },
  { id: "cuisses-roties", name: "Hauts de cuisse rôtis", meal: "plat", minutes: 40, ingredients: [{ id: "cuisse", grams: 300 }] },
  { id: "cuisses-courgettes", name: "Hauts de cuisse & courgettes sautées", meal: "plat", minutes: 35, ingredients: [{ id: "cuisse", grams: 250 }, { id: "courgette", grams: 200 }] },
  { id: "poulet-roti", name: "Poulet rôti", meal: "plat", minutes: 75, ingredients: [{ id: "poulet", grams: 350 }] },
  { id: "tagine-poulet", name: "Tagine de poulet aux légumes", meal: "plat", minutes: 60, ingredients: [{ id: "cuisse", grams: 250 }, { id: "pdt", grams: 150 }, { id: "carotte", grams: 100 }, { id: "oignon", grams: 50 }] },
  { id: "poulet-riz", name: "Filet de poulet, riz & courgettes", meal: "plat", minutes: 25, ingredients: [{ id: "filet-poulet", grams: 180 }, { id: "riz", grams: 80 }, { id: "courgette", grams: 150 }] },
  { id: "couscous-poulet", name: "Couscous au poulet & 7 légumes", meal: "plat", minutes: 90, ingredients: [{ id: "couscous", grams: 90 }, { id: "cuisse", grams: 150 }, { id: "courgette", grams: 100 }, { id: "carotte", grams: 100 }, { id: "navet", grams: 80 }, { id: "pois-chiche", grams: 30 }] },
  { id: "merlan-pdt", name: "Merlan au four & pommes de terre", meal: "plat", minutes: 35, ingredients: [{ id: "merlan", grams: 200 }, { id: "pdt", grams: 200 }, { id: "tomate", grams: 80 }, { id: "citron", grams: 20 }] },
  { id: "merlan-beurre", name: "Merlan poêlé au beurre", meal: "plat", minutes: 15, ingredients: [{ id: "merlan", grams: 220 }, { id: "beurre", grams: 15 }] },
  { id: "calamars", name: "Calamars à la plancha & citron", meal: "plat", minutes: 10, ingredients: [{ id: "calamar", grams: 220 }, { id: "citron", grams: 20 }, { id: "tomate", grams: 100 }] },
  { id: "zaalouk-oeufs", name: "Zaalouk & œufs", meal: "plat", minutes: 40, ingredients: [{ id: "aubergine", grams: 200 }, { id: "tomate", grams: 100 }, { id: "oeuf", grams: 120 }] },
  { id: "lentilles", name: "Lentilles à la marocaine", meal: "plat", minutes: 45, ingredients: [{ id: "lentilles", grams: 90 }, { id: "tomate", grams: 100 }, { id: "carotte", grams: 80 }, { id: "oignon", grams: 50 }] },
  { id: "loubia", name: "Loubia (haricots blancs)", meal: "plat", minutes: 60, ingredients: [{ id: "haricot-blanc", grams: 90 }, { id: "tomate", grams: 120 }, { id: "oignon", grams: 40 }] },
  { id: "tagine-legumes", name: "Tagine de légumes & pois chiches", meal: "plat", minutes: 50, ingredients: [{ id: "pois-chiche", grams: 80 }, { id: "courgette", grams: 150 }, { id: "carotte", grams: 100 }, { id: "pdt", grams: 100 }] },
  { id: "harira", name: "Harira végétale", meal: "plat", minutes: 60, ingredients: [{ id: "lentilles", grams: 50 }, { id: "pois-chiche", grams: 40 }, { id: "tomate", grams: 150 }, { id: "oignon", grams: 40 }, { id: "citron", grams: 10 }] },
  { id: "riz-legumes", name: "Riz sauté aux légumes & haricots", meal: "plat", minutes: 30, ingredients: [{ id: "riz", grams: 70 }, { id: "haricot-blanc", grams: 50 }, { id: "courgette", grams: 100 }, { id: "carotte", grams: 80 }] },
  { id: "omelette-legumes", name: "Omelette aux légumes", meal: "plat", minutes: 15, ingredients: [{ id: "oeuf", grams: 180 }, { id: "courgette", grams: 100 }, { id: "tomate", grams: 80 }] },
  { id: "couscous-legumes", name: "Couscous aux 7 légumes", meal: "plat", minutes: 75, ingredients: [{ id: "couscous", grams: 100 }, { id: "pois-chiche", grams: 50 }, { id: "courgette", grams: 120 }, { id: "carotte", grams: 100 }, { id: "navet", grams: 80 }] },
];

export type Nutrition = { kcal: number; protein: number; carbs: number; fat: number; cost: number };

export function recipeNutrition(r: Recipe, scale = 1): Nutrition {
  return r.ingredients.reduce(
    (acc, { id, grams }) => {
      const f = foodById[id];
      const g = (grams * scale) / 100;
      acc.kcal += f.kcal * g;
      acc.protein += f.protein * g;
      acc.carbs += f.carbs * g;
      acc.fat += f.fat * g;
      acc.cost += (f.priceMad / f.packG) * grams * scale;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, cost: 0 },
  );
}
