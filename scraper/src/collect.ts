import { MAX_PAGES, PAGE_LIMIT, StoreConfig, refineCategory } from "./config.js";
import { Fetcher } from "./fetch.js";
import { parsePack, pricePerKg } from "./normalize.js";
import { BRINGO_ORIGIN, RawProduct, parseCategoryPage } from "./parse.js";

// Une ligne de la table Supabase `prices` (voir supabase/migrations).
export type PriceRow = {
  store_slug: string;
  product_ext_id: string;
  name: string;
  category_slug: string;
  price_mad: number;
  promo: string | null;
  pack_grams: number | null;
  pack_ml: number | null;
  unit_count: number | null;
  price_per_kg: number | null;
  url: string;
  scraped_at: string;
};

export function toPriceRow(p: RawProduct, scrapedAt: string): PriceRow {
  const pack = parsePack(p.name);
  // Un prix indicatif (« ~ X MAD / pièce ») ne permet pas de calculer un prix au kg fiable.
  const perKg = p.approximate ? null : pricePerKg(p.price_mad, pack);
  return {
    store_slug: p.store_slug,
    product_ext_id: p.product_ext_id,
    name: p.name,
    category_slug: refineCategory(p.category_slug, p.name),
    price_mad: p.price_mad,
    promo: p.promo,
    ...pack,
    price_per_kg: perKg?.value ?? null,
    url: p.url,
    scraped_at: scrapedAt,
  };
}

export const categoryUrl = (storeSlug: string, bringoSlug: string, page: number) =>
  `${BRINGO_ORIGIN}/fr_MA/stores/${storeSlug}/${bringoSlug}?limit=${PAGE_LIMIT}&page=${page}`;

export type CollectReport = { rows: PriceRow[]; errors: string[]; pages: number };

/** Parcourt toutes les pages de chaque catégorie ; s'arrête quand une page n'apporte plus de produit nouveau. */
export async function collect(stores: StoreConfig[], fetchPage: Fetcher, scrapedAt = new Date().toISOString()): Promise<CollectReport> {
  const rows = new Map<string, PriceRow>();
  const errors: string[] = [];
  let pages = 0;

  for (const store of stores) {
    for (const cat of store.categories) {
      for (let page = 1; page <= MAX_PAGES; page++) {
        const url = categoryUrl(store.storeSlug, cat.bringoSlug, page);
        let products: RawProduct[];
        try {
          products = parseCategoryPage(await fetchPage(url), { storeSlug: store.storeSlug, categorySlug: cat.categorySlug });
          pages++;
        } catch (err) {
          errors.push(`${url} : ${err instanceof Error ? err.message : String(err)}`);
          break;
        }
        let fresh = 0;
        for (const p of products) {
          const key = `${p.store_slug}|${p.product_ext_id}`;
          if (rows.has(key)) continue;
          rows.set(key, toPriceRow(p, scrapedAt));
          fresh++;
        }
        if (fresh === 0) break;
      }
    }
  }
  return { rows: [...rows.values()], errors, pages };
}
