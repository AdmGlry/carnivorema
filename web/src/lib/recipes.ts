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
  // étapes de préparation, dans l'ordre
  steps: string[];
};

export const recipes: Recipe[] = [
  // Petits-déjeuners
  { id: "omelette", name: "Omelette au beurre", meal: "petit-dej", minutes: 10, ingredients: [{ id: "oeuf", grams: 180 }, { id: "beurre", grams: 10 }], steps: ["Casse les œufs dans un bol, sale, poivre et bats-les à la fourchette.", "Fais fondre le beurre dans une poêle à feu moyen.", "Verse les œufs et laisse prendre 2 à 3 minutes en ramenant les bords vers le centre.", "Plie l'omelette en deux et sers aussitôt."] },
  { id: "omelette-fromage", name: "Omelette au gruyère", meal: "petit-dej", minutes: 10, ingredients: [{ id: "oeuf", grams: 120 }, { id: "gruyere", grams: 30 }, { id: "beurre", grams: 5 }], steps: ["Râpe ou coupe le gruyère en petits dés.", "Bats les œufs avec une pincée de sel et de poivre.", "Fais fondre le beurre dans une poêle, verse les œufs et laisse prendre 2 minutes.", "Parsème le fromage, plie l'omelette et laisse fondre 1 minute avant de servir."] },
  { id: "oeufs-avocat", name: "Œufs brouillés & avocat", meal: "petit-dej", minutes: 10, ingredients: [{ id: "oeuf", grams: 120 }, { id: "avocat", grams: 100 }], steps: ["Coupe l'avocat en deux, retire le noyau et tranche la chair.", "Bats les œufs avec sel, poivre et une pincée de cumin.", "Fais-les cuire à feu doux en remuant sans arrêt jusqu'à ce qu'ils soient crémeux.", "Sers les œufs brouillés avec les tranches d'avocat."] },
  { id: "kefir-banane", name: "Kéfir, banane & clémentine", meal: "petit-dej", minutes: 3, ingredients: [{ id: "kefir", grams: 250 }, { id: "banane", grams: 120 }, { id: "clementine", grams: 100 }], steps: ["Épluche la banane et coupe-la en rondelles.", "Épluche la clémentine et sépare les quartiers.", "Verse le kéfir dans un bol et ajoute les fruits."] },
  { id: "bissara", name: "Bissara (soupe de fèves)", meal: "petit-dej", minutes: 40, ingredients: [{ id: "feves", grams: 80 }, { id: "citron", grams: 15 }], steps: ["Rince les fèves cassées et mets-les dans une casserole avec 3 fois leur volume d'eau et une gousse d'ail.", "Fais cuire 30 à 35 minutes à feu moyen jusqu'à ce qu'elles soient fondantes.", "Mixe en soupe lisse en ajoutant un peu d'eau si besoin ; sale.", "Sers chaud avec un filet d'huile d'olive, du cumin, du paprika et un trait de citron."] },

  // Collations
  { id: "oeufs-durs", name: "Œufs durs", meal: "collation", minutes: 10, ingredients: [{ id: "oeuf", grams: 120 }], steps: ["Plonge les œufs dans une casserole d'eau bouillante.", "Laisse cuire 9 à 10 minutes.", "Refroidis-les sous l'eau froide, écale-les et sale légèrement avec du cumin."] },
  { id: "kefir", name: "Verre de kéfir", meal: "collation", minutes: 1, ingredients: [{ id: "kefir", grams: 250 }], steps: ["Sers le kéfir bien frais dans un verre.", "Ajoute une pincée de cannelle si tu aimes.", "Bois-le en collation, seul ou avec un fruit."] },
  { id: "banane-clementine", name: "Banane & clémentine", meal: "collation", minutes: 1, ingredients: [{ id: "banane", grams: 150 }, { id: "clementine", grams: 100 }], steps: ["Épluche la banane et la clémentine.", "Coupe la banane en rondelles et sépare les quartiers de clémentine.", "Mange tel quel ou en petite salade de fruits."] },
  { id: "avocat", name: "Demi-avocat citronné", meal: "collation", minutes: 3, ingredients: [{ id: "avocat", grams: 150 }, { id: "citron", grams: 10 }], steps: ["Coupe l'avocat en deux et retire le noyau.", "Arrose la chair de jus de citron.", "Sale, poivre et ajoute une pincée de paprika ou de piment."] },
  { id: "gruyere", name: "Gruyère", meal: "collation", minutes: 1, ingredients: [{ id: "gruyere", grams: 40 }], steps: ["Sors le gruyère du réfrigérateur 15 minutes avant.", "Coupe-le en bâtonnets ou en dés.", "Sers-le à température ambiante pour plus de goût."] },
  { id: "pois-chiches-grilles", name: "Pois chiches grillés", meal: "collation", minutes: 30, ingredients: [{ id: "pois-chiche", grams: 50 }], steps: ["Fais tremper les pois chiches une nuit, puis cuis-les 20 minutes à l'eau et égoutte-les.", "Sèche-les bien dans un torchon.", "Mélange-les avec un filet d'huile, du sel, du cumin et du paprika.", "Fais-les griller 25 à 30 minutes au four à 200 °C en remuant à mi-cuisson."] },

  // Plats
  { id: "kefta-salade", name: "Kefta grillée & salade de tomates", meal: "plat", minutes: 20, ingredients: [{ id: "hache", grams: 180 }, { id: "tomate", grams: 120 }, { id: "oignon", grams: 40 }], steps: ["Mélange la viande hachée avec un peu d'oignon râpé, du persil, de la coriandre, du cumin, du paprika, du sel et du poivre.", "Façonne des boulettes allongées ou des brochettes.", "Grille-les 8 à 10 minutes à la poêle ou au gril en les retournant.", "Coupe les tomates et le reste de l'oignon en dés, assaisonne d'huile d'olive, sel et cumin.", "Sers la kefta avec la salade de tomates."] },
  { id: "steak-oeuf", name: "Steak haché & œuf au plat", meal: "plat", minutes: 15, ingredients: [{ id: "hache", grams: 180 }, { id: "oeuf", grams: 60 }], steps: ["Façonne la viande hachée en steak, sale et poivre.", "Saisis-le 3 à 4 minutes par face dans une poêle bien chaude.", "Dans la même poêle, fais cuire l'œuf au plat 2 à 3 minutes.", "Sers le steak surmonté de l'œuf."] },
  { id: "entrecote-beurre", name: "Entrecôte au beurre", meal: "plat", minutes: 15, ingredients: [{ id: "entrecote", grams: 220 }, { id: "beurre", grams: 10 }], steps: ["Sors l'entrecôte du réfrigérateur 20 minutes avant la cuisson.", "Saisis-la dans une poêle très chaude 2 à 4 minutes par face selon la cuisson voulue.", "Ajoute le beurre en fin de cuisson et arrose la viande avec.", "Laisse reposer 3 minutes, sale, poivre et tranche."] },
  { id: "entrecote-hv", name: "Entrecôte & haricots verts", meal: "plat", minutes: 20, ingredients: [{ id: "entrecote", grams: 200 }, { id: "haricot-vert", grams: 150 }, { id: "beurre", grams: 10 }], steps: ["Équeute les haricots verts et fais-les cuire 8 à 10 minutes à l'eau bouillante salée.", "Saisis l'entrecôte 2 à 4 minutes par face dans une poêle très chaude.", "Laisse reposer la viande 3 minutes.", "Fais revenir les haricots égouttés 2 minutes dans le beurre et sers avec la viande tranchée."] },
  { id: "tagine-boeuf", name: "Tagine de bœuf aux légumes", meal: "plat", minutes: 120, ingredients: [{ id: "tagine-os", grams: 250 }, { id: "pdt", grams: 150 }, { id: "carotte", grams: 100 }, { id: "oignon", grams: 50 }], steps: ["Fais revenir la viande avec l'oignon émincé, un filet d'huile, du gingembre, du curcuma, du sel et du poivre.", "Couvre d'eau à hauteur et laisse mijoter à couvert environ 1 h 15.", "Épluche les pommes de terre et les carottes et coupe-les en quartiers.", "Ajoute les légumes sur la viande et poursuis la cuisson 30 à 40 minutes.", "Parsème de coriandre ciselée avant de servir."] },
  { id: "foie-poele", name: "Foie de bœuf poêlé", meal: "plat", minutes: 10, ingredients: [{ id: "foie", grams: 160 }, { id: "beurre", grams: 10 }], steps: ["Coupe le foie en tranches fines ou en dés.", "Fais chauffer le beurre dans une poêle à feu vif.", "Saisis le foie 1 à 2 minutes par face pour qu'il reste tendre.", "Sale, poivre et ajoute une pincée de cumin et de paprika en fin de cuisson."] },
  { id: "tagine-kefta-oeufs", name: "Tagine kefta aux œufs", meal: "plat", minutes: 35, ingredients: [{ id: "hache", grams: 150 }, { id: "oeuf", grams: 60 }, { id: "tomate", grams: 150 }, { id: "oignon", grams: 40 }], steps: ["Mélange la viande hachée avec persil, coriandre, cumin, paprika, sel et poivre, puis forme de petites boulettes.", "Fais revenir l'oignon émincé avec un filet d'huile, puis ajoute les tomates râpées et laisse réduire 10 minutes.", "Dépose les boulettes dans la sauce, couvre et laisse cuire 15 minutes.", "Casse les œufs sur le dessus, couvre et laisse cuire 5 minutes jusqu'à ce que les blancs soient pris."] },
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
