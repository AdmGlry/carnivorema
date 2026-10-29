export type Pack = {
  pack_grams: number | null;
  pack_ml: number | null;
  unit_count: number | null;
};

const num = (s: string) => Number(s.replace(",", "."));

const MASS: Record<string, number> = { g: 1, gr: 1, kg: 1000 };
const VOLUME: Record<string, number> = { ml: 1, cl: 10, dl: 100, l: 1000 };

/**
 * Déduit le conditionnement depuis le libellé produit.
 * Exemples : "500g", "1Kg.", "au kg", "3x20cl", "4x100g", "1L 6 unités", "Plateau 30 unités", "à la pièce".
 */
export function parsePack(label: string): Pack {
  const s = label.toLowerCase().replace(/ /g, " ");
  const pack: Pack = { pack_grams: null, pack_ml: null, unit_count: null };

  // Lot : "3x20cl", "4 x 100 g", "2x60g"
  const multi = s.match(/(\d+)\s*x\s*(\d+(?:[.,]\d+)?)\s*(kg|gr|g|ml|cl|dl|l)\b/);
  // Quantité simple : "500g", "1,5 kg", "50cl", "1l"
  const single = s.match(/(\d+(?:[.,]\d+)?)\s*(kg|gr|g|ml|cl|dl|l)(?![a-zà-ÿ])/);
  // Nombre d'unités : "6 unités", "x30 unités", "30u", "8 pièces"
  const units = s.match(/x?\s*(\d+)\s*(?:unités?|u\b|pièces?|pcs?\b)/);

  if (multi) {
    const count = Number(multi[1]);
    const qty = num(multi[2]);
    const unit = multi[3];
    pack.unit_count = count;
    if (unit in MASS) pack.pack_grams = count * qty * MASS[unit];
    else pack.pack_ml = count * qty * VOLUME[unit];
  } else if (single) {
    const qty = num(single[1]);
    const unit = single[2];
    if (unit in MASS) pack.pack_grams = qty * MASS[unit];
    else pack.pack_ml = qty * VOLUME[unit];
    if (units) {
      // "Pack Lait 1L 6 unités" : 6 × 1 L
      const count = Number(units[1]);
      pack.unit_count = count;
      if (pack.pack_grams !== null) pack.pack_grams *= count;
      if (pack.pack_ml !== null) pack.pack_ml *= count;
    }
  } else if (/\bau\s*kg\b/.test(s)) {
    pack.pack_grams = 1000;
  } else if (units) {
    pack.unit_count = Number(units[1]);
  } else if (/(à|a)\s*la\s*pi[eè]ce/.test(s)) {
    pack.unit_count = 1;
  }

  if (pack.pack_grams !== null) pack.pack_grams = Math.round(pack.pack_grams * 100) / 100;
  if (pack.pack_ml !== null) pack.pack_ml = Math.round(pack.pack_ml * 100) / 100;
  return pack;
}

/** Prix au kg (solides) ou au litre (liquides), arrondi au centime ; null si le poids est inconnu. */
export function pricePerKg(priceMad: number, pack: Pack): { value: number; unit: "kg" | "L" } | null {
  if (pack.pack_grams) return { value: Math.round((priceMad / pack.pack_grams) * 100000) / 100, unit: "kg" };
  if (pack.pack_ml) return { value: Math.round((priceMad / pack.pack_ml) * 100000) / 100, unit: "L" };
  return null;
}
