import Link from "next/link";
import Planner from "@/components/Planner";
import ThemeToggle from "@/components/ThemeToggle";
import { BRAND, BRAND_TLD } from "@/lib/config";
import { PRICE_DATE, PRICE_SOURCE, categoryLabels, foods, mad, pricePerKg } from "@/lib/foods";
import { diets, recipeAllowed } from "@/lib/nutrition";
import { mealLabels, recipeNutrition, recipes } from "@/lib/recipes";

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
      {/* En-tête */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-extrabold">
            ⚖️ {BRAND}
            <span className="text-accent">{BRAND_TLD}</span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="#features" className="hidden text-sm sm:inline">Fonctionnalités</a>
            <a href="#regimes" className="hidden text-sm sm:inline">Régimes</a>
            <a href="#prix" className="hidden text-sm sm:inline">Prix</a>
            <ThemeToggle />
            <a href="#essayer" className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white">
              Mon menu
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 text-center sm:pt-24">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">🇲🇦 Pensé pour le Maroc</span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Mange selon ton corps, ton régime <span className="text-accent">et ton budget</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Perdre, maintenir ou prendre du poids : {BRAND} calcule tes besoins à partir de ton poids et de ta taille, compose ton menu de la
            semaine selon ton régime et te donne la liste de courses au vrai prix de ton supermarché.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#essayer" className="rounded-full bg-accent px-6 py-3 font-semibold text-white hover:opacity-90">
              Calculer mon menu gratuitement
            </a>
            <a href="#regimes" className="rounded-full border border-border px-6 py-3 font-semibold">
              Voir les 8 régimes
            </a>
          </div>
          <p className="mt-10 text-sm text-muted">Les prix de tes enseignes, relevés pour de vrai</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {stores.map((s) => (
              <li key={s.name} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm">{s.name}</li>
            ))}
          </ul>
        </section>

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
        <Section id="essayer" kicker="Essaie maintenant" title="Ton menu personnalisé, en direct">
          <Planner />
        </Section>

        {/* Régimes */}
        <Section id="regimes" kicker="Tous les régimes" title="Chacun sa façon de manger.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {diets.map((d) => {
              const count = recipes.filter((r) => recipeAllowed(r, { diet: d.id, glutenFree: false, lactoseFree: false })).length;
              return (
                <div key={d.id} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-2xl">{d.emoji}</p>
                  <p className="mt-2 font-bold">{d.name}</p>
                  <p className="mt-1 text-sm text-muted">{d.description}</p>
                  <p className="mt-3 text-xs font-semibold text-accent">{count} recettes compatibles</p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Prix */}
        <Section id="prix" kicker="Prix de la semaine" title="Les mêmes courses n'ont pas le même prix partout.">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Rayon</th>
                  <th className="p-4 text-right">Prix affiché</th>
                  <th className="p-4 text-right">Prix au kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {priceSample.map((f) => (
                  <tr key={f.id}>
                    <td className="p-4">
                      {f.name}
                      {f.promo && <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">{f.promo}</span>}
                    </td>
                    <td className="p-4 text-muted">{categoryLabels[f.category]}</td>
                    <td className="whitespace-nowrap p-4 text-right">
                      {mad(f.priceMad)} <span className="text-muted">/ {f.packLabel}</span>
                    </td>
                    <td className="whitespace-nowrap p-4 text-right font-semibold">{mad(pricePerKg(f))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Prix relevés en ligne sur {PRICE_SOURCE} le {PRICE_DATE}. Marques © leurs propriétaires respectifs.</p>
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
              const compatible = diets.filter((d) => recipeAllowed(r, { diet: d.id, glutenFree: false, lactoseFree: false }));
              return (
                <div key={r.id} className="flex flex-col rounded-2xl border border-border bg-card p-4">
                  <span className="text-xs font-semibold uppercase text-accent">{mealLabels[r.meal]}</span>
                  <p className="mt-1 font-bold">{r.name}</p>
                  <p className="mt-2 text-xs text-muted">
                    {r.minutes} min · {Math.round(n.kcal)} kcal · {Math.round(n.protein)} g prot.
                  </p>
                  <p className="mt-1 font-semibold">{mad(n.cost)} /pers</p>
                  <p className="mt-auto pt-3 text-sm" title={compatible.map((d) => d.name).join(", ")}>
                    {compatible.map((d) => d.emoji).join(" ")}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Bêta */}
        <section id="beta" className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl bg-accent px-6 py-12 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">Sois parmi les premiers</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              La bêta ouvre bientôt à Casablanca, Rabat et Marrakech : menus sauvegardés, partage en famille, alertes promo. Les premiers inscrits
              auront un accès premium offert.
            </p>
            <a href="#beta" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-accent">
              Rejoindre la liste d&apos;attente
            </a>
          </div>
        </section>

        {/* FAQ */}
        <Section kicker="FAQ" title="Questions fréquentes">
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-5">
                <summary className="cursor-pointer list-none font-semibold">
                  {f.q}
                  <span className="float-right text-accent group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      </main>

      {/* Pied de page */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:justify-between">
          <div>
            <p className="font-extrabold text-foreground">⚖️ {BRAND}{BRAND_TLD}</p>
            <p className="mt-1">© {new Date().getFullYear()} {BRAND} — Tous droits réservés.</p>
          </div>
          <nav className="flex flex-wrap gap-4">
            <Link href="/legal/mentions-legales">Mentions légales</Link>
            <Link href="/legal/cgu">CGU</Link>
            <Link href="/legal/cgv">CGV</Link>
            <Link href="/legal/confidentialite">Confidentialité</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
