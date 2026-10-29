import * as cheerio from "cheerio";

export const BRINGO_ORIGIN = "https://www.bringo.ma";

export type RawProduct = {
  store_slug: string;
  category_slug: string;
  product_ext_id: string;
  name: string;
  price_mad: number;
  // Prix « ~ X MAD / unité » affiché quand le prix principal est variable (vendu à la pièce ou au poids).
  approximate: boolean;
  promo: string | null;
  url: string;
};

/** "47,45 MAD" → 47.45 ; "1 234,50 MAD" → 1234.5 ; null si aucun nombre. */
export function parsePrice(text: string): number | null {
  const m = text.replace(/ /g, " ").match(/(\d[\d\s]*(?:[.,]\d+)?)\s*MAD/i);
  if (!m) return null;
  const n = Number(m[1].replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/**
 * Lit une page catégorie Bringo et renvoie ses produits.
 * Les produits sans prix exploitable (rupture, prix à 0 sans prix indicatif) sont écartés.
 */
export function parseCategoryPage(html: string, ctx: { storeSlug: string; categorySlug: string }): RawProduct[] {
  const $ = cheerio.load(html);
  const products: RawProduct[] = [];

  $(".box-product").each((_, el) => {
    const box = $(el);
    const link = box.find("a.bringo-product-name").first();
    const name = link.text().replace(/\s+/g, " ").trim();
    const href = link.attr("href") ?? "";
    const id = href.match(/\/products\/[^/]+\/(\d+)\/?$/)?.[1];
    if (!name || !id) return;

    const priceBox = box.find(".bringo-product-price").first();
    const uom = priceBox.find(".product-price-default-uom");
    const uomText = uom.text();
    uom.remove();

    let price = parsePrice(priceBox.text());
    let approximate = false;
    if (!price) {
      const indicative = parsePrice(uomText);
      if (indicative) {
        price = indicative;
        approximate = true;
      }
    }
    if (!price || price <= 0) return;

    const promo = box.find(".discount-percentage").first().text().trim() || null;

    products.push({
      store_slug: ctx.storeSlug,
      category_slug: ctx.categorySlug,
      product_ext_id: id,
      name,
      price_mad: price,
      approximate,
      promo,
      url: new URL(href, BRINGO_ORIGIN).toString(),
    });
  });

  return products;
}
