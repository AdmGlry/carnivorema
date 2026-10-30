import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRICE_DATE, PRICE_SOURCE, categoryLabels, foodById, mad } from "@/lib/foods";
import { equipmentLabels, mealLabels, recipeNutrition, recipes, tagLabels } from "@/lib/recipes";
import JsonLd from "../../_components/JsonLd";
import { SITE_URL, compatibleDiets, recipeHasGluten, recipeHasLactose, round } from "../../_site";

export const dynamicParams = false;

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }));
}

const tagEmoji: Record<string, string> = { etudiant: "🎓", fitness: "💪", "meal-prep": "🍱" };
const equipmentEmoji: Record<string, string> = { "sans-cuisson": "🥗", "micro-ondes": "📡", poele: "🍳", casserole: "🍲", four: "🔥", mixeur: "🌀" };

const find = (id: string) => recipes.find((r) => r.id === id);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const r = find((await params).id);
  if (!r) return {};
  const n = recipeNutrition(r);
  const title = `${r.name} : ${round(n.kcal)} kcal, ${mad(n.cost)} par personne`;
  const description = `${r.name} (${mealLabels[r.meal].toLowerCase()}, ${r.minutes} min) : ${round(n.kcal)} kcal, ${round(n.protein)} g de protéines et ${mad(n.cost)} par personne au prix réel ${PRICE_SOURCE}. Compatible : ${compatibleDiets(r).map((d) => d.name).join(", ")}.`;
  return { title, description, alternates: { canonical: `/recettes/${r.id}` }, openGraph: { title, description, url: `/recettes/${r.id}`, type: "article" } };
}

// Régimes schema.org correspondant aux nôtres, quand il en existe un.
const schemaDiets: Record<string, string> = {
  vegan: "https://schema.org/VeganDiet",
  vegetarien: "https://schema.org/VegetarianDiet",
};

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const r = find((await params).id);
  if (!r) notFound();

  const n = recipeNutrition(r);
  const ds = compatibleDiets(r);
  const glutenFree = !recipeHasGluten(r);
  const lactoseFree = !recipeHasLactose(r);
  const lines = r.ingredients.map(({ id, grams }) => {
    const f = foodById[id];
    return { f, grams, cost: (f.priceMad / f.packG) * grams };
  });
  const macroKcal = n.protein * 4 + n.carbs * 4 + n.fat * 9 || 1;
  const macros = [
    { label: "Protéines", g: n.protein, pct: (n.protein * 4) / macroKcal },
    { label: "Glucides", g: n.carbs, pct: (n.carbs * 4) / macroKcal },
    { label: "Lipides", g: n.fat, pct: (n.fat * 9) / macroKcal },
  ];
  const others = recipes.filter((o) => o.id !== r.id && o.meal === r.meal).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.name,
    image: [`${SITE_URL}/recettes/${r.id}/opengraph-image`],
    description: `${r.name} : ${round(n.kcal)} kcal et ${round(n.protein)} g de protéines par personne.`,
    recipeCategory: mealLabels[r.meal],
    recipeYield: "1 portion",
    totalTime: `PT${r.minutes}M`,
    recipeIngredient: lines.map((l) => `${round(l.grams)} g ${l.f.name.toLowerCase()}`),
    recipeInstructions: r.steps.map((text) => ({ "@type": "HowToStep", text })),
    nutrition: {
      "@type": "NutritionInformation",
      servingSize: "1 portion",
      calories: `${round(n.kcal)} kcal`,
      proteinContent: `${round(n.protein)} g`,
      carbohydrateContent: `${round(n.carbs)} g`,
      fatContent: `${round(n.fat)} g`,
    },
    suitableForDiet: [
      ...ds.map((d) => schemaDiets[d.id]).filter(Boolean),
      ...(glutenFree ? ["https://schema.org/GlutenFreeDiet"] : []),
      ...(lactoseFree ? ["https://schema.org/LowLactoseDiet"] : []),
    ],
    estimatedCost: { "@type": "MonetaryAmount", currency: "MAD", value: n.cost.toFixed(2) },
    inLanguage: "fr-MA",
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <JsonLd data={jsonLd} />
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Accueil</Link> / <Link href="/recettes" className="hover:text-accent">Recettes</Link> /{" "}
        <span aria-current="page">{r.name}</span>
      </nav>
      <p className="mt-6 text-sm font-semibold uppercase text-accent">{mealLabels[r.meal]} · {r.minutes} min</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">{r.name}</h1>
      {((r.tags?.length ?? 0) > 0 || (r.equipment?.length ?? 0) > 0) && (
        <ul aria-label="Profil et matériel" className="mt-4 flex flex-wrap gap-2">
          {(r.tags ?? []).map((t) => (
            <li key={t}>
              {t === "meal-prep" ? (
                <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">
                  <span aria-hidden="true">{tagEmoji[t]} </span>
                  {tagLabels[t]}
                </span>
              ) : (
                <Link href={`/recettes?filtres=${t}`} className="inline-block rounded-full bg-accent px-3 py-1 text-sm font-semibold text-on-accent">
                  <span aria-hidden="true">{tagEmoji[t]} </span>
                  {tagLabels[t]}
                  <span className="sr-only"> : voir toutes les recettes de ce profil</span>
                </Link>
              )}
            </li>
          ))}
          {(r.equipment ?? []).map((e) => (
            <li key={e} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
              <span aria-hidden="true">{equipmentEmoji[e]} </span>
              {equipmentLabels[e]}
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: "Coût par personne", v: mad(n.cost) },
          { k: "Calories", v: `${round(n.kcal)} kcal` },
          { k: "Protéines", v: `${round(n.protein)} g` },
          { k: "Temps", v: `${r.minutes} min` },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border bg-card p-4">
            <dt className="text-xs text-muted">{s.k}</dt>
            <dd className="mt-1 text-xl font-bold">{s.v}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="ingredients" className="mt-10">
        <h2 id="ingredients" className="text-2xl font-bold">Ingrédients pour 1 personne</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Ingrédients crus pour une portion, avec leur coût</caption>
            <thead className="border-b border-border text-muted">
              <tr>
                <th scope="col" className="p-3 sm:p-4">Ingrédient</th>
                <th scope="col" className="hidden p-3 sm:p-4 sm:table-cell">Rayon</th>
                <th scope="col" className="p-3 sm:p-4 text-right">Quantité</th>
                <th scope="col" className="p-3 sm:p-4 text-right">Coût</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lines.map(({ f, grams, cost }) => (
                <tr key={f.id}>
                  <th scope="row" className="p-3 sm:p-4 font-normal">{f.name}</th>
                  <td className="hidden p-3 sm:p-4 text-muted sm:table-cell">{categoryLabels[f.category]}</td>
                  <td className="whitespace-nowrap p-3 sm:p-4 text-right">{round(grams)} g</td>
                  <td className="whitespace-nowrap p-3 sm:p-4 text-right">{mad(cost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-border font-semibold">
              <tr>
                <th scope="row" className="p-3 sm:p-4 text-left">Total</th>
                <td className="hidden sm:table-cell" />
                <td />
                <td className="whitespace-nowrap p-3 sm:p-4 text-right text-accent">{mad(n.cost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">Poids crus. Prix {PRICE_SOURCE} du {PRICE_DATE}, hors huile, sel et épices.</p>
      </section>

      <section aria-labelledby="preparation" className="mt-10">
        <h2 id="preparation" className="text-2xl font-bold">Préparation</h2>
        <ol className="mt-4 space-y-3">
          {r.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="nutrition" className="mt-10">
        <h2 id="nutrition" className="text-2xl font-bold">Valeurs nutritionnelles par portion</h2>
        <ul className="mt-4 space-y-3">
          {macros.map((m) => (
            <li key={m.label}>
              <div className="flex justify-between text-sm">
                <span>{m.label}</span>
                <span className="font-semibold">
                  {round(m.g)} g <span className="font-normal text-muted">({round(m.pct * 100)} % des calories)</span>
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-accent-soft" aria-hidden="true">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${Math.min(100, m.pct * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Moyennes de tables de référence, glucides nets.</p>
      </section>

      <section aria-labelledby="regimes" className="mt-10">
        <h2 id="regimes" className="text-2xl font-bold">Régimes compatibles</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {ds.map((d) => (
            <li key={d.id}>
              <Link href={`/regimes/${d.id}`} className="inline-block rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-accent">
                <span aria-hidden="true">{d.emoji} </span>
                {d.name}
              </Link>
            </li>
          ))}
          {glutenFree && <li className="rounded-full bg-accent-soft px-3 py-1.5 text-sm text-accent">Sans gluten</li>}
          {lactoseFree && <li className="rounded-full bg-accent-soft px-3 py-1.5 text-sm text-accent">Sans lactose</li>}
        </ul>
      </section>

      <div className="mt-12 rounded-2xl bg-accent-soft p-6">
        <h2 className="text-xl font-bold">Ajuste la portion à tes besoins</h2>
        <p className="mt-2 text-muted">Le calculateur adapte les quantités à ton poids, ta taille, ton objectif et ton budget.</p>
        <Link href="/commencer" className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-on-accent">
          Calculer mon menu
        </Link>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="autres" className="mt-12">
          <h2 id="autres" className="text-2xl font-bold">Autres idées</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((o) => {
              const on = recipeNutrition(o);
              return (
                <li key={o.id}>
                  <Link href={`/recettes/${o.id}`} className="flex justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:border-accent">
                    <span className="font-semibold">{o.name}</span>
                    <span className="whitespace-nowrap text-sm text-muted">{mad(on.cost)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </article>
  );
}
