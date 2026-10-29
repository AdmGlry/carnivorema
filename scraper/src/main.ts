import { collect } from "./collect.js";
import { STORES } from "./config.js";
import { politeFetcher } from "./fetch.js";
import { insertSupabase, writeOutputs } from "./output.js";

const scrapedAt = new Date().toISOString();
const { rows, errors, pages } = await collect(STORES, politeFetcher(), scrapedAt);

const files = await writeOutputs(rows, process.env.OUT_DIR ?? "out", scrapedAt.slice(0, 10));
console.log(`${rows.length} produits relevés sur ${pages} pages → ${files.join(", ")}`);
for (const e of errors) console.error(`Erreur : ${e}`);

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  await insertSupabase(rows, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  console.log(`${rows.length} lignes insérées dans Supabase.`);
} else {
  console.log("Supabase non configuré : écriture en base ignorée.");
}

// Échec si rien n'a été relevé (structure du site changée ?) ou si plus d'un quart des catégories a échoué.
const categories = STORES.reduce((n, s) => n + s.categories.length, 0);
if (rows.length === 0 || errors.length > categories / 4) process.exit(1);
