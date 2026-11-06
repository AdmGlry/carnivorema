"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addWeighIn, adherence, checkIn, CoachState, daysBetween, isoDay, newState, planDay, streak, trend } from "@/lib/coach";
import { Goal, Profile, computeTargets } from "@/lib/nutrition";
import { buildWeek } from "@/lib/planner";
import { recipeNutrition } from "@/lib/recipes";
import { Confetti, CountUp } from "./fun";

const PROFILE_KEY = "mizan-profil-v3";
const COACH_KEY = "mizan-coach-v1";
const TARGET_KG_PER_WEEK: Record<Goal, number> = { perdre: -0.5, "perdre-doux": -0.25, maintenir: 0, prendre: 0.25 };
const MEAL_ICONS: Record<string, string> = { "petit-dej": "🥞", plat: "🍽️", collation: "🍎" };

const read = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
const write = (key: string, v: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
};

type SavedProfile = { answers: Partial<Profile>; step: number };
const REQUIRED: (keyof Profile)[] = ["sex", "age", "weightKg", "heightCm", "activity", "goal", "diet"];

function WeightChart({ points }: { points: { date: string; kg: number }[] }) {
  if (points.length < 2) return <p className="text-sm text-muted">Ta courbe apparaît dès la 2e pesée.</p>;
  const t = trend(points);
  const all = [...points, ...t].map((p) => p.kg);
  const min = Math.min(...all) - 0.5;
  const max = Math.max(...all) + 0.5;
  const n = points.length;
  const x = (i: number) => 8 + (i / (n - 1)) * 284;
  const y = (kg: number) => 8 + ((max - kg) / (max - min)) * 104;
  return (
    <svg viewBox="0 0 300 120" className="h-36 w-full" role="img" aria-label={`Courbe de poids : ${points[0].kg} kg au départ, tendance ${t[n - 1].kg} kg`}>
      <polyline fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={t.map((p, i) => `${x(i)},${y(p.kg)}`).join(" ")} />
      {points.map((p, i) => (
        <circle key={p.date} cx={x(i)} cy={y(p.kg)} r="3" fill="var(--muted)" opacity="0.7" />
      ))}
    </svg>
  );
}

export default function Coach() {
  const [saved, setSaved] = useState<SavedProfile | null>(null);
  const [state, setState] = useState<CoachState | null>(null);
  const [kg, setKg] = useState("");
  const [party, setParty] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const today = isoDay(new Date());

  useEffect(() => {
    const sp = read<SavedProfile>(PROFILE_KEY);
    setSaved(sp);
    let st = read<CoachState>(COACH_KEY);
    if (!st && sp?.answers.weightKg) st = addWeighIn(newState(today), sp.answers.weightKg, today);
    setState(st);
    setLoaded(true);
  }, [today]);

  const profile = saved && REQUIRED.every((k) => saved.answers[k] !== undefined) ? ({ glutenFree: false, lactoseFree: false, people: 1, monthlyBudget: 1500, ...saved.answers } as Profile) : null;
  const targets = useMemo(() => (profile ? computeTargets(profile) : null), [profile]);
  const week = useMemo(() => (profile && targets ? buildWeek(profile, targets) : null), [profile, targets]);

  const update = (s: CoachState) => {
    setState(s);
    write(COACH_KEY, s);
  };

  if (!loaded) return <div className="min-h-[60vh]" />;
  if (!profile || !targets || !week || !state || week.days.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl" aria-hidden="true">🤖</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Ton coach t&apos;attend</h1>
        <p className="mt-3 text-muted">Réponds aux questions (1 minute) pour que ton coach connaisse ton corps, ton objectif et ton budget.</p>
        <Link href="/commencer" className="btn-glow mt-8 inline-block rounded-2xl bg-accent px-8 py-4 font-bold text-on-accent">
          Créer mon plan →
        </Link>
      </div>
    );
  }

  const dayIndex = planDay(state, today);
  const plan = week.days[dayIndex];
  const ticks = state.meals[today] ?? [];
  const eaten = plan.meals.reduce(
    (acc, m, i) => {
      if (!ticks[i]) return acc;
      const n = recipeNutrition(m.recipe, m.scale, profile.produce);
      return { kcal: acc.kcal + n.kcal, protein: acc.protein + n.protein };
    },
    { kcal: 0, protein: 0 },
  );
  const dayNumber = daysBetween(state.start, today) + 1;
  const mealsPerDay = (d: string) => week.days[planDay(state, d)].meals.length;
  const from = isoDay(new Date(Date.parse(today) - 6 * 86_400_000));
  const ad7 = adherence(state, from < state.start ? state.start : from, today, mealsPerDay);
  const ad14from = isoDay(new Date(Date.parse(today) - 13 * 86_400_000));
  const ad14 = adherence(state, ad14from < state.start ? state.start : ad14from, today, mealsPerDay);
  const fire = streak(state, today);
  const target = TARGET_KG_PER_WEEK[profile.goal];
  const bilan = checkIn(state, today, targets.kcal, target, ad14);
  const todayWeight = state.weighIns.find((w) => w.date === today);
  const tr = trend(state.weighIns);
  const lastTrend = tr[tr.length - 1]?.kg;
  const startKg = state.weighIns[0]?.kg;
  const canApply = bilan.ready && bilan.adjust !== 0 && state.lastCheckIn !== today && (!state.lastCheckIn || daysBetween(state.lastCheckIn, today) >= 7);

  const toggle = (i: number) => {
    const next = [...ticks];
    next[i] = !next[i];
    update({ ...state, meals: { ...state.meals, [today]: next } });
    if (next.filter(Boolean).length === plan.meals.length && !ticks.every(Boolean)) setParty((n) => n + 1);
  };

  const saveWeight = () => {
    const v = Number(kg.replace(",", "."));
    if (!Number.isFinite(v) || v < 30 || v > 300) return;
    update(addWeighIn(state, Math.round(v * 10) / 10, today));
    setKg("");
  };

  const apply = () => {
    if (!saved) return;
    const answers = { ...saved.answers, kcalAdjust: (saved.answers.kcalAdjust ?? 0) + bilan.adjust };
    const next = { ...saved, answers };
    setSaved(next);
    write(PROFILE_KEY, next);
    update({ ...state, lastCheckIn: today });
    setParty((n) => n + 1);
  };

  const card = "glass min-w-0 rounded-[1.75rem] p-6";
  const pct = (a: number, b: number) => `${Math.min(100, Math.round((a / b) * 100))}%`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <Confetti key={party} fire={party > 0} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Ton coach</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">
            Jour <span className="text-gradient">{dayNumber}</span> de ta transformation
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="glass rounded-2xl px-4 py-3 text-center">
            <p className="font-display text-2xl font-bold">🔥 {fire}</p>
            <p className="text-xs text-muted">jours d&apos;affilée</p>
          </div>
          <div className="glass rounded-2xl px-4 py-3 text-center">
            <p className="font-display text-2xl font-bold text-accent">{Math.round(ad7 * 100)} %</p>
            <p className="text-xs text-muted">plan suivi (7 j)</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Aujourd'hui */}
        <section className={`${card} md:col-span-3`} aria-labelledby="today-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="today-title" className="font-display text-xl font-bold">
              Aujourd&apos;hui
            </h2>
            <span className="text-sm text-muted">Coche ce que tu as mangé</span>
          </div>
          <ul className="mt-5 space-y-3">
            {plan.meals.map((m, i) => {
              const n = recipeNutrition(m.recipe, m.scale, profile.produce);
              const done = Boolean(ticks[i]);
              return (
                <li key={i}>
                  <button
                    type="button"
                    aria-pressed={done}
                    onClick={() => toggle(i)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${done ? "border-accent bg-accent-soft" : "border-border hover:border-accent"}`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-xl text-lg transition-transform ${done ? "scale-110 bg-accent text-on-accent" : "border border-border"}`}
                      aria-hidden="true"
                    >
                      {done ? "✓" : MEAL_ICONS[m.recipe.meal]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-semibold leading-snug ${done ? "line-through decoration-accent/60" : ""}`}>{m.recipe.name}</span>
                      <span className="block text-xs text-muted">
                        {Math.round(n.kcal)} kcal · {Math.round(n.protein)} g protéines · {m.recipe.minutes} min
                      </span>
                    </span>
                    <Link
                      href={`/recettes/${m.recipe.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 text-xs font-semibold text-accent hover:underline"
                    >
                      Recette
                    </Link>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 space-y-3">
            {[
              ["Calories", eaten.kcal, targets.kcal, "kcal"],
              ["Protéines", eaten.protein, targets.protein, "g"],
            ].map(([label, v, max, unit]) => (
              <div key={label as string}>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="tabular-nums">
                    <strong>{Math.round(v as number)}</strong> / {Math.round(max as number)} {unit}
                  </span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: pct(v as number, max as number) }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pesée */}
        <section className={`${card} md:col-span-2`} aria-labelledby="weight-title">
          <h2 id="weight-title" className="font-display text-xl font-bold">
            Ta pesée
          </h2>
          <p className="mt-1 text-sm text-muted">Chaque matin, à jeun, après les toilettes.</p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              saveWeight();
            }}
          >
            <label className="sr-only" htmlFor="kg">
              Poids du jour en kilos
            </label>
            <input
              id="kg"
              inputMode="decimal"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              placeholder={todayWeight ? `${todayWeight.kg}` : lastTrend ? `${lastTrend}` : "75,0"}
              className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-3 font-display text-2xl font-bold tabular-nums"
            />
            <button type="submit" className="btn-glow rounded-2xl bg-accent px-5 font-bold text-on-accent">
              {todayWeight ? "Modifier" : "OK"}
            </button>
          </form>
          {todayWeight && <p className="mt-2 text-sm text-accent">✓ Pesée du jour : {todayWeight.kg.toLocaleString("fr-FR")} kg</p>}
          <div className="mt-4">
            <WeightChart points={state.weighIns.slice(-30)} />
          </div>
          {startKg !== undefined && lastTrend !== undefined && (
            <dl className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-accent-soft p-2">
                <dt className="text-xs text-muted">Tendance</dt>
                <dd className="font-display text-lg font-bold tabular-nums">{lastTrend.toLocaleString("fr-FR")} kg</dd>
              </div>
              <div className="rounded-xl bg-accent-soft p-2">
                <dt className="text-xs text-muted">Depuis le début</dt>
                <dd className="font-display text-lg font-bold tabular-nums">
                  {lastTrend - startKg > 0 ? "+" : ""}
                  {(Math.round((lastTrend - startKg) * 10) / 10).toLocaleString("fr-FR")} kg
                </dd>
              </div>
            </dl>
          )}
        </section>

        {/* Bilan */}
        <section className="ring-gradient min-w-0 rounded-[1.75rem] bg-card p-6 md:col-span-5" aria-labelledby="bilan-title">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Bilan du coach</p>
              <h2 id="bilan-title" className="mt-2 font-display text-2xl font-bold">
                {bilan.ready ? "Ton ajustement de la semaine" : "Le coach apprend ton métabolisme"}
              </h2>
              <p className="mt-3 text-muted">{bilan.message}</p>
              {bilan.estimatedTdee && (
                <p className="mt-2 text-sm text-muted">
                  Ta dépense réelle estimée : <strong className="text-foreground">{bilan.estimatedTdee.toLocaleString("fr-FR")} kcal/jour</strong> (formule de
                  départ : {Math.round(targets.tdee).toLocaleString("fr-FR")}).
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Ta cible actuelle</p>
              <p className="font-display text-4xl font-bold text-accent tabular-nums">
                <CountUp value={Math.round(targets.kcal)} /> kcal
              </p>
              <p className="text-xs text-muted">{Math.round(targets.protein)} g de protéines par jour</p>
            </div>
          </div>
          {canApply && (
            <button type="button" onClick={apply} className="btn-glow mt-6 rounded-2xl bg-accent px-6 py-3 font-bold text-on-accent">
              Appliquer : {bilan.adjust > 0 ? "+" : ""}
              {bilan.adjust} kcal/jour → nouveau menu
            </button>
          )}
          {state.lastCheckIn === today && <p className="mt-4 text-sm font-semibold text-accent">✓ Ajustement appliqué : ton menu est recalculé.</p>}
          <p className="mt-4 text-xs text-muted">
            Le coach compare ce que tu manges à ta courbe de poids lissée pour estimer ta vraie dépense, puis corrige ta cible de 150 kcal au plus par semaine.
            Ce n&apos;est pas un avis médical.
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/commencer" className="glass rounded-2xl px-5 py-3 font-semibold hover:border-accent">
          Voir mon menu de la semaine et ma liste de courses →
        </Link>
      </div>
    </div>
  );
}
