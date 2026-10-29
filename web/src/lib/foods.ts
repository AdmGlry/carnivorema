// Prix relevés sur Bringo (Carrefour Hypermarket Maroc) le 28/10/2026.
// Valeurs nutritionnelles : moyennes des tables de référence, pour 100 g cru, glucides nets.
export const PRICE_DATE = "28/10/2026";
export const PRICE_SOURCE = "Carrefour Hypermarket (Bringo)";

export type Category =
  | "viande"
  | "volaille"
  | "poisson"
  | "oeuf"
  | "laitier"
  | "legume"
  | "fruit"
  | "epicerie"
  | "feculent"
  | "legumineuse";

export const categoryLabels: Record<Category, string> = {
  viande: "Boucherie",
  volaille: "Volaille",
  poisson: "Poissonnerie",
  oeuf: "Œufs",
  laitier: "Crémerie",
  legume: "Légumes",
  fruit: "Fruits",
  epicerie: "Épicerie",
  feculent: "Pâtes, riz & semoule",
  legumineuse: "Légumineuses",
};

export type Food = {
  id: string;
  name: string;
  category: Category;
  priceMad: number;
  packG: number;
  packLabel: string;
  // pour 100 g
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  gluten?: boolean;
  lactose?: boolean;
  promo?: string;
};

export const foods: Food[] = [
  { id: "hache", name: "Viande hachée de bœuf", category: "viande", priceMad: 54.95, packG: 500, packLabel: "500 g", kcal: 250, protein: 17, carbs: 0, fat: 20 },
  { id: "entrecote", name: "Entrecôte de bœuf", category: "viande", priceMad: 79.95, packG: 500, packLabel: "500 g", kcal: 200, protein: 21, carbs: 0, fat: 13, promo: "-2%" },
  { id: "tagine-os", name: "Tagine de bœuf avec os", category: "viande", priceMad: 47.45, packG: 500, packLabel: "500 g", kcal: 180, protein: 19, carbs: 0, fat: 11, promo: "-3%" },
  { id: "foie", name: "Foie de bœuf", category: "viande", priceMad: 46.73, packG: 250, packLabel: "250 g", kcal: 135, protein: 20, carbs: 4, fat: 4 },
  { id: "poulet", name: "Poulet entier", category: "volaille", priceMad: 49.9, packG: 1000, packLabel: "1 kg", kcal: 165, protein: 18, carbs: 0, fat: 10 },
  { id: "cuisse", name: "Haut de cuisse de poulet", category: "volaille", priceMad: 14.95, packG: 500, packLabel: "500 g", kcal: 180, protein: 17, carbs: 0, fat: 12 },
  { id: "filet-poulet", name: "Filet de poulet", category: "volaille", priceMad: 44.45, packG: 500, packLabel: "500 g", kcal: 110, protein: 23, carbs: 0, fat: 1.5 },
  { id: "merlan", name: "Merlan", category: "poisson", priceMad: 39.25, packG: 500, packLabel: "500 g", kcal: 80, protein: 18, carbs: 0, fat: 1 },
  { id: "calamar", name: "Lamelles de calamar", category: "poisson", priceMad: 34.25, packG: 500, packLabel: "500 g", kcal: 90, protein: 16, carbs: 3, fat: 1.5 },
  { id: "oeuf", name: "Œufs (plateau de 30)", category: "oeuf", priceMad: 33.5, packG: 1800, packLabel: "30 œufs", kcal: 140, protein: 12.5, carbs: 0.7, fat: 10, promo: "-24%" },
  { id: "beurre", name: "Beurre frais", category: "laitier", priceMad: 23.95, packG: 250, packLabel: "250 g", kcal: 745, protein: 0.7, carbs: 0.6, fat: 82 },
  { id: "gruyere", name: "Gruyère", category: "laitier", priceMad: 18.95, packG: 100, packLabel: "100 g", kcal: 400, protein: 28, carbs: 0, fat: 32 },
  { id: "kefir", name: "Kéfir nature", category: "laitier", priceMad: 29.25, packG: 500, packLabel: "500 g", kcal: 60, protein: 3.5, carbs: 4.5, fat: 3.5, lactose: true },
  { id: "tomate", name: "Tomate", category: "legume", priceMad: 4.48, packG: 500, packLabel: "500 g", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { id: "oignon", name: "Oignon", category: "legume", priceMad: 4.25, packG: 500, packLabel: "500 g", kcal: 40, protein: 1.1, carbs: 9, fat: 0.1 },
  { id: "carotte", name: "Carotte", category: "legume", priceMad: 2.13, packG: 250, packLabel: "250 g", kcal: 41, protein: 0.9, carbs: 7, fat: 0.2 },
  { id: "courgette", name: "Courgette", category: "legume", priceMad: 4.88, packG: 250, packLabel: "250 g", kcal: 17, protein: 1.2, carbs: 2.5, fat: 0.3 },
  { id: "navet", name: "Navet", category: "legume", priceMad: 5.49, packG: 250, packLabel: "250 g", kcal: 28, protein: 0.9, carbs: 5, fat: 0.1 },
  { id: "aubergine", name: "Aubergine", category: "legume", priceMad: 4.48, packG: 500, packLabel: "500 g", kcal: 25, protein: 1, carbs: 3, fat: 0.2 },
  { id: "haricot-vert", name: "Haricots verts", category: "legume", priceMad: 6.63, packG: 250, packLabel: "250 g", kcal: 31, protein: 1.8, carbs: 4, fat: 0.2 },
  { id: "pdt", name: "Pomme de terre", category: "legume", priceMad: 4.25, packG: 500, packLabel: "500 g", kcal: 77, protein: 2, carbs: 17, fat: 0.1 },
  { id: "avocat", name: "Avocat", category: "fruit", priceMad: 15.48, packG: 500, packLabel: "500 g", kcal: 160, protein: 2, carbs: 2, fat: 15 },
  { id: "banane", name: "Banane", category: "fruit", priceMad: 11.48, packG: 500, packLabel: "500 g", kcal: 89, protein: 1.1, carbs: 20, fat: 0.3 },
  { id: "clementine", name: "Clémentine", category: "fruit", priceMad: 1.99, packG: 250, packLabel: "250 g", kcal: 47, protein: 0.9, carbs: 10, fat: 0.2 },
  { id: "citron", name: "Citron jaune", category: "fruit", priceMad: 2.99, packG: 250, packLabel: "250 g", kcal: 29, protein: 1, carbs: 6, fat: 0.3 },
  { id: "riz", name: "Riz blanc", category: "feculent", priceMad: 8.9, packG: 400, packLabel: "400 g", kcal: 360, protein: 7, carbs: 79, fat: 0.6 },
  { id: "couscous", name: "Couscous moyen", category: "feculent", priceMad: 5.5, packG: 500, packLabel: "500 g", kcal: 360, protein: 12, carbs: 72, fat: 1.5, gluten: true },
  { id: "spaghetti", name: "Spaghetti", category: "feculent", priceMad: 9.25, packG: 500, packLabel: "500 g", kcal: 355, protein: 12.5, carbs: 71, fat: 1.5, gluten: true },
  { id: "lentilles", name: "Lentilles", category: "legumineuse", priceMad: 6.9, packG: 500, packLabel: "500 g", kcal: 350, protein: 25, carbs: 48, fat: 1.1 },
  { id: "haricot-blanc", name: "Haricots blancs", category: "legumineuse", priceMad: 10.95, packG: 500, packLabel: "500 g", kcal: 330, protein: 22, carbs: 45, fat: 1.5 },
  { id: "pois-chiche", name: "Pois chiches", category: "legumineuse", priceMad: 12.5, packG: 500, packLabel: "500 g", kcal: 360, protein: 19, carbs: 45, fat: 6 },
  { id: "feves", name: "Fèves cassées", category: "legumineuse", priceMad: 12.5, packG: 500, packLabel: "500 g", kcal: 340, protein: 26, carbs: 45, fat: 1.5 },

  // Ajouts du 29/10/2026 (sources : data/produits-sources-2026-10-28.csv)
  { id: "huile-olive", name: "Huile d'olive vierge extra", category: "epicerie", priceMad: 29.95, packG: 920, packLabel: "1 L", kcal: 900, protein: 0, carbs: 0, fat: 100 },
  { id: "huile-table", name: "Huile de table", category: "epicerie", priceMad: 16.9, packG: 920, packLabel: "1 L", kcal: 900, protein: 0, carbs: 0, fat: 100 },
  { id: "flocons-avoine", name: "Flocons d'avoine", category: "epicerie", priceMad: 15.75, packG: 500, packLabel: "500 g", kcal: 370, protein: 13.5, carbs: 58, fat: 7, gluten: true },
  { id: "amandes", name: "Amandes", category: "epicerie", priceMad: 27.9, packG: 200, packLabel: "200 g", kcal: 600, protein: 21, carbs: 7, fat: 52 },
  { id: "noix", name: "Noix décortiquées", category: "epicerie", priceMad: 32.9, packG: 200, packLabel: "200 g", kcal: 690, protein: 15, carbs: 7, fat: 65 },
  { id: "dattes", name: "Dattes", category: "epicerie", priceMad: 28.9, packG: 1000, packLabel: "1 kg", kcal: 280, protein: 2.5, carbs: 66, fat: 0.4 },
  { id: "miel", name: "Miel", category: "epicerie", priceMad: 29.95, packG: 250, packLabel: "250 g", kcal: 320, protein: 0.4, carbs: 80, fat: 0 },
  { id: "beurre-cacahuete", name: "Beurre de cacahuète", category: "epicerie", priceMad: 28.75, packG: 400, packLabel: "400 g", kcal: 600, protein: 25, carbs: 12, fat: 50 },
];

export const foodById: Record<string, Food> = Object.fromEntries(foods.map((f) => [f.id, f]));

export const pricePerKg = (f: Food) => (f.priceMad / f.packG) * 1000;

export const mad = (n: number) =>
  n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " MAD";
