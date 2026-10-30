"use client";

import Link from "next/link";
import { tiltHandlers } from "./fun";
import MacroBar from "./MacroBar";

/** Données d'une recette, calculées côté serveur et passées au client (sérialisables). */
export type RecipeCard = {
  id: string;
  name: string;
  meal: string;
  mealLabel: string;
  minutes: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  cost: string;
  costValue: number;
  diets: string[];
  dietLabels: string;
  emojis: string;
  tags: string[];
  tagLabels: string[];
  equipment: string[];
  equipmentLabels: string[];
  ingredients: string[];
};

export const TAG_EMOJI: Record<string, string> = { etudiant: "🎓", fitness: "💪", "meal-prep": "🍱" };
export const EQUIPMENT_EMOJI: Record<string, string> = {
  "sans-cuisson": "🥗",
  "micro-ondes": "📡",
  poele: "🍳",
  casserole: "🍲",
  four: "🔥",
  mixeur: "🌀",
};

export function Badge({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        strong ? "bg-accent text-on-accent" : "border border-border bg-background text-foreground"
      }`}
    >
      {children}
    </span>
  );
}

export function RecipeBadges({ r }: { r: RecipeCard }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge>
        <span aria-hidden="true">⏱</span> {r.minutes} min
      </Badge>
      <Badge>
        <span aria-hidden="true">🔥</span> {r.kcal} kcal
      </Badge>
      {r.tags.map((t, i) => (
        <Badge key={t}>
          <span aria-hidden="true">{TAG_EMOJI[t] ?? "🏷"}</span> {r.tagLabels[i]}
        </Badge>
      ))}
      {r.equipment.map((e, i) => (
        <Badge key={e}>
          <span aria-hidden="true">{EQUIPMENT_EMOJI[e] ?? "🔧"}</span> {r.equipmentLabels[i]}
        </Badge>
      ))}
    </div>
  );
}

export default function RecipeTile({ r }: { r: RecipeCard }) {
  return (
    <Link
      href={`/recettes/${r.id}`}
      {...tiltHandlers()}
      className="tilt-card group flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-accent hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">{r.mealLabel}</span>
          <h2 className="mt-0.5 text-base font-bold leading-snug group-hover:text-accent">{r.name}</h2>
        </div>
        <div className="shrink-0 rounded-xl bg-accent-soft px-2.5 py-1.5 text-center text-accent">
          <span className="block text-2xl font-extrabold leading-none">{r.protein}</span>
          <span className="block text-[10px] font-semibold uppercase">g prot.</span>
        </div>
      </div>
      <MacroBar protein={r.protein} carbs={r.carbs} fat={r.fat} className="mt-3" />
      <div className="mt-3">
        <RecipeBadges r={r} />
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 pt-4">
        <p className="text-lg font-extrabold">
          {r.cost}
          <span className="text-xs font-normal text-muted"> /pers</span>
        </p>
        <p className="text-sm" aria-label={`Régimes compatibles : ${r.dietLabels}`}>
          <span aria-hidden="true">{r.emojis}</span>
        </p>
      </div>
    </Link>
  );
}
