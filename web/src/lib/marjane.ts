// Produits Marjane correspondant aux aliments du catalogue, relevés sur marjane.ma.
// Source : data/marjane/selection.csv (recopiée par scripts/marjane_csv_to_ts.py).
import { foodById } from "./foods";
import { soukPricePerKg } from "./souk";

export const MARJANE_DATE = "31/10/2026";
export const MARJANE_BASE = "https://www.marjane.ma";

export type StoreOffer = { name: string; priceMad: number; grams: number; url?: string };

export const marjane: Record<string, StoreOffer> = {
  "tomate": { name: "Tomate ronde 1Kg - FILIERE M", priceMad: 9.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5004-tomate-ronde-1kg-filiere-m" },
  "oignon": { name: "Oignon blanc 1Kg - FILIERE M", priceMad: 7.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5157-oignon-blanc-1kg-filiere-m" },
  "carotte": { name: "Carotte 1Kg - FILIERE M", priceMad: 5.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/32425-carotte-1kg-filiere-m" },
  "courgette": { name: "Courgette blanche 500g - FILIERE M", priceMad: 8.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5039-courgette-blanche-500g-filiere-m" },
  "navet": { name: "Navet rond 500g", priceMad: 8.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5055-navet-rond-500g" },
  "aubergine": { name: "Aubergine ronde 500g - FILIERE M", priceMad: 4.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5174-aubergine-ronde-500g-filiere-m" },
  "haricot-vert": { name: "Haricot vert 500g - FILIERE M", priceMad: 12.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/52834-haricot-vert-500g-filiere-m" },
  "pdt": { name: "Pomme de terre blanche non lavée 1 kg - FILIÈRE M", priceMad: 7.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/102608-pomme-de-terre-blanche-non-lavee-1-kg-filiere-m" },
  "patate-douce": { name: "Pomme de terre douce 1Kg", priceMad: 12.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/7336-pomme-de-terre-douce-1kg" },
  "brocoli": { name: "Brocoli 500g", priceMad: 16.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5075-brocoli-500g" },
  "champignons": { name: "Champignon de paris 200g", priceMad: 14.90, grams: 200, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/32760-champignon-de-paris-200g" },
  "poivron": { name: "Poivron rouge 500g - FILIERE M", priceMad: 12.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/53893-poivron-rouge-500g-filiere-m" },
  "poivron-vert": { name: "Poivron vert 500g - FILIERE M", priceMad: 8.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5023-poivron-vert-500g-filiere-m" },
  "concombre": { name: "Concombre court 1Kg - FILIERE M", priceMad: 10.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5155-concombre-court-1kg---filiere-m" },
  "chou-rouge": { name: "Choux rouge 1Kg - FILIERE M", priceMad: 10.50, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/272-legumes/5019-choux-rouge-1kg-filiere-m" },
  "banane": { name: "Banane 1Kg", priceMad: 22.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/271-fruits/5017-banane-1kg" },
  "clementine": { name: "Clémentine 1Kg", priceMad: 9.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/271-fruits/7432-clementine-1kg" },
  "orange": { name: "Orange navel 1Kg", priceMad: 9.90, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/271-fruits/8193-orange-navel-1kg" },
  "avocat": { name: "Avocat 500g", priceMad: 9.95, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/271-fruits/104308-avocat-500g" },
  "citron": { name: "Citron jaune 500g", priceMad: 3.90, grams: 500, url: "/courses-en-ligne/11-marche/52-fruits-legumes/271-fruits/5077-citron-jaune-500g" },
  "pomme": { name: "Pomme gala Sachet 1Kg - FILIERE M", priceMad: 10.50, grams: 1000, url: "/courses-en-ligne/11-marche/52-fruits-legumes/271-fruits/40637-pomme-gala-sachet-1kg-filiere-m" },
  "tagine-os": { name: "Tagine de bœuf avec os 500g", priceMad: 44.90, grams: 500, url: "/courses-en-ligne/11-marche/51-boucherie-volaille/274-boucherie/42639-tagine-de-b%C5%93uf-avec-os-500g" },
  "hache": { name: "Viande hachée de bœuf 500g", priceMad: 54.90, grams: 500, url: "/courses-en-ligne/11-marche/51-boucherie-volaille/274-boucherie/5014-viande-hachee-de-b%C5%93uf-500g" },
  "hache-dinde": { name: "Viande hachée de dinde épicée 500g", priceMad: 25.90, grams: 500, url: "/courses-en-ligne/11-marche/51-boucherie-volaille/275-volailles/5180-viande-hachee-de-dinde-epicee-500g" },
};

/** Offres comparées pour un aliment : prix au kilo, coût au prorata des grammes et nombre de paquets à acheter. */
export function compareOffers(foodId: string, grams: number) {
  const f = foodById[foodId];
  const rows: { store: string; product: string; packLabel: string; priceMad: number; perKg: number; prorata: number; packs: number; checkout: number; url?: string; estimate?: boolean }[] = [];
  const add = (store: string, o: StoreOffer, packLabel: string, url?: string, estimate = false) => {
    const perKg = (o.priceMad / o.grams) * 1000;
    const packs = Math.max(1, Math.ceil(grams / o.grams));
    rows.push({ store, product: o.name, packLabel, priceMad: o.priceMad, perKg, prorata: (perKg * grams) / 1000, packs, checkout: packs * o.priceMad, url, estimate });
  };
  add("Carrefour", { name: f.name, priceMad: f.priceMad, grams: f.packG }, f.packLabel);
  const m = marjane[foodId];
  if (m) add("Marjane", m, m.grams >= 1000 ? `${(m.grams / 1000).toLocaleString("fr-MA")} kg` : `${m.grams} g`, m.url ? MARJANE_BASE + m.url : undefined);
  const souk = soukPricePerKg(foodId);
  if (souk !== undefined) {
    const perKg = souk;
    const kg = Math.max(0.25, Math.ceil(grams / 250) / 4);
    rows.push({ store: "Souk", product: `${f.name} au poids`, packLabel: "au kilo", priceMad: perKg, perKg, prorata: (perKg * grams) / 1000, packs: 1, checkout: kg * perKg, estimate: true });
  }
  return rows.sort((a, b) => a.perKg - b.perKg);
}
