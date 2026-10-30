import type { Metadata } from "next";
import Link from "next/link";
import SoukBoard from "@/components/SoukBoard";
import { fetchReportStats } from "@/lib/reports";
import { MARKUP_HIGH, MARKUP_LOW, WHOLESALE_DATE, WHOLESALE_SOURCE } from "@/lib/souk";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Prix des fruits et légumes au souk",
  description:
    "Combien coûtent la tomate, la pomme de terre ou l'orange au souk cette semaine ? Estimation à partir des prix de gros de Casablanca et prix partagés par la communauté.",
  alternates: { canonical: "/prix-du-souk" },
};

export default async function PrixDuSoukPage() {
  const stats = await fetchReportStats();
  const fmt = (n: number) => n.toLocaleString("fr-MA");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">La mercuriale Mizan</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-extrabold sm:text-5xl">Prix des fruits et légumes au souk, cette semaine</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Estimation à partir des prix de gros de Casablanca du {WHOLESALE_DATE}, corrigée par les prix que vous partagez. Prix au kilo, en dirhams.
      </p>

      <div className="mt-10">
        <SoukBoard stats={stats} />
      </div>

      <section className="mt-16 max-w-3xl rounded-3xl border border-dashed border-border p-6 text-sm text-muted">
        <h2 className="text-lg font-bold text-foreground">Comment on calcule</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Point de départ : les prix de gros relevés aux marchés de gros de Casablanca (
            <a href={WHOLESALE_SOURCE.url} className="underline underline-offset-2" rel="noopener noreferrer" target="_blank">
              {WHOLESALE_SOURCE.label}
            </a>
            ).
          </li>
          <li>
            Le prix au souk est estimé entre {fmt(MARKUP_LOW)} et {fmt(MARKUP_HIGH)} fois le prix de gros moyen. C&apos;est une hypothèse de départ, pas une
            mesure : elle sera ajustée avec vos relevés.
          </li>
          <li>Dès qu&apos;un produit a au moins 3 prix partagés dans les 45 derniers jours, on affiche le prix médian de la communauté à la place.</li>
          <li>Les prix très éloignés de la médiane sont écartés automatiquement. Aucune donnée personnelle n&apos;est enregistrée.</li>
        </ul>
        <p className="mt-4">
          Ces prix servent aussi au calcul de ton menu si tu fais tes courses au souk.{" "}
          <Link href="/commencer" className="font-semibold text-accent">
            Calculer mon menu
          </Link>
        </p>
      </section>
    </div>
  );
}
