import { NextResponse } from "next/server";
import { CITIES, PLACES, reportProductBySlug } from "@/lib/reports";
import { retailRange, wholesale } from "@/lib/souk";

const MAX_BODY_BYTES = 1_000;

type Payload = { product?: unknown; price?: unknown; city?: unknown; place?: unknown; website?: unknown };

const json = (status: number, body: { ok: boolean; message: string }) => NextResponse.json(body, { status });

// Limite simple par instance : 10 signalements par adresse et par heure (l'adresse n'est jamais stockée).
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const list = (recent.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  list.push(now);
  recent.set(ip, list);
  if (recent.size > 5_000) recent.clear();
  return list.length > 10;
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, message: "Requête trop volumineuse." });

  let body: Payload;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, message: "Format invalide." });
  }
  if (typeof body !== "object" || body === null) return json(400, { ok: false, message: "Format invalide." });

  // Honeypot : réponse de succès sans rien enregistrer.
  if (typeof body.website === "string" && body.website !== "") return json(200, { ok: true, message: "Merci !" });

  const product = typeof body.product === "string" ? reportProductBySlug.get(body.product) : undefined;
  if (!product) return json(400, { ok: false, message: "Choisis un produit dans la liste." });

  const price = typeof body.price === "number" ? body.price : Number(String(body.price ?? "").replace(",", "."));
  if (!Number.isFinite(price) || price <= 0 || price > 1000) return json(400, { ok: false, message: "Indique un prix en dirhams, par exemple 7,5." });

  const city = typeof body.city === "string" ? body.city : "";
  if (!CITIES.includes(city)) return json(400, { ok: false, message: "Choisis ta ville dans la liste." });

  const place = typeof body.place === "string" ? body.place : "";
  if (!PLACES.some((p) => p.id === place)) return json(400, { ok: false, message: "Indique où tu as acheté." });

  // Garde-fou tant qu'il y a peu de relevés : un prix très loin du prix de gros est sans doute une erreur de saisie.
  const w = wholesale.find((x) => x.slug === product.slug);
  if (w) {
    const { low, high } = retailRange(w);
    if (price < w.min * 0.5 || price > high * 4) {
      return json(400, {
        ok: false,
        message: `Ce prix paraît très loin de la normale (environ ${low.toLocaleString("fr-MA")} à ${high.toLocaleString("fr-MA")} DH le kilo). Vérifie l'unité ou le montant.`,
      });
    }
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnu";
  if (tooMany(ip)) return json(429, { ok: false, message: "Merci pour tous ces prix ! Reviens dans un moment pour en ajouter d'autres." });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return json(503, { ok: false, message: "Les signalements ne sont pas encore ouverts (base de données non configurée)." });

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/price_reports`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ product_slug: product.slug, price_mad: Math.round(price * 100) / 100, unit: product.unit, city, place_type: place }),
      cache: "no-store",
    });
    if (res.ok) return json(201, { ok: true, message: `Merci ! Ton prix pour « ${product.name} » à ${city} aide toute la communauté.` });
    console.error("price report insert failed", res.status, await res.text());
    return json(502, { ok: false, message: "L'envoi a échoué, réessaie dans un instant." });
  } catch (err) {
    console.error("price report insert error", err);
    return json(502, { ok: false, message: "L'envoi a échoué, réessaie dans un instant." });
  }
}
