"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CountUp } from "@/components/fun";
import RecipePick from "@/components/RecipePick";
import RecipeTile, { type RecipeCard } from "@/components/RecipeTile";

export type { RecipeCard };

type Option = { id: string; label: string };

type Flag = "etudiant" | "fitness" | "rapide" | "budget" | "proteines";
type SortId = "defaut" | "proteines" | "prix" | "temps" | "ratio";

type Filters = {
  diet: string;
  meal: string;
  equip: string;
  q: string;
  sort: SortId;
  flags: Flag[];
};

const DEFAULTS: Filters = { diet: "tous", meal: "tous", equip: "tous", q: "", sort: "defaut", flags: [] };

const QUICK: { id: Flag; label: string; emoji: string; test: (r: RecipeCard) => boolean }[] = [
  { id: "etudiant", label: "Étudiant", emoji: "🎓", test: (r) => r.tags.includes("etudiant") },
  { id: "fitness", label: "Fitness", emoji: "💪", test: (r) => r.tags.includes("fitness") },
  { id: "rapide", label: "≤ 15 min", emoji: "⚡", test: (r) => r.minutes <= 15 },
  { id: "budget", label: "≤ 10 DH", emoji: "💸", test: (r) => r.costValue <= 10 },
  { id: "proteines", label: "≥ 25 g de protéines", emoji: "🥩", test: (r) => r.protein >= 25 },
];

// « Je n'ai que ça » : la recette ne demande rien d'autre que ce matériel.
const EQUIPMENT: (Option & { kit: string[] })[] = [
  { id: "micro-ondes", label: "📡 Micro-ondes", kit: ["micro-ondes", "sans-cuisson"] },
  { id: "poele", label: "🍳 Poêle seule", kit: ["poele", "sans-cuisson"] },
  { id: "sans-cuisson", label: "🥗 Sans cuisson", kit: ["sans-cuisson"] },
];

const SORTS: { id: SortId; label: string; compare?: (a: RecipeCard, b: RecipeCard) => number }[] = [
  { id: "defaut", label: "Par défaut" },
  { id: "proteines", label: "💪 Protéines", compare: (a, b) => b.protein - a.protein },
  { id: "prix", label: "💸 Prix", compare: (a, b) => a.costValue - b.costValue },
  { id: "temps", label: "⚡ Temps", compare: (a, b) => a.minutes - b.minutes },
  { id: "ratio", label: "🏆 Protéines / DH", compare: (a, b) => ratio(b) - ratio(a) },
];

const ratio = (r: RecipeCard) => r.protein / Math.max(r.costValue, 0.01);
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe")
    .toLowerCase()
    .trim();

function readUrl(): Filters {
  const p = new URLSearchParams(window.location.search);
  const sort = p.get("tri") as SortId | null;
  const flags = (p.get("filtres") ?? "").split(",").filter((f): f is Flag => QUICK.some((q) => q.id === f));
  return {
    diet: p.get("regime") ?? "tous",
    meal: p.get("repas") ?? "tous",
    equip: p.get("materiel") ?? "tous",
    q: p.get("q") ?? "",
    sort: sort && SORTS.some((s) => s.id === sort) ? sort : "defaut",
    flags,
  };
}

function writeUrl(f: Filters) {
  const p = new URLSearchParams();
  if (f.flags.length) p.set("filtres", f.flags.join(","));
  if (f.diet !== "tous") p.set("regime", f.diet);
  if (f.meal !== "tous") p.set("repas", f.meal);
  if (f.equip !== "tous") p.set("materiel", f.equip);
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.sort !== "defaut") p.set("tri", f.sort);
  const qs = p.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, "", url);
}

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`recipe-chip inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
        pressed ? "border-accent bg-accent text-on-accent font-semibold shadow-sm" : "border-border bg-card hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}

function ChipGroup({ legend, options, value, onChange }: { legend: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o.id} pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

export default function RecipeFilter({ recipes, diets, meals }: { recipes: RecipeCard[]; diets: Option[]; meals: Option[] }) {
  const [f, setF] = useState<Filters>(DEFAULTS);
  const loaded = useRef(false);
  const [pick, setPick] = useState<{ id: string; spin: number } | null>(null);

  // Lit les filtres partagés dans l'URL au chargement, puis les y reflète à chaque changement.
  useEffect(() => {
    setF(readUrl());
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current) writeUrl(f);
  }, [f]);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }));
  const toggle = (flag: Flag) =>
    setF((prev) => ({ ...prev, flags: prev.flags.includes(flag) ? prev.flags.filter((x) => x !== flag) : [...prev.flags, flag] }));

  const search = useMemo(() => new Map(recipes.map((r) => [r.id, normalize([r.name, ...r.ingredients].join(" "))])), [recipes]);

  const visible = useMemo(() => {
    const q = normalize(f.q);
    const kit = EQUIPMENT.find((e) => e.id === f.equip)?.kit;
    const tests = QUICK.filter((x) => f.flags.includes(x.id)).map((x) => x.test);
    const list = recipes.filter(
      (r) =>
        (f.diet === "tous" || r.diets.includes(f.diet)) &&
        (f.meal === "tous" || r.meal === f.meal) &&
        (!kit || (r.equipment.length > 0 && r.equipment.every((e) => kit.includes(e)))) &&
        tests.every((t) => t(r)) &&
        (!q || search.get(r.id)!.includes(q)),
    );
    const compare = SORTS.find((s) => s.id === f.sort)?.compare;
    return compare ? [...list].sort(compare) : list;
  }, [recipes, f, search]);

  const active = f.flags.length > 0 || f.diet !== "tous" || f.meal !== "tous" || f.equip !== "tous" || f.q.trim() !== "";

  const draw = useCallback(() => {
    if (visible.length === 0) return;
    setPick((prev) => {
      const pool = visible.length > 1 && prev ? visible.filter((r) => r.id !== prev.id) : visible;
      const next = pool[Math.floor(Math.random() * pool.length)];
      return { id: next.id, spin: (prev?.spin ?? 0) + 1 };
    });
  }, [visible]);
  const closePick = useCallback(() => setPick(null), []);
  const picked = pick && recipes.find((r) => r.id === pick.id);

  return (
    <div>
      <style>{CSS}</style>

      <div className="space-y-5 rounded-3xl border border-border bg-card p-4 sm:p-6">
        <div>
          <label htmlFor="recipe-search" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Rechercher
          </label>
          <div className="relative mt-2">
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              🔍
            </span>
            <input
              id="recipe-search"
              type="search"
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Poulet, lentilles, omelette…"
              autoComplete="off"
              className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-base outline-none focus:border-accent"
            />
          </div>
        </div>

        <fieldset className="min-w-0">
          <legend className="text-xs font-semibold uppercase tracking-wide text-muted">Filtres rapides</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK.map((x) => (
              <Chip key={x.id} pressed={f.flags.includes(x.id)} onClick={() => toggle(x.id)}>
                <span>{x.label}</span>
                <span aria-hidden="true">{x.emoji}</span>
              </Chip>
            ))}
          </div>
        </fieldset>

        <ChipGroup legend="Repas" options={[{ id: "tous", label: "Tous" }, ...meals]} value={f.meal} onChange={(v) => set("meal", v)} />
        <ChipGroup legend="Régime" options={[{ id: "tous", label: "Tous" }, ...diets]} value={f.diet} onChange={(v) => set("diet", v)} />
        <ChipGroup
          legend="Matériel (je n'ai que…)"
          options={[{ id: "tous", label: "Peu importe" }, ...EQUIPMENT]}
          value={f.equip}
          onChange={(v) => set("equip", v)}
        />
        <ChipGroup legend="Trier par" options={SORTS} value={f.sort} onChange={(v) => set("sort", v as SortId)} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-baseline gap-2">
          <span aria-hidden="true" className="text-3xl font-extrabold tabular-nums text-accent">
            <CountUp value={visible.length} />
          </span>
          <span aria-hidden="true" className="text-sm text-muted">
            recette{visible.length > 1 ? "s" : ""}
          </span>
          <span className="sr-only" aria-live="polite">
            {visible.length} recette{visible.length > 1 ? "s" : ""}
          </span>
          {active && (
            <button type="button" onClick={() => setF({ ...DEFAULTS, sort: f.sort })} className="ml-2 text-sm text-muted underline hover:text-accent">
              Réinitialiser
            </button>
          )}
        </p>
        <button
          type="button"
          onClick={draw}
          disabled={visible.length === 0}
          className="dice-btn inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-semibold text-on-accent shadow-md disabled:opacity-50"
        >
          Pioche une recette <span aria-hidden="true" className="dice">🎲</span>
        </button>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((r, i) => (
          <li key={r.id} className="recipe-rise" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
            <RecipeTile r={r} />
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-3xl" aria-hidden="true">🍽️</p>
          <p className="mt-2 text-muted">Aucune recette pour cette combinaison pour l&apos;instant.</p>
          <button type="button" onClick={() => setF(DEFAULTS)} className="mt-4 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-accent">
            Retirer les filtres
          </button>
        </div>
      )}

      {picked && pick && <RecipePick recipe={picked} spin={pick.spin} total={visible.length} onAgain={draw} onClose={closePick} />}
    </div>
  );
}

const CSS = `
@keyframes recipe-rise { from { opacity: 0; transform: perspective(800px) translateY(14px) scale(0.98); } to { opacity: 1; } }
.recipe-rise { animation: recipe-rise 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
@keyframes pick-flip {
  0% { opacity: 0; transform: rotateY(-180deg) scale(0.85); }
  60% { opacity: 1; }
  100% { transform: rotateY(0) scale(1); }
}
.pick-flip { animation: pick-flip 650ms cubic-bezier(0.2, 0.8, 0.2, 1) both; backface-visibility: hidden; transform-style: preserve-3d; }
.recipe-chip { transition: transform 150ms ease-out, background-color 150ms, border-color 150ms, color 150ms; }
.recipe-chip:active { transform: scale(0.94); }
.recipe-chip[aria-pressed="true"] { animation: chip-pop 260ms ease-out; }
@keyframes chip-pop { 0% { transform: scale(0.92); } 60% { transform: scale(1.06); } 100% { transform: scale(1); } }
.macro-seg { transition: width 400ms ease-out; }
.dice-btn { transition: transform 150ms ease-out; }
.dice-btn:not(:disabled):hover { transform: translateY(-1px); }
.dice-btn:not(:disabled):active { transform: scale(0.96); }
.dice { display: inline-block; transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.dice-btn:not(:disabled):hover .dice { transform: rotate(200deg); }
@media (prefers-reduced-motion: reduce) {
  .recipe-rise, .pick-flip, .recipe-chip[aria-pressed="true"] { animation: none; }
  .recipe-chip, .recipe-chip:active, .dice-btn, .dice, .macro-seg { transition: none; transform: none; }
  .dice-btn:not(:disabled):hover .dice, .dice-btn:not(:disabled):hover, .dice-btn:not(:disabled):active { transform: none; }
}
`;
