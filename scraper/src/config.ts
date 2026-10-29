// Catégories alimentaires suivies, par magasin Bringo.
// Les slugs Bringo portent un suffixe numérique propre à chaque magasin : ne les ajouter qu'après vérification.
export type CategoryConfig = { bringoSlug: string; categorySlug: string };
export type StoreConfig = { storeSlug: string; categories: CategoryConfig[] };

export const STORES: StoreConfig[] = [
  {
    storeSlug: "carrefour-hypermarket",
    categories: [
      { bringoSlug: "boucherie-29", categorySlug: "viande" },
      { bringoSlug: "volaille-22", categorySlug: "volaille" },
      { bringoSlug: "poissonnerie-60", categorySlug: "poisson" },
      { bringoSlug: "oeufs-31", categorySlug: "oeuf" },
      { bringoSlug: "produits-laitiers-oeufs-9", categorySlug: "laitier" },
      { bringoSlug: "legumes-45", categorySlug: "legume" },
      { bringoSlug: "fruits-46", categorySlug: "fruit" },
      { bringoSlug: "pates-riz-feculents", categorySlug: "feculent" },
    ],
  },
];

// Le rayon « Pâtes, riz & féculents » mélange féculents et légumineuses : on reclasse par le nom.
const LEGUMINEUSES = /\b(lentilles?|pois chiches?|pois cass[ée]s|haricots?|f[èe]ves?)\b/i;

export function refineCategory(categorySlug: string, name: string): string {
  if (categorySlug === "feculent" && LEGUMINEUSES.test(name)) return "legumineuse";
  return categorySlug;
}

export const PAGE_LIMIT = 100;
export const MAX_PAGES = 30;
export const DELAY_MS = 1500;
export const USER_AGENT = "MizanPriceBot/0.1 (+https://mizan.ma ; relevé de prix, 1 requête / 1,5 s)";
