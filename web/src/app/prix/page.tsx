import type { Metadata } from "next";
import Link from "next/link";
import { PRICE_DATE, PRICE_SOURCE, categoryLabels, foods, mad, pricePerKg } from "@/lib/foods";
import PriceTable, { PriceRow } from "./PriceTable";

const title = "Prix des courses au Maroc cette semaine";
const description = `Prix réels de ${foods.length} produits (viande, poisson, légumes, fruits, féculents, laitiers) relevés le ${PRICE_DATE} chez ${PRICE_SOURCE}, avec le prix au kilo.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/prix" },
  openGraph: { title, description, url: "/prix" },
};

const order = Object.keys(categoryLabels);

export default function PricesPage() {
  const rows: PriceRow[] = foods.map((f) => ({
    id: f.id,
    name: f.name,
    category: f.category,
    categoryLabel: categoryLabels[f.category],
    categoryOrder: order.indexOf(f.category),
    price: mad(f.priceMad),
    packLabel: f.packLabel,
    perKg: pricePerKg(f),
    perKgLabel: mad(pricePerKg(f)),
    promo: f.promo,
  }));
  const categories = order.filter((c) => foods.some((f) => f.category === c)).map((c) => ({ id: c, label: categoryLabels[c as keyof typeof categoryLabels] }));
  const cheapestByCategory = categories.map((c) => {
    const items = foods.filter((f) => f.category === c.id).sort((a, b) => pricePerKg(a) - pricePerKg(b));
    return { ...c, food: items[0] };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Accueil</Link> / <span aria-current="page">Prix</span>
      </nav>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        Les prix affichés en ligne chez {PRICE_SOURCE}, relevés le {PRICE_DATE}, promotions comprises. Le prix au kilo permet de comparer des
        paquets de tailles différentes.
      </p>

      <h2 className="mt-12 text-2xl font-bold">Le moins cher au kilo, par rayon</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {cheapestByCategory.map(({ id, label, food }) => (
          <li key={id} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase text-accent">{label}</p>
            <p className="mt-1 font-semibold">{food.name}</p>
            <p className="text-sm text-muted">{mad(pricePerKg(food))} / kg</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-2xl font-bold">Tous les prix</h2>
      <div className="mt-6">
        <PriceTable rows={rows} categories={categories} caption={`Prix relevés chez ${PRICE_SOURCE} le ${PRICE_DATE}`} />
      </div>
      <p className="mt-4 text-xs text-muted">
        Prix relevés en ligne : ils peuvent varier en magasin et selon la ville. Marques © leurs propriétaires respectifs. Les autres enseignes
        (Marjane, Aswak Assalam, BIM) arrivent bientôt.
      </p>

      <div className="mt-12 rounded-2xl bg-accent-soft p-6">
        <h2 className="text-xl font-bold">Transforme ces prix en menu</h2>
        <p className="mt-2 text-muted">Indique ton poids, ta taille, ton objectif et ton budget : on compose ta semaine avec ces produits.</p>
        <Link href="/commencer" className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-on-accent">
          Calculer mon menu
        </Link>
      </div>
    </div>
  );
}
