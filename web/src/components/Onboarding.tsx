"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { mad } from "@/lib/foods";
import { DietId, Goal, Kitchen, Profile, Sex, activityLevels, bmiLabel, computeTargets, diets, goals } from "@/lib/nutrition";
import { buildWeek } from "@/lib/planner";
import PlanResults from "./PlanResults";
import Scale3D from "./Scale3D";
import { Confetti, tiltHandlers } from "./fun";

const STORAGE_KEY = "mizan-profil-v3";

const defaults: Profile = {
  sex: "femme",
  age: 30,
  weightKg: 72,
  heightCm: 170,
  activity: 1.375,
  goal: "maintenir",
  diet: "equilibre",
  glutenFree: false,
  lactoseFree: false,
  people: 1,
  monthlyBudget: 1500,
};

type StepId = "sexe" | "age" | "poids" | "taille" | "activite" | "objectif" | "regime" | "allergies" | "courses" | "cuisine" | "foyer" | "budget";

const STEPS: { id: StepId; title: string; hint: string }[] = [
  { id: "sexe", title: "Tu es…", hint: "Le métabolisme de base n'est pas le même pour un homme et pour une femme." },
  { id: "age", title: "Quel âge as-tu ?", hint: "Les besoins en calories baissent un peu avec l'âge." },
  { id: "poids", title: "Combien pèses-tu ?", hint: "Ton poids actuel, même approximatif." },
  { id: "taille", title: "Combien mesures-tu ?", hint: "Avec ton poids, ça donne ton IMC." },
  { id: "activite", title: "Tu bouges combien ?", hint: "Compte le sport et le travail physique." },
  { id: "objectif", title: "Ton objectif ?", hint: "On ajuste tes calories en douceur, sans régime extrême." },
  { id: "regime", title: "Comment tu manges ?", hint: "Tu pourras changer à tout moment." },
  { id: "allergies", title: "Quelque chose à éviter ?", hint: "Coche ce qui s'applique, ou passe." },
  { id: "courses", title: "Tes fruits et légumes, tu les achètes où ?", hint: "Au souk, ils coûtent souvent moins cher. On estime leur prix chaque semaine." },
  { id: "cuisine", title: "Comment tu cuisines ?", hint: "En mode étudiant, on garde les plats rapides, pas chers et sans four." },
  { id: "foyer", title: "Vous êtes combien à table ?", hint: "La liste de courses sera calculée pour tout le foyer." },
  { id: "budget", title: "Ton budget courses par mois ?", hint: "Pour tout le foyer, en dirhams." },
];

const activityHints = ["Bureau, voiture, peu de marche", "Marche régulière ou 1 à 3 séances", "3 à 5 séances par semaine", "Sport presque tous les jours", "Sport intense et métier physique"];
const activityTitles = ["Sédentaire", "Légèrement actif", "Actif", "Très actif", "Athlète"];

type Saved = { answers: Partial<Profile>; step: number };

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

function Choice({
  selected,
  onClick,
  title,
  text,
  badge,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  text?: string;
  badge?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      {...tiltHandlers()}
      className={`tilt-card group flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selected ? "pop " : ""}${
        selected ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-accent/60"
      }`}
    >
      {badge && (
        <span aria-hidden="true" className="text-2xl leading-none">
          {badge}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block font-semibold ${selected ? "text-accent" : ""}`}>{title}</span>
        {text && <span className="mt-0.5 block text-sm text-muted">{text}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${selected ? "border-accent bg-accent shadow-[inset_0_0_0_3px_var(--card)]" : "border-border"}`}
      />
    </button>
  );
}

function Measure({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  label,
}: {
  id: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  label: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          aria-label={`Diminuer ${label}`}
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-border text-2xl hover:border-accent"
        >
          −
        </button>
        <label htmlFor={id} className="flex items-baseline gap-2">
          <span className="sr-only">{label}</span>
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="font-display w-[4ch] bg-transparent text-center text-7xl font-bold tabular-nums outline-none [appearance:textfield] focus-visible:rounded-lg sm:text-8xl [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xl text-muted">{unit}</span>
        </label>
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          aria-label={`Augmenter ${label}`}
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-border text-2xl hover:border-accent"
        >
          +
        </button>
      </div>
      <input
        type="range"
        aria-label={`${label} (curseur)`}
        min={min}
        max={max}
        step={step}
        value={clamp(Number.isFinite(value) ? value : min)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-md accent-[var(--accent)]"
      />
      <div className="flex w-full max-w-md justify-between text-xs text-muted tabular-nums">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}

export default function Onboarding() {
  const [answers, setAnswers] = useState<Partial<Profile>>({});
  const [step, setStep] = useState(0);
  const [editingFromResult, setEditingFromResult] = useState(false);
  const [restored, setRestored] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const done = step >= STEPS.length;
  const p: Profile = { ...defaults, ...answers };

  // Reprise là où la personne s'était arrêtée.
  useEffect(() => {
    const s = load();
    if (s) {
      setAnswers(s.answers);
      setStep(Math.min(s.step, STEPS.length));
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored) save({ answers, step });
  }, [answers, step, restored]);

  useEffect(() => {
    if (restored) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, restored]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setAnswers((a) => ({ ...a, [k]: v }));

  const go = (n: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setStep(Math.max(0, Math.min(STEPS.length, n)));
  };
  const next = () => {
    if (!editingFromResult && step === STEPS.length - 1) setCelebrate(true);
    go(editingFromResult ? STEPS.length : step + 1);
  };
  const pick = <K extends keyof Profile>(k: K, v: Profile[K]) => {
    set(k, v);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(next, 220);
  };

  const bmi = p.weightKg / (p.heightCm / 100) ** 2;
  const valid: Record<StepId, boolean> = {
    sexe: answers.sex !== undefined,
    age: p.age >= 12 && p.age <= 100,
    poids: p.weightKg >= 30 && p.weightKg <= 250,
    taille: p.heightCm >= 120 && p.heightCm <= 230,
    activite: answers.activity !== undefined,
    objectif: answers.goal !== undefined,
    regime: answers.diet !== undefined,
    allergies: true,
    courses: answers.produce !== undefined,
    cuisine: answers.kitchen !== undefined,
    foyer: p.people >= 1 && p.people <= 12,
    budget: p.monthlyBudget >= 100,
  };

  // Repère de budget : coût d'une semaine type pour ce régime, sans contrainte de budget puis au plus serré.
  const budgetHint = useMemo(() => {
    if (STEPS[step]?.id !== "budget") return null;
    const base = { ...p, monthlyBudget: 1_000_000 };
    const t = computeTargets(base);
    const free = buildWeek(base, t);
    const tight = { ...p, monthlyBudget: 100 };
    const cheap = buildWeek(tight, computeTargets(tight));
    if (free.error || cheap.error) return null;
    return {
      comfortable: Math.round((free.weekCostPerPerson / 7) * 30 * p.people / 50) * 50,
      minimum: Math.round((cheap.weekCostPerPerson / 7) * 30 * p.people / 50) * 50,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, p.sex, p.age, p.weightKg, p.heightCm, p.activity, p.goal, p.diet, p.glutenFree, p.lactoseFree, p.people, p.kitchen]);

  // La balance du budget : coût réel du menu au budget choisi, recalculé sans bloquer la saisie.
  const deferredBudget = useDeferredValue(p.monthlyBudget);
  const budgetCost = useMemo(() => {
    if (STEPS[step]?.id !== "budget") return null;
    const q = { ...p, monthlyBudget: deferredBudget };
    const w = buildWeek(q, computeTargets(q));
    return w.error ? null : (w.weekCostPerPerson / 7) * 30 * p.people;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, deferredBudget, p.sex, p.age, p.weightKg, p.heightCm, p.activity, p.goal, p.diet, p.glutenFree, p.lactoseFree, p.people, p.kitchen]);
  const budgetTilt = budgetCost === null ? 0 : Math.max(-1, Math.min(1, ((budgetCost - p.monthlyBudget) / Math.max(1, p.monthlyBudget)) * 3));

  if (!restored) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (done) {
    const summary: { label: string; step: StepId }[] = [
      { label: p.sex === "homme" ? "Homme" : "Femme", step: "sexe" },
      { label: `${p.age} ans`, step: "age" },
      { label: `${p.weightKg} kg`, step: "poids" },
      { label: `${p.heightCm} cm`, step: "taille" },
      { label: activityTitles[activityLevels.findIndex((a) => a.value === p.activity)] ?? "Activité", step: "activite" },
      { label: goals.find((g) => g.value === p.goal)!.label.split(" (")[0], step: "objectif" },
      { label: diets.find((d) => d.id === p.diet)!.name, step: "regime" },
      ...(p.glutenFree ? [{ label: "Sans gluten", step: "allergies" as StepId }] : []),
      ...(p.lactoseFree ? [{ label: "Sans lactose", step: "allergies" as StepId }] : []),
      { label: p.produce === "souk" ? "Légumes au souk" : "Légumes au supermarché", step: "courses" },
      { label: p.kitchen === "etudiant" ? "Mode étudiant" : "Cuisine complète", step: "cuisine" },
      { label: `${p.people} pers.`, step: "foyer" },
      { label: `${p.monthlyBudget} MAD/mois`, step: "budget" },
    ];
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <Confetti fire={celebrate} />
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Ton plan</p>
        <h1 ref={headingRef} tabIndex={-1} className="font-display mt-2 text-4xl font-bold text-balance outline-none sm:text-5xl">
          Voici ta semaine
        </h1>
        <p className="mt-3 text-muted">Touche une réponse pour la modifier. Tout se recalcule.</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tes réponses">
          {summary.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => {
                  setEditingFromResult(true);
                  go(STEPS.findIndex((x) => x.id === s.step));
                }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-accent"
              >
                {s.label} <span aria-hidden="true" className="text-muted">✎</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <PlanResults profile={p} onBudget={(n) => set("monthlyBudget", n)} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#beta" className="rounded-full bg-accent px-6 py-3 font-semibold text-on-accent">
            Garder mon plan : rejoindre la bêta
          </Link>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setEditingFromResult(false);
              go(0);
            }}
            className="rounded-full border border-border px-6 py-3 font-semibold"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  const current = STEPS[step];
  const progress = (step / STEPS.length) * 100;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl flex-col px-4 pb-8 pt-6">
      {/* Progression */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (editingFromResult ? go(STEPS.length) : go(step - 1))}
          disabled={step === 0 && !editingFromResult}
          className="rounded-full px-2 py-1 text-sm font-medium text-muted hover:text-foreground disabled:invisible"
        >
          ← {editingFromResult ? "Mon plan" : "Retour"}
        </button>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-label="Progression"
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
          aria-valuenow={step}
        >
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm text-muted tabular-nums">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <form
        key={current.id}
        className="step-enter mt-10 flex flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid[current.id]) next();
        }}
      >
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-4xl font-bold text-balance outline-none sm:text-5xl">
          {current.title}
        </h1>
        <p className="mt-3 text-muted">{current.hint}</p>

        <div className="mt-8 flex-1">
          {current.id === "sexe" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(["femme", "homme"] as Sex[]).map((s) => (
                <Choice key={s} selected={answers.sex === s} onClick={() => pick("sex", s)} title={s === "femme" ? "Une femme" : "Un homme"} />
              ))}
            </div>
          )}

          {current.id === "age" && <Measure id="ob-age" label="ton âge" value={p.age} onChange={(n) => set("age", n)} min={12} max={100} unit="ans" />}

          {current.id === "poids" && (
            <Measure id="ob-poids" label="ton poids" value={p.weightKg} onChange={(n) => set("weightKg", n)} min={30} max={250} step={0.5} unit="kg" />
          )}

          {current.id === "taille" && (
            <>
              <Measure id="ob-taille" label="ta taille" value={p.heightCm} onChange={(n) => set("heightCm", n)} min={120} max={230} unit="cm" />
              {valid.taille && (
                <p className="mt-8 text-center text-sm text-muted">
                  IMC <strong className="font-display text-base text-foreground tabular-nums">{bmi.toFixed(1)}</strong> · {bmiLabel(bmi)}
                </p>
              )}
            </>
          )}

          {current.id === "activite" && (
            <div className="grid gap-3">
              {activityLevels.map((a, i) => (
                <Choice key={a.value} selected={answers.activity === a.value} onClick={() => pick("activity", a.value)} title={activityTitles[i]} text={activityHints[i]} />
              ))}
            </div>
          )}

          {current.id === "objectif" && (
            <div className="grid gap-3">
              {goals.map((g) => {
                const blocked = bmi < 18.5 && g.value.startsWith("perdre");
                const [title, rate] = g.label.split(" (");
                return (
                  <Choice
                    key={g.value}
                    selected={answers.goal === g.value}
                    onClick={() => pick("goal", g.value as Goal)}
                    title={title}
                    text={blocked ? "Indisponible : ton IMC est déjà bas." : rate ? rate.replace(")", "") : undefined}
                    disabled={blocked}
                  />
                );
              })}
            </div>
          )}

          {current.id === "regime" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {diets.map((d) => (
                <Choice key={d.id} selected={answers.diet === d.id} onClick={() => pick("diet", d.id as DietId)} badge={d.emoji} title={d.name} text={d.description} />
              ))}
            </div>
          )}

          {current.id === "allergies" && (
            <div className="grid gap-3">
              <Choice selected={p.glutenFree} onClick={() => set("glutenFree", !p.glutenFree)} title="Sans gluten" text="Pas de pain, pâtes, couscous ni flocons d'avoine" />
              <Choice selected={p.lactoseFree} onClick={() => set("lactoseFree", !p.lactoseFree)} title="Sans lactose" text="Pas de lait, yaourt, raïb ni kéfir" />
            </div>
          )}

          {current.id === "courses" && (
            <div className="grid gap-3">
              <Choice
                selected={answers.produce === "souk"}
                onClick={() => pick("produce", "souk")}
                badge="🧺"
                title="Au souk, au marché ou chez le primeur"
                text="Prix estimés à partir des prix de gros de Casablanca de la semaine"
              />
              <Choice
                selected={answers.produce === "supermarche"}
                onClick={() => pick("produce", "supermarche")}
                badge="🛒"
                title="Au supermarché"
                text="Prix réels relevés chez Carrefour"
              />
            </div>
          )}

          {current.id === "cuisine" && (
            <div className="grid gap-3">
              {(
                [
                  { value: "complete", badge: "🍳", title: "Cuisine complète", text: "J'ai le temps et un four" },
                  { value: "etudiant", badge: "🎓", title: "Mode étudiant", text: "Rapide, pas cher, une poêle ou un micro-ondes" },
                ] as { value: Kitchen; badge: string; title: string; text: string }[]
              ).map((k) => (
                <Choice key={k.value} selected={answers.kitchen === k.value} onClick={() => pick("kitchen", k.value)} badge={k.badge} title={k.title} text={k.text} />
              ))}
            </div>
          )}

          {current.id === "foyer" && (
            <div className="flex flex-col items-center gap-6">
              <Measure id="ob-foyer" label="le nombre de personnes" value={p.people} onChange={(n) => set("people", Math.round(n))} min={1} max={12} unit={p.people > 1 ? "personnes" : "personne"} />
            </div>
          )}

          {current.id === "budget" && (
            <>
              <Scale3D
                tilt={budgetTilt}
                className="mx-auto -mt-4 h-52 w-full max-w-sm sm:h-60"
                label={
                  budgetCost === null
                    ? "Balance du budget"
                    : budgetTilt > 0.05
                      ? "La balance penche côté assiette : le budget ne couvre pas le menu"
                      : "La balance est équilibrée : le budget couvre le menu"
                }
              />
              {budgetCost !== null && (
                <p className={`mb-6 text-center text-sm font-medium ${budgetTilt > 0.05 ? "text-accent" : "text-muted"}`} aria-live="polite">
                  {budgetTilt > 0.05
                    ? `Il manque environ ${Math.round((budgetCost - p.monthlyBudget) / 50) * 50} MAD : l'assiette pèse plus lourd.`
                    : "Ton budget couvre le menu : la balance est à l'équilibre."}
                </p>
              )}
              <Measure id="ob-budget" label="ton budget mensuel" value={p.monthlyBudget} onChange={(n) => set("monthlyBudget", n)} min={300} max={15000} step={50} unit="MAD" />
              <div className="mx-auto mt-8 grid max-w-md gap-2 text-sm">
                <p className="flex justify-between gap-3 border-b border-border pb-2">
                  <span className="text-muted">Par jour et par personne</span>
                  <strong className="tabular-nums">{mad(p.monthlyBudget / 30 / Math.max(1, p.people))}</strong>
                </p>
                {budgetHint && (
                  <>
                    <p className="flex justify-between gap-3 border-b border-border pb-2">
                      <span className="text-muted">Minimum réaliste pour ce régime</span>
                      <button type="button" onClick={() => set("monthlyBudget", budgetHint.minimum)} className="font-semibold text-accent tabular-nums underline-offset-2 hover:underline">
                        ≈ {budgetHint.minimum} MAD
                      </button>
                    </p>
                    <p className="flex justify-between gap-3">
                      <span className="text-muted">Confortable, sans compter</span>
                      <button type="button" onClick={() => set("monthlyBudget", budgetHint.comfortable)} className="font-semibold text-accent tabular-nums underline-offset-2 hover:underline">
                        ≈ {budgetHint.comfortable} MAD
                      </button>
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 mt-10 bg-background/95 pb-[env(safe-area-inset-bottom,0px)] pt-3 backdrop-blur">
          <button
            type="submit"
            disabled={!valid[current.id]}
            className="w-full rounded-full bg-accent px-6 py-4 text-lg font-semibold text-on-accent transition-opacity disabled:opacity-40"
          >
            {editingFromResult ? "Mettre à jour mon plan" : step === STEPS.length - 1 ? "Voir mon plan" : current.id === "allergies" && !p.glutenFree && !p.lactoseFree ? "Rien à éviter" : "Continuer"}
          </button>
        </div>
      </form>
    </div>
  );
}
