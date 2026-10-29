"use client";

import { useEffect, useRef, useState } from "react";
import Scale3D, { type ScaleHandle } from "./Scale3D";

export default function HeroScale() {
  const scale = useRef<ScaleHandle>(null);
  const [counts, setCounts] = useState({ food: 0, coins: 0 });

  // Petite démo au chargement : la balance se remplit toute seule.
  useEffect(() => {
    const seq: ("food" | "coin")[] = ["food", "coin", "food", "coin", "coin"];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = seq.map((side, i) => setTimeout(() => scale.current?.drop(side), reduce ? 0 : 600 + i * 450));
    return () => timers.forEach(clearTimeout);
  }, []);

  const balance = counts.food * 2 - counts.coins;
  const verdict =
    counts.food + counts.coins === 0
      ? "Touche un plateau pour le remplir."
      : balance > 1
        ? "L'assiette pèse plus lourd : il manque des dirhams."
        : balance < -1
          ? "Trop de dirhams pour si peu dans l'assiette."
          : "Équilibre parfait : c'est ça, mizan.";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative h-[300px] w-full max-w-xl cursor-pointer select-none sm:h-[380px]"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          scale.current?.drop(e.clientX - r.left < r.width / 2 ? "food" : "coin");
        }}
      >
        <Scale3D
          handleRef={scale}
          className="h-full w-full"
          label="Balance en 3D : une assiette d'aliments d'un côté, des pièces de dirham de l'autre"
          onCount={(food, coins) => setCounts({ food, coins })}
        />
      </div>
      <p className="min-h-6 text-center text-sm text-muted" aria-live="polite">
        {verdict}
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <button type="button" onClick={() => scale.current?.drop("food")} className="rounded-full border border-border bg-card px-4 py-2 font-medium hover:border-accent">
          + Un aliment <span className="text-muted tabular-nums">({counts.food})</span>
        </button>
        <button type="button" onClick={() => scale.current?.drop("coin")} className="rounded-full border border-border bg-card px-4 py-2 font-medium hover:border-accent">
          + Un dirham <span className="text-muted tabular-nums">({counts.coins})</span>
        </button>
        <button type="button" onClick={() => scale.current?.reset()} className="rounded-full px-3 py-2 text-muted hover:text-foreground">
          Vider
        </button>
      </div>
    </div>
  );
}
