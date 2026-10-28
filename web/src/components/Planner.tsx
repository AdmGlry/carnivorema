"use client";

import { useMemo, useState } from "react";
import { PRICE_DATE, PRICE_SOURCE, categoryLabels, mad } from "@/lib/foods";
import { Profile, activityLevels, computeTargets, diets, goals } from "@/lib/nutrition";
import { buildWeek } from "@/lib/planner";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MEALS = ["Petit-déj", "Déjeuner", "Dîner", "Collation", "Collation"];

const defaults: Profile = {
  sex: "homme",
  age: 30,
  weightKg: 80,
  heightCm: 178,
  activity: 1.55,
  goal: "perdre",
  diet: "equilibre",
  glutenFree: false,
  lactoseFree: false,
  people: 2,
  monthlyBudget: 3000,
};

const input = "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2";

function NumberField({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; suffix: string }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={input + " pr-12"}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-xs text-muted">{suffix}</span>
      </div>
    </label>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-background p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default function Planner() {
  const [p, setP] = useState<Profile>(defaults);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((prev) => ({ ...prev, [k]: v }));

  const valid = p.age >= 12 && p.age <= 100 && p.weightKg >= 30 && p.weightKg <= 250 && p.heightCm >= 120 && p.heightCm <= 230 && p.people >= 1 && p.monthlyBudget >= 100;
  const targets = useMemo(() => (valid ? computeTargets(p) : null), [p, valid]);
  const week = useMemo(() => (targets ? buildWeek(p, targets) : null), [p, targets]);

  const dayCost = week && !week.error ? week.weekCostPerPerson / 7 : 0;
  const overBudget = targets && dayCost > targets.dailyBudgetPerPerson;
  const monthlyNeeded = dayCost * 30 * p.people;
  const avgKcal = week && !week.error ? week.days.reduce((s, d) => s + d.totals.kcal, 0) / 7 : 0;
  const kcalShort = targets && avgKcal > 0 && avgKcal < targets.kcal * 0.92;

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* Profil */}
      <form className="space-y-5 rounded-2xl border border-border bg-card p-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <p className="text-sm text-muted">Sexe</p>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(["homme", "femme"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("sex", s)}
                className={`rounded-lg border px-3 py-2 text-sm capitalize ${p.sex === s ? "border-accent bg-accent-soft font-semibold text-accent" : "border-border"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <NumberField label="Âge" value={p.age} onChange={(n) => set("age", n)} min={12} max={100} suffix="ans" />
          <NumberField label="Poids" value={p.weightKg} onChange={(n) => set("weightKg", n)} min={30} max={250} suffix="kg" />
          <NumberField label="Taille" value={p.heightCm} onChange={(n) => set("heightCm", n)} min={120} max={230} suffix="cm" />
        </div>
        <label className="block text-sm">
          <span className="text-muted">Activité physique</span>
          <select value={p.activity} onChange={(e) => set("activity", Number(e.target.value))} className={input}>
            {activityLevels.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-muted">Objectif</span>
          <select value={p.goal} onChange={(e) => set("goal", e.target.value as Profile["goal"])} className={input}>
            {goals.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </label>
        <div>
          <p className="text-sm text-muted">Régime</p>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {diets.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => set("diet", d.id)}
                className={`rounded-lg border px-2 py-2 text-left text-sm ${p.diet === d.id ? "border-accent bg-accent-soft font-semibold text-accent" : "border-border"}`}
              >
                {d.emoji} {d.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={p.glutenFree} onChange={(e) => set("glutenFree", e.target.checked)} className="accent-[var(--accent)]" />
            Sans gluten
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={p.lactoseFree} onChange={(e) => set("lactoseFree", e.target.checked)} className="accent-[var(--accent)]" />
            Sans lactose
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Personnes" value={p.people} onChange={(n) => set("people", n)} min={1} max={12} suffix="pers" />
          <NumberField label="Budget courses" value={p.monthlyBudget} onChange={(n) => set("monthlyBudget", n)} min={100} max={50000} suffix="MAD/mois" />
        </div>
      </form>

      {/* Résultats */}
      <div className="min-w-0 space-y-6">
        {!targets || !week ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-muted">Renseigne un âge, un poids, une taille et un budget valides.</p>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold">Tes besoins par jour</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="IMC" value={targets.bmi.toFixed(1)} sub={targets.bmiLabel} />
                <Stat label="Dépense estimée" value={`${Math.round(targets.tdee)} kcal`} sub={`Métabolisme de base : ${Math.round(targets.bmr)}`} />
                <Stat label="Objectif calories" value={`${Math.round(targets.kcal)} kcal`} sub={goals.find((g) => g.value === p.goal)!.label.split(" (")[0]} />
                <Stat label="Budget / jour / pers" value={mad(targets.dailyBudgetPerPerson)} sub={`${p.monthlyBudget} MAD / mois`} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-xl bg-accent-soft p-3"><p className="text-xs text-muted">Protéines</p><p className="text-lg font-bold text-accent">{Math.round(targets.protein)} g</p></div>
                <div className="rounded-xl bg-accent-soft p-3"><p className="text-xs text-muted">Glucides</p><p className="text-lg font-bold text-accent">{Math.round(targets.carbs)} g</p></div>
                <div className="rounded-xl bg-accent-soft p-3"><p className="text-xs text-muted">Lipides</p><p className="text-lg font-bold text-accent">{Math.round(targets.fat)} g</p></div>
              </div>
              {targets.warnings.map((w) => (
                <p key={w} className="mt-3 rounded-lg border border-accent bg-accent-soft p-3 text-sm text-accent">⚠️ {w}</p>
              ))}
            </div>

            {week.error ? (
              <p className="rounded-2xl border border-border bg-card p-6 text-muted">{week.error}</p>
            ) : (
              <>
                <div className={`rounded-2xl border p-5 ${overBudget ? "border-accent bg-accent-soft" : "border-border bg-card"}`}>
                  <p className="font-semibold">
                    {overBudget ? "⚠️ Ce régime dépasse ton budget" : "✅ Ce menu tient dans ton budget"}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Coût moyen : <strong className="text-foreground">{mad(dayCost)}</strong> par jour et par personne, soit environ{" "}
                    <strong className="text-foreground">{Math.round(monthlyNeeded)} MAD / mois</strong> pour {p.people} personne{p.people > 1 ? "s" : ""}.
                    {overBudget && " Augmente ton budget ou essaie un régime moins coûteux (équilibré, végétarien, méditerranéen)."}
                  </p>
                </div>

                {kcalShort && (
                  <p className="rounded-2xl border border-accent bg-accent-soft p-4 text-sm text-accent">
                    ⚠️ Tes besoins sont élevés : ce menu apporte en moyenne {Math.round(avgKcal)} kcal sur {Math.round(targets.kcal)}. Ajoute des
                    féculents, des fruits secs ou augmente ton budget pour combler l&apos;écart.
                  </p>
                )}

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-bold">Ton menu de la semaine</h3>
                  <p className="text-sm text-muted">Portions ajustées à tes calories. Valeurs par personne.</p>
                  <div className="mt-4 space-y-3">
                    {week.days.map((d, i) => (
                      <div key={i} className="rounded-xl bg-background p-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-semibold">{DAYS[i]}</p>
                          <p className="text-xs text-muted">
                            {Math.round(d.totals.kcal)} kcal · P {Math.round(d.totals.protein)} g · G {Math.round(d.totals.carbs)} g · L {Math.round(d.totals.fat)} g ·{" "}
                            <span className="font-semibold text-foreground">{mad(d.totals.cost)}</span>
                          </p>
                        </div>
                        <ul className={`mt-2 grid gap-1 text-sm ${d.meals.length > 4 ? "sm:grid-cols-5" : d.meals.length > 3 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
                          {d.meals.map((m, j) => (
                            <li key={j}>
                              <span className="text-xs text-accent">{MEALS[j]}</span>
                              <br />
                              {m.recipe.name}
                              {Math.abs(m.scale - 1) > 0.05 && <span className="text-muted"> ×{m.scale.toFixed(1)}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold">Ta liste de courses</h3>
                    <p className="font-bold text-accent">{mad(week.shoppingTotal)}</p>
                  </div>
                  <p className="text-sm text-muted">
                    Pour {p.people} personne{p.people > 1 ? "s" : ""}, 7 jours, arrondie aux paquets du magasin. Hors huile, épices et pain.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {Object.entries(categoryLabels).map(([cat, label]) => {
                      const items = week.shopping.filter((s) => s.category === cat);
                      if (items.length === 0) return null;
                      return (
                        <div key={cat}>
                          <p className="text-sm font-semibold text-accent">{label}</p>
                          <ul className="mt-1 space-y-1 text-sm">
                            {items.map((s) => (
                              <li key={s.id} className="flex justify-between gap-2">
                                <span>
                                  {s.name} <span className="text-muted">· {s.packs} × {s.packLabel}</span>
                                </span>
                                <span className="whitespace-nowrap">{mad(s.cost)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs text-muted">Prix {PRICE_SOURCE} relevés le {PRICE_DATE}.</p>
                </div>
              </>
            )}
            <p className="text-xs text-muted">
              Estimations basées sur la formule de Mifflin-St Jeor et des valeurs nutritionnelles moyennes. Ce n&apos;est pas un avis médical : en cas de pathologie,
              de grossesse ou de traitement, demande conseil à un professionnel de santé.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
