"use client";

import { useEffect, useRef } from "react";
import { mad } from "@/lib/foods";
import { MARJANE_DATE, compareOffers } from "@/lib/marjane";

const fmtG = (g: number) => (g >= 1000 ? `${(Math.round(g / 10) / 100).toLocaleString("fr-MA")} kg` : `${Math.round(g)} g`);

// Fiche d'un article de la liste de courses : le même produit chez chaque enseigne,
// son prix affiché, son prix au kilo et le coût exact de la quantité nécessaire.
export default function ProductSheet({ item, onClose }: { item: { id: string; name: string; grams: number }; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const offers = compareOffers(item.id, item.grams);
  const best = offers[0];

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="sheet-in max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] border border-border bg-card p-6 outline-none sm:rounded-[2rem]"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border sm:hidden" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Ta liste de courses</p>
            <h3 id="sheet-title" className="mt-1 font-display text-2xl font-bold">
              {item.name}
            </h3>
            <p className="mt-1 text-sm text-muted">
              Il te faut <strong className="text-foreground">{fmtG(item.grams)}</strong> pour la semaine.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid size-9 shrink-0 place-items-center rounded-full border border-border hover:border-accent">
            ✕
          </button>
        </div>

        <ul className="mt-6 space-y-3">
          {offers.map((o) => {
            const isBest = o === best && offers.length > 1;
            return (
              <li key={o.store} className={`rounded-2xl border p-4 ${isBest ? "border-accent bg-accent-soft" : "border-border"}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-lg font-bold">{o.store}</p>
                  {isBest && <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-on-accent">Le moins cher</span>}
                  {o.estimate && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">Estimation</span>}
                </div>
                <p className="mt-1 text-sm">
                  {o.url ? (
                    <a href={o.url} target="_blank" rel="noopener noreferrer" className="underline decoration-accent underline-offset-2 hover:text-accent">
                      {o.product} ↗
                    </a>
                  ) : (
                    o.product
                  )}
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-background/60 p-2">
                    <dt className="text-[11px] text-muted">{o.estimate ? "Prix estimé" : `Prix (${o.packLabel})`}</dt>
                    <dd className="font-display font-bold tabular-nums">{o.estimate ? `${mad(o.perKg)}/kg` : mad(o.priceMad)}</dd>
                  </div>
                  <div className="rounded-xl bg-background/60 p-2">
                    <dt className="text-[11px] text-muted">Au kilo</dt>
                    <dd className="font-display font-bold tabular-nums">{mad(o.perKg)}</dd>
                  </div>
                  <div className="rounded-xl bg-background/60 p-2">
                    <dt className="text-[11px] text-muted">Pour {fmtG(item.grams)}</dt>
                    <dd className="font-display font-bold text-accent tabular-nums">≈ {mad(o.prorata)}</dd>
                  </div>
                </dl>
                {!o.estimate && (
                  <p className="mt-2 text-xs text-muted">
                    En caisse : {o.packs} × {o.packLabel} = {mad(o.checkout)}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Le coût « pour {fmtG(item.grams)} » est calculé au prorata du grammage : prix affiché ÷ poids du paquet × quantité nécessaire. Prix Marjane relevés le{" "}
          {MARJANE_DATE} sur marjane.ma ; le souk est une estimation.
        </p>
      </div>
    </div>
  );
}
