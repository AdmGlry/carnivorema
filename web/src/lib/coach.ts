// Le coach : suivi du poids, des repas cochés et ajustement des calories chaque semaine.
// Principe (comme les applis « adaptatives ») : on compare ce que tu as mangé à l'évolution
// de ton poids lissé pour estimer ta vraie dépense, puis on corrige ta cible en douceur.

export type WeighIn = { date: string; kg: number }; // date AAAA-MM-JJ
export type CoachState = {
  start: string; // premier jour du plan
  weighIns: WeighIn[];
  // repas cochés par jour : index du repas dans la journée du menu → mangé ou non
  meals: Record<string, boolean[]>;
  lastCheckIn?: string;
};

export const KCAL_PER_KG = 7700;
export const MAX_WEEKLY_CHANGE = 150; // kcal/jour d'ajustement au plus, par semaine
const ALPHA = 0.1; // lissage du poids (moyenne mobile exponentielle)

export const isoDay = (d: Date) => d.toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

export function newState(today = isoDay(new Date())): CoachState {
  return { start: today, weighIns: [], meals: {} };
}

/** Ajoute ou remplace la pesée du jour, garde l'ordre chronologique. */
export function addWeighIn(s: CoachState, kg: number, date: string): CoachState {
  const weighIns = [...s.weighIns.filter((w) => w.date !== date), { date, kg }].sort((a, b) => a.date.localeCompare(b.date));
  return { ...s, weighIns };
}

/** Poids lissé jour par jour : la tendance, sans le bruit de l'eau et du sel. */
export function trend(weighIns: WeighIn[]): WeighIn[] {
  const out: WeighIn[] = [];
  let t: number | undefined;
  for (const w of weighIns) {
    t = t === undefined ? w.kg : t + ALPHA * (w.kg - t);
    out.push({ date: w.date, kg: Math.round(t * 100) / 100 });
  }
  return out;
}

/** Jour du menu (0 à 6) pour une date donnée. */
export const planDay = (s: CoachState, date: string) => (((daysBetween(s.start, date) % 7) + 7) % 7);

/** Part des repas cochés sur une période (0 à 1). Un jour sans aucune case cochée compte comme non suivi. */
export function adherence(s: CoachState, from: string, to: string, mealsPerDay: (date: string) => number): number {
  let planned = 0;
  let eaten = 0;
  for (let d = Date.parse(from); d <= Date.parse(to); d += 86_400_000) {
    const day = isoDay(new Date(d));
    const n = mealsPerDay(day);
    planned += n;
    eaten += (s.meals[day] ?? []).slice(0, n).filter(Boolean).length;
  }
  return planned ? eaten / planned : 0;
}

/** Série de jours consécutifs (jusqu'à aujourd'hui) avec au moins un repas coché. */
export function streak(s: CoachState, today: string): number {
  let n = 0;
  for (let d = Date.parse(today); ; d -= 86_400_000) {
    const day = isoDay(new Date(d));
    if (!(s.meals[day] ?? []).some(Boolean)) return day === today && n === 0 ? streak(s, isoDay(new Date(d - 86_400_000))) : n;
    n++;
  }
}

export type CheckIn = {
  ready: boolean; // assez de données pour ajuster
  days: number;
  weighIns: number;
  trendKgPerWeek: number;
  targetKgPerWeek: number;
  adherence: number;
  estimatedTdee?: number;
  adjust: number; // kcal/jour à ajouter à la cible actuelle
  message: string;
};

/**
 * Bilan de la semaine.
 * - Il faut au moins 10 jours et 5 pesées, et que les repas aient été suivis (≥ 60 %), sinon on n'ajuste pas.
 * - Dépense estimée = calories mangées − variation de poids lissé × 7700 / jours.
 * - La correction vise l'écart entre la vitesse voulue et la vitesse réelle, plafonnée à ±150 kcal/jour.
 */
export function checkIn(s: CoachState, today: string, plannedKcal: number, targetKgPerWeek: number, ad: number): CheckIn {
  const recent = s.weighIns.filter((w) => daysBetween(w.date, today) <= 21);
  const t = trend(recent);
  const days = t.length > 1 ? daysBetween(t[0].date, t[t.length - 1].date) : 0;
  const trendKgPerWeek = days > 0 ? ((t[t.length - 1].kg - t[0].kg) / days) * 7 : 0;
  const base = { days, weighIns: recent.length, trendKgPerWeek, targetKgPerWeek, adherence: ad };

  if (days < 10 || recent.length < 5) {
    return { ...base, ready: false, adjust: 0, message: `Pèse-toi chaque matin : encore ${Math.max(0, 5 - recent.length)} pesée(s) et ${Math.max(0, 10 - days)} jour(s) avant ton premier ajustement.` };
  }
  if (ad < 0.6) {
    return {
      ...base,
      ready: false,
      adjust: 0,
      message: `Tu as suivi ${Math.round(ad * 100)} % de tes repas. On n'ajuste pas tes calories tant que le plan n'est pas suivi : vise 80 % cette semaine.`,
    };
  }
  const intake = plannedKcal * Math.min(1, ad + (1 - ad) * 0.8); // les repas non cochés comptent pour 80 % (écarts)
  const estimatedTdee = Math.round(intake - (trendKgPerWeek * KCAL_PER_KG) / 7);
  const gapKgPerWeek = targetKgPerWeek - trendKgPerWeek;
  const raw = (gapKgPerWeek * KCAL_PER_KG) / 7;
  const adjust = Math.round(Math.max(-MAX_WEEKLY_CHANGE, Math.min(MAX_WEEKLY_CHANGE, raw)) / 10) * 10;
  const fmt = (x: number) => `${x > 0 ? "+" : ""}${x.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} kg par semaine`;
  const message =
    Math.abs(adjust) < 30
      ? `Parfait : tu évolues à ${fmt(trendKgPerWeek)}, pile dans ton objectif. On ne change rien.`
      : adjust < 0
        ? `Tu évolues à ${fmt(trendKgPerWeek)} pour un objectif de ${fmt(targetKgPerWeek)}. On retire ${-adjust} kcal par jour.`
        : `Tu évolues à ${fmt(trendKgPerWeek)} pour un objectif de ${fmt(targetKgPerWeek)}. On ajoute ${adjust} kcal par jour.`;
  return { ...base, ready: true, estimatedTdee, adjust, message };
}
