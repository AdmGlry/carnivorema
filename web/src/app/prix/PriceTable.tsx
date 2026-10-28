"use client";

import { useId, useMemo, useState } from "react";

export type PriceRow = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  categoryOrder: number;
  price: string;
  packLabel: string;
  perKg: number;
  perKgLabel: string;
  promo?: string;
};

const sorts = {
  rayon: { label: "Rayon", fn: (a: PriceRow, b: PriceRow) => a.categoryOrder - b.categoryOrder || a.perKg - b.perKg },
  asc: { label: "Prix au kg croissant", fn: (a: PriceRow, b: PriceRow) => a.perKg - b.perKg },
  desc: { label: "Prix au kg décroissant", fn: (a: PriceRow, b: PriceRow) => b.perKg - a.perKg },
  nom: { label: "Nom (A → Z)", fn: (a: PriceRow, b: PriceRow) => a.name.localeCompare(b.name, "fr") },
};

type SortKey = keyof typeof sorts;

export default function PriceTable({ rows, categories, caption }: { rows: PriceRow[]; categories: { id: string; label: string }[]; caption: string }) {
  const [sort, setSort] = useState<SortKey>("rayon");
  const [category, setCategory] = useState("tous");
  const sortId = useId();
  const categoryId = useId();

  const visible = useMemo(
    () => rows.filter((r) => category === "tous" || r.category === category).sort(sorts[sort].fn),
    [rows, sort, category],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <div className="text-sm">
          <label htmlFor={sortId} className="text-muted">Trier par</label>
          <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="mt-1 block rounded-lg border border-border bg-card px-3 py-2">
            {Object.entries(sorts).map(([k, s]) => (
              <option key={k} value={k}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="text-sm">
          <label htmlFor={categoryId} className="text-muted">Rayon</label>
          <select id={categoryId} value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block rounded-lg border border-border bg-card px-3 py-2">
            <option value="tous">Tous les rayons</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted" aria-live="polite">{visible.length} produits affichés</p>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-border text-muted">
            <tr>
              <th scope="col" className="p-3 sm:p-4">Produit</th>
              <th scope="col" className="hidden p-3 sm:p-4 sm:table-cell">Rayon</th>
              <th scope="col" className="p-3 sm:p-4 text-right">Prix affiché</th>
              <th scope="col" className="p-3 sm:p-4 text-right" aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none"}>
                Prix au kg
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((r) => (
              <tr key={r.id}>
                <th scope="row" className="p-3 sm:p-4 font-normal">
                  {r.name}
                  {r.promo && <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">{r.promo}</span>}
                </th>
                <td className="hidden p-3 sm:p-4 text-muted sm:table-cell">{r.categoryLabel}</td>
                <td className="whitespace-nowrap p-3 sm:p-4 text-right">
                  {r.price} <span className="block text-xs text-muted sm:inline sm:text-sm">/ {r.packLabel}</span>
                </td>
                <td className="whitespace-nowrap p-3 sm:p-4 text-right font-semibold">{r.perKgLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
