"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PRICE_DATE, PRICE_SOURCE, categoryLabels, mad } from "@/lib/foods";
import { Profile, STUDENT_MAX_MINUTES, computeTargets, goals } from "@/lib/nutrition";
import { buildWeek } from "@/lib/planner";
import { CountUp } from "./fun";
import { WHOLESALE_DATE } from "@/lib/souk";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MEALS = ["Petit-déj", "Déjeuner", "Dîner", "Collation", "Collation"];

function Stat({ label, value, format, sub }: { label: string; value: number; format: (v: number) => string; sub?: string }) {
  return (
    <div className="rounded-xl bg-background p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-display mt-1 text-xl font-bold tabular-nums">
        <CountUp value={value} format={format} />
      </p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

const CHEAPER: { id: Profile["diet"]; name: string }[] = [
  { id: "vegan", name: "végan" },
  { id: "vegetarien", name: "végétarien" },
  { id: "equilibre", name: "équilibré" },
  { id: "mediterraneen", name: "méditerranéen" },
];

// Plus le budget monte, plus le moteur s'autorise des plats chers : on cherche le budget qui couvre le menu obtenu.
function fittingBudget(p: Profile, start: number) {
  let budget = Math.ceil(start / 50) * 50;
  for (let i = 0; i < 30; i++) {
    const q = { ...p, monthlyBudget: budget };
    const w = buildWeek(q, computeTargets(q));
    if (w.error) return budget;
    const cost = (w.weekCostPerPerson / 7) * 30 * p.people;
    if (cost <= budget) return budget;
    budget = Math.max(budget + 50, Math.ceil(cost / 50) * 50);
  }
  return budget;
}

export default function PlanResults({ profile: p, onBudget }: { profile: Profile; onBudget?: (monthly: number) => void }) {
  const targets = useMemo(() => computeTargets(p), [p]);
  const week = useMemo(() => buildWeek(p, targets), [p, targets]);

  const dayCost = week.error ? 0 : week.weekCostPerPerson / 7;
  const overBudget = dayCost > targets.dailyBudgetPerPerson;
  const monthlyNeeded = dayCost * 30 * p.people;
  const avgKcal = week.error ? 0 : week.days.reduce((s, d) => s + d.totals.kcal, 0) / 7;
  const kcalShort = avgKcal > 0 && avgKcal < targets.kcal * 0.92;
  const fitting = useMemo(() => (overBudget && onBudget ? fittingBudget(p, monthlyNeeded) : null), [overBudget, onBudget, p, monthlyNeeded]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-bold">Tes besoins par jour</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="IMC" value={targets.bmi} format={(v) => v.toFixed(1)} sub={targets.bmiLabel} />
          <Stat label="Dépense estimée" value={targets.tdee} format={(v) => `${Math.round(v)} kcal`} sub={`Métabolisme de base : ${Math.round(targets.bmr)}`} />
          <Stat label="Objectif calories" value={targets.kcal} format={(v) => `${Math.round(v)} kcal`} sub={goals.find((g) => g.value === p.goal)!.label.split(" (")[0]} />
          <Stat label="Budget / jour / pers" value={targets.dailyBudgetPerPerson} format={mad} sub={`${p.monthlyBudget} MAD / mois`} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
          {[
            ["Protéines", targets.protein],
            ["Glucides", targets.carbs],
            ["Lipides", targets.fat],
          ].map(([label, g]) => (
            <div key={label} className="rounded-xl bg-accent-soft p-3">
              <p className="text-xs text-muted">{label}</p>
              <p className="font-display text-lg font-bold text-accent tabular-nums">
                <CountUp value={g as number} format={(v) => `${Math.round(v)} g`} />
              </p>
            </div>
          ))}
        </div>
        {targets.warnings.map((w) => (
          <p key={w} className="mt-3 rounded-lg border border-accent bg-accent-soft p-3 text-sm text-accent">
            ⚠️ {w}
          </p>
        ))}
      </div>

      {week.error ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-muted">{week.error}</p>
      ) : (
        <>
          <div className={`rounded-2xl border p-5 ${overBudget ? "border-accent bg-accent-soft" : "border-border bg-card"}`}>
            <p className="font-semibold">{overBudget ? "⚠️ Ce régime dépasse ton budget" : "✅ Ce menu tient dans ton budget"}</p>
            <p className="mt-1 text-sm text-muted">
              Coût moyen : <strong className="text-foreground">{mad(dayCost)}</strong> par jour et par personne, soit environ{" "}
              <strong className="text-foreground">{Math.round(monthlyNeeded)} MAD / mois</strong> pour {p.people} personne{p.people > 1 ? "s" : ""}.
              {overBudget &&
                ` Augmente ton budget ou essaie un régime moins coûteux (${CHEAPER.filter((d) => d.id !== p.diet)
                  .map((d) => d.name)
                  .join(", ")}).`}
            </p>
            {overBudget && onBudget && fitting !== null && (
              <button type="button" onClick={() => onBudget(fitting)} className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent">
                Passer mon budget à {fitting} MAD / mois
              </button>
            )}
          </div>

          {kcalShort && (
            <p className="rounded-2xl border border-accent bg-accent-soft p-4 text-sm text-accent">
              ⚠️ Tes besoins sont élevés : ce menu apporte en moyenne {Math.round(avgKcal)} kcal sur {Math.round(targets.kcal)}. Ajoute des féculents,
              des fruits secs ou augmente ton budget pour combler l&apos;écart.
            </p>
          )}

          {p.kitchen === "etudiant" && (
            <p className="rounded-2xl border border-accent bg-accent-soft p-4 text-sm font-medium text-accent">
              🎓 Mode étudiant : plats en {STUDENT_MAX_MINUTES} min max, sans four.
            </p>
          )}

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold">Ton menu de la semaine</h3>
            <p className="text-sm text-muted">Assiettes complètes et rapides en priorité. Portions ajustées à tes calories, valeurs par personne. Clique sur un plat pour la recette.</p>
            <div className="mt-4 space-y-3">
              {week.days.map((d, i) => (
                <div key={i} className="rounded-xl bg-background p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{DAYS[i]}</p>
                    <p className="text-xs text-muted tabular-nums">
                      {Math.round(d.totals.kcal)} kcal · P {Math.round(d.totals.protein)} g · G {Math.round(d.totals.carbs)} g · L {Math.round(d.totals.fat)} g ·{" "}
                      <span className="font-semibold text-foreground">{mad(d.totals.cost)}</span>
                    </p>
                  </div>
                  <ul className={`mt-2 grid gap-1 text-sm ${d.meals.length > 4 ? "sm:grid-cols-5" : d.meals.length > 3 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
                    {d.meals.map((m, j) => (
                      <li key={j}>
                        <span className="text-xs text-accent">{MEALS[j]}</span>
                        <br />
                        <Link href={`/recettes/${m.recipe.id}`} className="hover:text-accent hover:underline">
                          {m.recipe.name}
                        </Link>
                        {Math.abs(m.scale - 1) > 0.05 && <span className="text-muted"> ×{m.scale.toFixed(1)}</span>}
                        <span className="block text-xs text-muted">{m.recipe.minutes} min</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-bold">Ta liste de courses</h3>
              <p className="font-display font-bold text-accent tabular-nums">{mad(week.shoppingTotal)}</p>
            </div>
            <p className="text-sm text-muted">
              Pour {p.people} personne{p.people > 1 ? "s" : ""}, 7 jours, arrondie aux paquets du magasin. Hors épices et pain.
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
                            {s.name}{" "}
                            <span className="text-muted">
                              · {s.soukKg !== undefined ? `${s.soukKg.toLocaleString("fr-MA")} kg au souk` : `${s.packs} × ${s.packLabel}`}
                            </span>
                          </span>
                          <span className="whitespace-nowrap tabular-nums">{mad(s.cost)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted">
              Prix {PRICE_SOURCE} relevés le {PRICE_DATE}.
              {p.produce === "souk" &&
                ` Fruits et légumes : estimation au souk à partir des prix de gros de Casablanca du ${WHOLESALE_DATE}.`}
            </p>
          </div>
        </>
      )}
      <p className="text-xs text-muted">
        Estimations basées sur la formule de Mifflin-St Jeor et des valeurs nutritionnelles moyennes. Ce n&apos;est pas un avis médical : en cas de pathologie,
        de grossesse ou de traitement, demande conseil à un professionnel de santé.
      </p>
    </div>
  );
}
