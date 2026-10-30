import { wholesale } from "./souk";

export const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "El Jadida", "Autre ville"];

export const PLACES = [
  { id: "souk", label: "Souk" },
  { id: "marche", label: "Marché municipal" },
  { id: "primeur", label: "Primeur" },
  { id: "hanout", label: "Hanout" },
  { id: "supermarche", label: "Supermarché" },
  { id: "autre", label: "Autre" },
] as const;

export const UNITS = [
  { id: "kg", label: "le kilo" },
  { id: "piece", label: "la pièce" },
  { id: "botte", label: "la botte" },
  { id: "litre", label: "le litre" },
] as const;

export type PlaceId = (typeof PLACES)[number]["id"];
export type UnitId = (typeof UNITS)[number]["id"];

export type ReportProduct = { slug: string; name: string; unit: UnitId };

// Produits qu'on peut signaler : ceux suivis au marché de gros, plus quelques achats du quotidien.
export const reportProducts: ReportProduct[] = [
  ...wholesale.map((w) => ({ slug: w.slug, name: w.name, unit: "kg" as const })),
  { slug: "poivron", name: "Poivron", unit: "kg" },
  { slug: "citron", name: "Citron", unit: "kg" },
  { slug: "persil", name: "Persil", unit: "botte" },
  { slug: "coriandre", name: "Coriandre", unit: "botte" },
  { slug: "menthe", name: "Menthe", unit: "botte" },
  { slug: "oeuf", name: "Œuf", unit: "piece" },
  { slug: "khobz", name: "Pain (khobz)", unit: "piece" },
  { slug: "poulet-vif", name: "Poulet (vif, au kilo)", unit: "kg" },
  { slug: "lait", name: "Lait frais", unit: "litre" },
];

export const reportProductBySlug = new Map(reportProducts.map((p) => [p.slug, p]));

export type ReportStat = {
  product_slug: string;
  unit: UnitId;
  city: string;
  reports: number;
  median_mad: number;
  min_mad: number;
  max_mad: number;
  last_report_at: string;
};

// À partir de 3 signalements, on affiche le prix médian des utilisateurs à la place de l'estimation.
export const MIN_REPORTS = 3;

/** Statistiques publiques des signalements, ou [] si la base n'est pas configurée ou ne répond pas. */
export async function fetchReportStats(): Promise<ReportStat[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/price_report_stats?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as ReportStat[];
    return rows.map((r) => ({ ...r, median_mad: Number(r.median_mad), min_mad: Number(r.min_mad), max_mad: Number(r.max_mad) }));
  } catch {
    return [];
  }
}
