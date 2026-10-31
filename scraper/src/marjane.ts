// Relevé des produits alimentaires de Marjane (marjane.ma, rubrique « Courses en ligne »).
// On parcourt les rayons alimentaires, page par page, et on garde nom, prix, lien et image de chaque carte produit.
import { load } from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import { politeFetcher, type Fetcher } from "./fetch.js";

const BASE = "https://www.marjane.ma";
// Rayons alimentaires de départ.
export const ROOTS = [
  "/courses-en-ligne/11-marche",
  "/courses-en-ligne/13-produits-laitiers-%C5%93ufs",
  "/courses-en-ligne/8-epicerie",
  "/courses-en-ligne/12-petit-dejeuner",
  "/courses-en-ligne/4-boulangerie-patisserie",
  "/courses-en-ligne/5-charcuterie-traiteur-de-la-mer",
  "/courses-en-ligne/357-bio-et-sante",
];
const MAX_PAGES = 400;

export type MarjaneProduct = { name: string; priceMad: number; oldPriceMad?: number; url: string; image?: string; category: string };

export const parsePrice = (s: string) => {
  const m = s.replace(/\s/g, "").match(/(\d+(?:[.,]\d+)?)DH/i);
  return m ? Number(m[1].replace(",", ".")) : undefined;
};

/** Extrait les cartes produit et les liens de rayons ou de pages d'une page Marjane. */
export function parsePage(html: string, pageUrl: string) {
  const $ = load(html);
  const category = $("h1").first().text().trim();
  const products: MarjaneProduct[] = [];
  $(".product-card").each((_, el) => {
    const card = $(el);
    const name = card.find("h2.title").first().text().trim();
    const href = card.find("a[href]").first().attr("href");
    const prices = card
      .find(".prices .price, .prices [class*='price']")
      .map((_, p) => parsePrice($(p).text()))
      .get()
      .filter((p): p is number => typeof p === "number");
    if (!name || !href || prices.length === 0) return;
    const priceMad = Math.min(...prices);
    const oldPriceMad = prices.length > 1 ? Math.max(...prices) : undefined;
    const img = card.find("img").first().attr("src");
    products.push({ name, priceMad, oldPriceMad: oldPriceMad !== priceMad ? oldPriceMad : undefined, url: new URL(href, BASE).href, image: img, category });
  });
  const links = new Set<string>();
  $("a[href]").each((_, a) => {
    const href = $(a).attr("href")!;
    const u = new URL(href, pageUrl);
    if (u.host !== "www.marjane.ma" || !u.pathname.startsWith("/courses-en-ligne/")) return;
    // Rayon : segments « 123-nom » ; une page produit a un segment de plus que son rayon et est déjà dans les cartes.
    if ($(a).closest(".product-card").length) return;
    const page = u.searchParams.get("page");
    u.search = page ? `?page=${page}` : "";
    u.hash = "";
    links.add(u.href);
  });
  return { products, links: [...links] };
}

export async function crawl(fetcher: Fetcher, log = console.log) {
  const queue = ROOTS.map((r) => BASE + r);
  const seen = new Set(queue);
  const products = new Map<string, MarjaneProduct>();
  const errors: string[] = [];
  let pages = 0;
  while (queue.length && pages < MAX_PAGES) {
    const url = queue.shift()!;
    pages++;
    try {
      const { products: found, links } = parsePage(await fetcher(url), url);
      found.forEach((p) => products.set(p.url, p));
      for (const l of links) {
        if (seen.has(l)) continue;
        // On ne descend que dans les rayons de départ.
        if (!ROOTS.some((r) => l.startsWith(BASE + r))) continue;
        seen.add(l);
        queue.push(l);
      }
      if (pages % 20 === 0) log(`${pages} pages, ${products.size} produits`);
    } catch (e) {
      errors.push(String(e));
    }
  }
  return { products: [...products.values()], errors, pages };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { products, errors, pages } = await crawl(politeFetcher({ delayMs: 600 }));
  const out = process.env.OUT_FILE ?? "../data/marjane/produits.json";
  await mkdir(out.replace(/\/[^/]+$/, ""), { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  await writeFile(out, JSON.stringify({ source: "marjane.ma", date, count: products.length, products: products.sort((a, b) => a.name.localeCompare(b.name)) }, null, 1));
  console.log(`${products.length} produits Marjane relevés sur ${pages} pages → ${out}`);
  errors.slice(0, 10).forEach((e) => console.error(`Erreur : ${e}`));
  if (products.length === 0) process.exit(1);
}
