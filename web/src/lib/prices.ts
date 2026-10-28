// Prix relevés sur Bringo (Carrefour Hypermarket Maroc) le 28/10/2026.
// Source brute : data/bringo-carrefour-boucherie-2026-10-28.csv
export const PRICE_DATE = "28/10/2026";

export type Product = {
  id: string;
  name: string;
  store: string;
  priceMad: number;
  weightKg: number;
  promo?: string;
};

export const products: Product[] = [
  { id: "hache", name: "Viande hachée de bœuf (avec graisse)", store: "Carrefour", priceMad: 54.95, weightKg: 0.5 },
  { id: "entrecote", name: "Entrecôte de bœuf", store: "Carrefour", priceMad: 79.95, weightKg: 0.5, promo: "-2%" },
  { id: "tagine-os", name: "Tagine de bœuf avec os", store: "Carrefour", priceMad: 47.45, weightKg: 0.5, promo: "-3%" },
  { id: "tagine-sans-os", name: "Tagine de bœuf sans os", store: "Carrefour", priceMad: 74.95, weightKg: 0.5 },
  { id: "collier", name: "Collier de bœuf", store: "Carrefour", priceMad: 57.45, weightKg: 0.5 },
  { id: "plat-cote", name: "Plat de côte de bœuf", store: "Carrefour", priceMad: 50.95, weightKg: 0.5 },
  { id: "jarret", name: "Jarret de bœuf à os", store: "Carrefour", priceMad: 59.95, weightKg: 0.5 },
  { id: "foie", name: "Foie de bœuf", store: "Carrefour", priceMad: 46.73, weightKg: 0.25 },
  { id: "merguez", name: "Merguez de bœuf", store: "Carrefour", priceMad: 44.95, weightKg: 0.5, promo: "-7%" },
  { id: "graisse", name: "Graisse de bœuf", store: "Carrefour", priceMad: 10.95, weightKg: 0.5 },
  { id: "cotelettes", name: "Côtelettes d'agneau", store: "Carrefour", priceMad: 206.9, weightKg: 1 },
  { id: "gigot", name: "Gigot d'agneau tranché", store: "Carrefour", priceMad: 99.95, weightKg: 0.5 },
  { id: "poulet", name: "Poulet entier", store: "Carrefour", priceMad: 49.9, weightKg: 1 },
];

const byId = Object.fromEntries(products.map((p) => [p.id, p]));

export const pricePerKg = (p: Product) => p.priceMad / p.weightKg;

export type Recipe = {
  name: string;
  tag: string;
  minutes: number;
  // grammes par personne
  ingredients: { id: string; grams: number }[];
};

export const recipes: Recipe[] = [
  { name: "Kefta grillée", tag: "Express", minutes: 20, ingredients: [{ id: "hache", grams: 200 }] },
  { name: "Poulet rôti entier", tag: "Familial", minutes: 75, ingredients: [{ id: "poulet", grams: 350 }] },
  { name: "Merguez au feu de bois", tag: "Barbecue", minutes: 15, ingredients: [{ id: "merguez", grams: 200 }] },
  { name: "Tagine de bœuf à l'os", tag: "Mijoté", minutes: 120, ingredients: [{ id: "tagine-os", grams: 300 }] },
  { name: "Foie de bœuf poêlé", tag: "Abats", minutes: 10, ingredients: [{ id: "foie", grams: 150 }] },
  { name: "Collier confit au gras", tag: "Mijoté", minutes: 180, ingredients: [{ id: "collier", grams: 250 }, { id: "graisse", grams: 30 }] },
  { name: "Plat de côte braisé", tag: "Réconfort", minutes: 150, ingredients: [{ id: "plat-cote", grams: 300 }] },
  { name: "Jarret mijoté", tag: "Réconfort", minutes: 180, ingredients: [{ id: "jarret", grams: 300 }] },
  { name: "Entrecôte saisie", tag: "Plaisir", minutes: 15, ingredients: [{ id: "entrecote", grams: 250 }] },
  { name: "Gigot d'agneau grillé", tag: "Fête", minutes: 25, ingredients: [{ id: "gigot", grams: 250 }] },
  { name: "Côtelettes d'agneau", tag: "Plaisir", minutes: 15, ingredients: [{ id: "cotelettes", grams: 250 }] },
  { name: "Tagine sans os express", tag: "Mijoté", minutes: 60, ingredients: [{ id: "tagine-sans-os", grams: 250 }] },
];

export const costPerPerson = (r: Recipe) =>
  r.ingredients.reduce((sum, i) => sum + (pricePerKg(byId[i.id]) * i.grams) / 1000, 0);

export const mad = (n: number) =>
  n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " MAD";
