"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import MacroBar from "./MacroBar";
import { RecipeBadges, type RecipeCard } from "./RecipeTile";

/** Recette tirée au sort, affichée en grand dans une carte qui se retourne. */
export default function RecipePick({
  recipe,
  spin,
  total,
  onAgain,
  onClose,
}: {
  recipe: RecipeCard;
  spin: number;
  total: number;
  onAgain: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const again = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    again.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialog.current) {
        // Garde le focus dans la fenêtre.
        const items = dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pick-title"
        className="w-full max-w-md"
        style={{ perspective: "1200px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div key={spin} className="pick-flip rounded-3xl border border-border bg-card p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              <span aria-hidden="true">🎲 </span>Tirée parmi {total} recette{total > 1 ? "s" : ""}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:text-accent"
            >
              ✕
            </button>
          </div>
          <p className="mt-4 text-sm text-muted">{recipe.mealLabel}</p>
          <h2 id="pick-title" className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl" aria-live="polite">
            {recipe.name}
          </h2>
          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { k: "Protéines", v: `${recipe.protein} g`, big: true },
              { k: "Calories", v: `${recipe.kcal}` },
              { k: "Par pers.", v: recipe.cost.replace(" MAD", " DH") },
            ].map((s) => (
              <div key={s.k} className={`rounded-2xl p-3 ${s.big ? "bg-accent text-on-accent" : "bg-accent-soft"}`}>
                <dt className={`text-[11px] ${s.big ? "" : "text-muted"}`}>{s.k}</dt>
                <dd className="mt-0.5 text-lg font-extrabold leading-tight">{s.v}</dd>
              </div>
            ))}
          </dl>
          <MacroBar protein={recipe.protein} carbs={recipe.carbs} fat={recipe.fat} className="mt-4" />
          <div className="mt-4">
            <RecipeBadges r={recipe} />
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              ref={again}
              type="button"
              onClick={onAgain}
              disabled={total < 2}
              className="flex-1 rounded-full border border-border bg-background px-5 py-2.5 font-semibold hover:border-accent disabled:opacity-50"
            >
              <span aria-hidden="true">🎲 </span>Une autre
            </button>
            <Link href={`/recettes/${recipe.id}`} className="flex-1 rounded-full bg-accent px-5 py-2.5 text-center font-semibold text-on-accent">
              Voir la recette
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
