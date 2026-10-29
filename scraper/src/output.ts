import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PriceRow } from "./collect.js";

const COLUMNS: (keyof PriceRow)[] = [
  "store_slug",
  "product_ext_id",
  "name",
  "category_slug",
  "price_mad",
  "promo",
  "pack_grams",
  "pack_ml",
  "unit_count",
  "price_per_kg",
  "url",
  "scraped_at",
];

const csvCell = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows: PriceRow[]): string {
  return [COLUMNS.join(","), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n";
}

export async function writeOutputs(rows: PriceRow[], dir: string, date: string) {
  await mkdir(dir, { recursive: true });
  const base = join(dir, `prices-${date}`);
  await writeFile(`${base}.json`, JSON.stringify(rows, null, 2));
  await writeFile(`${base}.csv`, toCsv(rows));
  return [`${base}.json`, `${base}.csv`];
}

/** Insère les lignes dans la table `prices` via l'API REST Supabase, par lots. */
export async function insertSupabase(rows: PriceRow[], url: string, serviceKey: string, batch = 500) {
  for (let i = 0; i < rows.length; i += batch) {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/prices`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rows.slice(i, i + batch)),
    });
    if (!res.ok) throw new Error(`Supabase ${res.status} : ${await res.text()}`);
  }
}
