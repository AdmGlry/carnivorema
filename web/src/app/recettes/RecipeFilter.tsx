"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type RecipeCard = {
  id: string;
  name: string;
  meal: string;
  mealLabel: string;
  minutes: number;
  kcal: number;
  protein: number;
  cost: string;
  diets: string[];
  dietLabels: string;
  emojis: string;
};

type Option = { id: string; label: string };

function Chips({ legend, options, value, onChange }: { legend: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="text-sm text-muted">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-3 py-1.5 text-sm ${value === o.id ? "border-accent bg-accent-soft font-semibold text-accent" : "border-border bg-card"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function RecipeFilter({ recipes, diets, meals }: { recipes: RecipeCard[]; diets: Option[]; meals: Option[] }) {
  const [diet, setDiet] = useState("tous");
  const [meal, setMeal] = useState("tous");

  const visible = useMemo(
    () => recipes.filter((r) => (diet === "tous" || r.diets.includes(diet)) && (meal === "tous" || r.meal === meal)),
    [recipes, diet, meal],
  );

  return (
    <div>
      <div className="space-y-4">
        <Chips legend="Régime" options={[{ id: "tous", label: "Tous" }, ...diets]} value={diet} onChange={setDiet} />
        <Chips legend="Repas" options={[{ id: "tous", label: "Tous" }, ...meals]} value={meal} onChange={setMeal} />
      </div>
      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {visible.length} recette{visible.length > 1 ? "s" : ""}
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((r) => (
          <li key={r.id}>
            <Link href={`/recettes/${r.id}`} className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 hover:border-accent">
              <span className="text-xs font-semibold uppercase text-accent">{r.mealLabel}</span>
              <h2 className="mt-1 font-bold">{r.name}</h2>
              <p className="mt-2 text-xs text-muted">
                {r.minutes} min · {r.kcal} kcal · {r.protein} g prot.
              </p>
              <p className="mt-1 font-semibold">{r.cost} /pers</p>
              <p className="mt-auto pt-3 text-sm" aria-label={`Régimes compatibles : ${r.dietLabels}`}>
                <span aria-hidden="true">{r.emojis}</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="mt-6 text-muted">Aucune recette pour cette combinaison pour l&apos;instant.</p>}
    </div>
  );
}
