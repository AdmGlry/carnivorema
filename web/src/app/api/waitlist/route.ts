import { NextResponse } from "next/server";

const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir", "Autre"] as const;

const MAX_BODY_BYTES = 2_000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Payload = { email?: unknown; city?: unknown; diet?: unknown; goal?: unknown; source?: unknown; website?: unknown };

const json = (status: number, body: { ok: boolean; message: string }) => NextResponse.json(body, { status });

// Champ texte optionnel : chaîne courte ou rien.
function optional(v: unknown, max: number): string | null | undefined {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string" || v.length > max) return undefined;
  return v.trim() || null;
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

  // Honeypot : champ caché que seuls les robots remplissent. On répond comme un succès sans rien enregistrer.
  if (typeof body.website === "string" && body.website !== "") return json(200, { ok: true, message: "Merci !" });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json(400, { ok: false, message: "Adresse e-mail invalide." });
  }
  const city = optional(body.city, 60);
  const diet = optional(body.diet, 40);
  const goal = optional(body.goal, 40);
  const source = optional(body.source, 60);
  if (city === undefined || diet === undefined || goal === undefined || source === undefined) {
    return json(400, { ok: false, message: "Champ invalide." });
  }
  if (city && !(CITIES as readonly string[]).includes(city)) return json(400, { ok: false, message: "Ville invalide." });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return json(503, { ok: false, message: "Les inscriptions ne sont pas encore ouvertes (base de données non configurée)." });
  }

  try {
    const res = await fetch(`${url}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email, city, diet, goal, source }),
      cache: "no-store",
    });
    if (res.ok) return json(201, { ok: true, message: "C'est noté ! On te prévient dès l'ouverture de la bêta." });
    // Violation d'unicité : l'adresse est déjà inscrite.
    if (res.status === 409) return json(200, { ok: true, message: "Tu es déjà inscrit·e, on te prévient très vite." });
    console.error("waitlist insert failed", res.status, await res.text());
    return json(502, { ok: false, message: "L'inscription a échoué, réessaie dans un instant." });
  } catch (err) {
    console.error("waitlist insert error", err);
    return json(502, { ok: false, message: "L'inscription a échoué, réessaie dans un instant." });
  }
}
