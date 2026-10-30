// Prix de gros des fruits et légumes aux marchés de gros de Casablanca (données SDL Casa Prestations,
// relayées chaque semaine par la presse) et estimation du prix payé au souk ou chez le primeur.
export const WHOLESALE_DATE = "21/10/2026";
export const WHOLESALE_SOURCE = {
  label: "Marchés de gros de Casablanca (SDL Casa Prestations), via Médias24",
  url: "https://medias24.com/2026/10/21/marches-de-gros-a-casablanca-baisse-du-prix-minimum-de-la-viande-bovine-hausse-du-maximum-1782372/",
};

// Hypothèse de départ, à recalibrer avec les prix signalés par les utilisateurs :
// le prix de détail se situe entre 1,3 et 1,8 fois le prix de gros moyen.
export const MARKUP_LOW = 1.3;
export const MARKUP_HIGH = 1.8;
export const MARKUP_MID = (MARKUP_LOW + MARKUP_HIGH) / 2;

export type WholesaleItem = {
  slug: string;
  name: string;
  kind: "legume" | "fruit";
  min: number; // DH/kg
  max: number; // DH/kg
  foodId?: string; // produit correspondant dans le catalogue des recettes
};

export const wholesale: WholesaleItem[] = [
  { slug: "tomate", name: "Tomate", kind: "legume", min: 2.5, max: 7, foodId: "tomate" },
  { slug: "pomme-de-terre", name: "Pomme de terre", kind: "legume", min: 3.5, max: 6, foodId: "pdt" },
  { slug: "oignon-sec", name: "Oignon sec", kind: "legume", min: 3.5, max: 5.5, foodId: "oignon" },
  { slug: "oignon-frais", name: "Oignon frais", kind: "legume", min: 3, max: 4.5 },
  { slug: "carotte", name: "Carotte", kind: "legume", min: 2, max: 4.5, foodId: "carotte" },
  { slug: "courgette", name: "Courgette", kind: "legume", min: 4, max: 8, foodId: "courgette" },
  { slug: "aubergine", name: "Aubergine", kind: "legume", min: 3, max: 6, foodId: "aubergine" },
  { slug: "courge", name: "Courge", kind: "legume", min: 2, max: 5.5 },
  { slug: "concombre", name: "Concombre", kind: "legume", min: 3, max: 6 },
  { slug: "chou-fleur", name: "Chou-fleur", kind: "legume", min: 1.5, max: 3 },
  { slug: "chou-blanc", name: "Chou blanc", kind: "legume", min: 1.2, max: 2.3 },
  { slug: "orange", name: "Orange", kind: "fruit", min: 4, max: 6.5, foodId: "orange" },
  { slug: "clementine", name: "Clémentine", kind: "fruit", min: 3, max: 6, foodId: "clementine" },
  { slug: "banane-locale", name: "Banane locale", kind: "fruit", min: 9, max: 11, foodId: "banane" },
  { slug: "banane-importee", name: "Banane importée", kind: "fruit", min: 9, max: 14 },
  { slug: "pomme-locale", name: "Pomme locale", kind: "fruit", min: 5, max: 9, foodId: "pomme" },
  { slug: "pomme-importee", name: "Pomme importée", kind: "fruit", min: 12, max: 20 },
  { slug: "avocat", name: "Avocat", kind: "fruit", min: 15, max: 23, foodId: "avocat" },
  { slug: "raisin", name: "Raisin", kind: "fruit", min: 4, max: 9 },
  { slug: "grenade", name: "Grenade", kind: "fruit", min: 3, max: 6 },
];

const round = (n: number) => Math.round(n * 2) / 2;

/** Fourchette de prix estimée au souk, arrondie au demi-dirham. */
export function retailRange(w: WholesaleItem) {
  const mid = (w.min + w.max) / 2;
  return { low: round(mid * MARKUP_LOW), high: round(mid * MARKUP_HIGH), mid: mid * MARKUP_MID };
}

const byFood = new Map(wholesale.filter((w) => w.foodId).map((w) => [w.foodId!, w]));

/** Prix estimé au kilo au souk pour un produit du catalogue, ou undefined s'il n'est pas suivi. */
export function soukPricePerKg(foodId: string): number | undefined {
  const w = byFood.get(foodId);
  return w ? retailRange(w).mid : undefined;
}

export const productSlugs = new Set(wholesale.map((w) => w.slug));
