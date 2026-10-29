import Link from "next/link";
import HeroScale from "@/components/HeroScale";
import WaitlistForm from "@/components/WaitlistForm";
import { BRAND } from "@/lib/config";
import { PRICE_DATE, PRICE_SOURCE, categoryLabels, foods, mad, pricePerKg } from "@/lib/foods";
import { diets, recipeAllowed } from "@/lib/nutrition";
import { mealLabels, recipeNutrition, recipes } from "@/lib/recipes";
import JsonLd from "./_components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, compatibleDiets } from "./_site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon/512` },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "fr-MA",
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "HealthApplication",
      operatingSystem: "Web, iOS, Android",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "fr-MA",
      offers: { "@type": "Offer", price: "0", priceCurrency: "MAD" },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

const stores = [
  { name: "Carrefour", status: "Prix réels relevés" },
  { name: "Carrefour Market", status: "Bientôt" },
  { name: "Marjane", status: "Bientôt" },
  { name: "Aswak Assalam", status: "Bientôt" },
  { name: "BIM", status: "Bientôt" },
  { name: "Boucheries & primeurs", status: "Bientôt" },
];

const steps = [
  {
    title: "Ton profil, en 2 minutes",
    text: "Âge, poids, taille, activité, objectif (perdre, maintenir ou prendre), ton régime, tes allergies, le nombre de personnes et ton budget en dirhams.",
  },
  {
    title: "Tes besoins, calculés",
    text: "Calories et protéines, glucides, lipides adaptés à ton corps, ton objectif et ton régime.",
  },
  {
    title: "Ton menu et ta liste, chiffrés",
    text: "7 jours de repas aux portions ajustées, avec les vrais prix de ton enseigne et la liste de courses arrondie aux paquets.",
  },
];

const faq = [
  {
    q: `C'est quoi ${BRAND} ?`,
    a: "Un planificateur de repas pour le Maroc : il calcule tes besoins à partir de ton poids, ta taille et ton objectif, compose ton menu selon ton régime et ton budget, et te donne la liste de courses au prix réel.",
  },
  {
    q: "Quels régimes sont proposés ?",
    a: "Équilibré, méditerranéen, riche en protéines, végétarien, végan, pauvre en glucides, cétogène et carnivore, avec les options sans gluten et sans lactose.",
  },
  {
    q: "Comment sont calculées mes calories ?",
    a: "Avec la formule de Mifflin-St Jeor (poids, taille, âge, sexe), multipliée par ton niveau d'activité, puis ajustée selon ton objectif. On ne descend jamais sous un minimum de sécurité.",
  },
  {
    q: "D'où viennent les prix ?",
    a: "Des catalogues en ligne des supermarchés marocains, relevés automatiquement. Tu vois le prix réel affiché en ligne, promotions comprises, pas une moyenne estimée.",
  },
  {
    q: "C'est un avis médical ?",
    a: "Non. C'est un outil de planification. En cas de pathologie, de grossesse ou de traitement, demande conseil à un médecin ou un diététicien.",
  },
  {
    q: "Je dois faire mes courses où ?",
    a: "Où tu veux. Tu choisis ton enseigne, on adapte les prix. Tu pourras aussi commander ta liste directement chez nos partenaires.",
  },
  {
    q: "Combien ça coûte ?",
    a: "Le calculateur est gratuit. Une formule premium à petit prix débloquera les menus illimités, le partage en famille et les alertes promo. Tarifs annoncés à l'ouverture de la bêta.",
  },
];

function Section({ id, kicker, title, children }: { id?: string; kicker: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">{kicker}</p>
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export default function Home() {
  const withNutrition = recipes.map((r) => ({ r, n: recipeNutrition(r) }));
  const example = ["omelette", "tagine-poulet", "lentilles"].map((id) => withNutrition.find((x) => x.r.id === id)!);
  const exampleTotal = example.reduce((s, x) => s + x.n.cost, 0);
  const cheapest = Math.min(...withNutrition.filter((x) => x.r.meal === "plat").map((x) => x.n.cost));
  const priceSample = Object.keys(categoryLabels).flatMap((cat) =>
    foods.filter((f) => f.category === cat).sort((a, b) => pricePerKg(a) - pricePerKg(b)).slice(0, 2),
  );

  return (
    <>
        {/* Hero : la balance (mizan) en 3D */}
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-20">
          <div className="text-center md:text-left">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
              <span aria-hidden="true">🇲🇦 </span>Pensé pour le Maroc
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Mange selon ton corps, ton régime <span className="text-accent">et ton budget</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted md:mx-0">
              Perdre, maintenir ou prendre du poids : {BRAND} calcule tes besoins, compose ton menu de la semaine selon ton régime et te donne la liste
              de courses au vrai prix de ton supermarché.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link href="/commencer" className="rounded-full bg-accent px-6 py-3 font-semibold text-on-accent transition-transform hover:-translate-y-0.5">
                Calculer mon menu gratuitement
              </Link>
              <a href="#regimes" className="rounded-full border border-border px-6 py-3 font-semibold">
                Voir les 8 régimes
              </a>
            </div>
          </div>
          <HeroScale />
        </section>
        <div className="mx-auto max-w-6xl px-4 pb-4 text-center">
          <p className="text-sm text-muted">Les prix de tes enseignes, relevés pour de vrai</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {stores.map((s) => (
              <li key={s.name} className={`rounded-full border px-4 py-1.5 text-sm ${s.status === "Bientôt" ? "border-dashed border-border text-muted" : "border-accent bg-accent-soft font-medium text-accent"}`}>
                {s.name}
                {s.status === "Bientôt" ? " · bientôt" : " ✓"}
              </li>
            ))}
          </ul>
        </div>

        {/* Le mécanisme */}
        <Section id="features" kicker="Le mécanisme" title={<>Chaque repas a un prix <span className="text-accent">et des calories.</span></>}>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-4 text-lg text-muted">
              <p>
                {BRAND} calcule le coût <strong className="text-foreground">et</strong> la valeur nutritionnelle de chaque recette, ingrédient par
                ingrédient, à partir des <strong className="text-foreground">prix réellement affichés</strong> par ton enseigne.
              </p>
              <p>Puis il ajuste les portions pour atteindre tes calories et tes protéines, sans dépasser ton budget.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex justify-between text-sm text-muted">
                <span className="font-semibold text-foreground">Exemple de journée</span>
                <span>1 personne</span>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {example.map(({ r, n }) => (
                  <li key={r.id} className="flex justify-between gap-4 py-3">
                    <span>
                      {r.name}
                      <span className="block text-xs text-muted">{Math.round(n.kcal)} kcal · {Math.round(n.protein)} g protéines</span>
                    </span>
                    <span className="font-semibold">{mad(n.cost)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold">
                <span>Total de la journée</span>
                <span className="text-accent">{mad(exampleTotal)}</span>
              </div>
              <p className="mt-3 text-xs text-muted">Prix {PRICE_SOURCE} du {PRICE_DATE}, hors huile et épices.</p>
            </div>
          </div>
        </Section>

        {/* Comment ça marche */}
        <Section kicker="Comment ça marche" title="Tu décides une fois. Tout le reste suit.">
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="text-sm font-semibold text-accent">Étape {i + 1}</span>
                <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Résultats concrets */}
        <Section kicker="Concrètement" title="Ce que ça change">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-accent-soft p-6">
              <p className="text-4xl font-extrabold text-accent">dès {Math.ceil(cheapest)} MAD</p>
              <p className="mt-2 font-semibold">le plat maison, par personne</p>
              <p className="mt-1 text-sm text-muted">Calculé sur les prix {PRICE_SOURCE} du {PRICE_DATE}.</p>
            </div>
            <div className="rounded-2xl bg-accent-soft p-6">
              <p className="text-4xl font-extrabold text-accent">{diets.length} régimes</p>
              <p className="mt-2 font-semibold">+ sans gluten et sans lactose</p>
              <p className="mt-1 text-sm text-muted">Du végan au carnivore, avec les macros adaptées.</p>
            </div>
            <div className="rounded-2xl bg-accent-soft p-6">
              <p className="text-4xl font-extrabold text-accent">{foods.length} produits</p>
              <p className="mt-2 font-semibold">suivis au prix réel</p>
              <p className="mt-1 text-sm text-muted">Viandes, poissons, légumes, féculents, laitiers… et bientôt plus d&apos;enseignes.</p>
            </div>
          </div>
        </Section>

        {/* Calculateur */}
        <Section id="essayer" kicker="Essaie maintenant" title="10 questions, une minute, ton menu.">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-lg text-muted">
                Une question par écran : tu réponds, ça avance. À la fin, tes besoins, ton menu de la semaine et ta liste de courses au prix réel.
              </p>
              <ol className="mt-6 flex flex-wrap gap-2 text-sm">
                {["Sexe", "Âge", "Poids", "Taille", "Activité", "Objectif", "Régime", "Allergies", "Foyer", "Budget"].map((q, i) => (
                  <li key={q} className="rounded-full border border-border bg-card px-3 py-1.5">
                    <span className="text-muted tabular-nums">{i + 1}.</span> {q}
                  </li>
                ))}
              </ol>
              <Link href="/commencer" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-on-accent hover:opacity-90">
                Commencer
              </Link>
            </div>
            <Link
              href="/commencer"
              aria-label="Commencer le questionnaire"
              className="mx-auto block w-full max-w-sm rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 text-sm text-muted">
                <span>←</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <span className="block h-full w-[10%] rounded-full bg-accent" />
                </span>
                <span className="tabular-nums">2/10</span>
              </div>
              <p className="font-display mt-8 text-3xl font-bold">Quel âge as-tu ?</p>
              <p className="mt-2 text-sm text-muted">Les besoins en calories baissent un peu avec l&apos;âge.</p>
              <p className="mt-10 text-center">
                <span className="font-display text-7xl font-bold tabular-nums">30</span> <span className="text-lg text-muted">ans</span>
              </p>
              <span className="mt-10 block rounded-full bg-accent py-3 text-center font-semibold text-on-accent">Continuer</span>
            </Link>
          </div>
        </Section>

        {/* Régimes */}
        <Section id="regimes" kicker="Tous les régimes" title="Chacun sa façon de manger.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {diets.map((d) => {
              const count = recipes.filter((r) => recipeAllowed(r, { diet: d.id, glutenFree: false, lactoseFree: false })).length;
              return (
                <Link key={d.id} href={`/regimes/${d.id}`} className="rounded-2xl border border-border bg-card p-5 hover:border-accent">
                  <p className="text-2xl" aria-hidden="true">{d.emoji}</p>
                  <h3 className="mt-2 font-bold">{d.name}</h3>
                  <p className="mt-1 text-sm text-muted">{d.description}</p>
                  <p className="mt-3 text-xs font-semibold text-accent">{count} recettes compatibles →</p>
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Prix */}
        <Section id="prix" kicker="Prix de la semaine" title="Les mêmes courses n'ont pas le même prix partout.">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Les deux produits les moins chers au kilo de chaque rayon, relevés le {PRICE_DATE}</caption>
              <thead className="border-b border-border text-muted">
                <tr>
                  <th scope="col" className="p-3 sm:p-4">Produit</th>
                  <th scope="col" className="hidden p-3 sm:p-4 sm:table-cell">Rayon</th>
                  <th scope="col" className="p-3 sm:p-4 text-right">Prix affiché</th>
                  <th scope="col" className="p-3 sm:p-4 text-right">Prix au kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {priceSample.map((f) => (
                  <tr key={f.id}>
                    <td className="p-3 sm:p-4">
                      {f.name}
                      {f.promo && <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">{f.promo}</span>}
                    </td>
                    <td className="hidden p-3 sm:p-4 text-muted sm:table-cell">{categoryLabels[f.category]}</td>
                    <td className="whitespace-nowrap p-3 sm:p-4 text-right">
                      {mad(f.priceMad)} <span className="block text-xs text-muted sm:inline sm:text-sm">/ {f.packLabel}</span>
                    </td>
                    <td className="whitespace-nowrap p-3 sm:p-4 text-right font-semibold">{mad(pricePerKg(f))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Prix relevés en ligne sur {PRICE_SOURCE} le {PRICE_DATE}. Marques © leurs propriétaires respectifs.</p>
          <Link href="/prix" className="mt-4 inline-block font-semibold text-accent">Voir tous les prix de la semaine →</Link>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {stores.map((s) => (
              <li key={s.name} className="flex justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm">
                <span className="font-medium">{s.name}</span>
                <span className={s.status === "Bientôt" ? "text-muted" : "text-accent"}>{s.status}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Réserve de recettes */}
        <Section kicker="Ta réserve" title={`${recipes.length} recettes, toutes chiffrées.`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {withNutrition.map(({ r, n }) => {
              const compatible = compatibleDiets(r);
              return (
                <Link key={r.id} href={`/recettes/${r.id}`} className="flex flex-col rounded-2xl border border-border bg-card p-4 hover:border-accent">
                  <span className="text-xs font-semibold uppercase text-accent">{mealLabels[r.meal]}</span>
                  <h3 className="mt-1 font-bold">{r.name}</h3>
                  <p className="mt-2 text-xs text-muted">
                    {r.minutes} min · {Math.round(n.kcal)} kcal · {Math.round(n.protein)} g prot.
                  </p>
                  <p className="mt-1 font-semibold">{mad(n.cost)} /pers</p>
                  <p className="mt-auto pt-3 text-sm" aria-label={`Régimes compatibles : ${compatible.map((d) => d.name).join(", ")}`}>
                    <span aria-hidden="true">{compatible.map((d) => d.emoji).join(" ")}</span>
                  </p>
                </Link>
              );
            })}
          </div>
          <Link href="/recettes" className="mt-6 inline-block font-semibold text-accent">Filtrer les recettes par régime →</Link>
        </Section>

        {/* Bêta */}
        <section id="beta" className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl bg-accent px-6 py-12 text-center text-on-accent">
            <h2 className="text-3xl font-bold sm:text-4xl">Sois parmi les premiers</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              La bêta ouvre bientôt à Casablanca, Rabat et Marrakech : menus sauvegardés, partage en famille, alertes promo. Les premiers inscrits
              auront un accès premium offert.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <WaitlistForm tone="onAccent" source="landing-beta" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <Section kicker="FAQ" title="Questions fréquentes">
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-5">
                <summary className="cursor-pointer list-none font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="float-right text-accent group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      <JsonLd data={jsonLd} />
    </>
  );
}
