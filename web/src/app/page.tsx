import Link from "next/link";
import HeroScale from "@/components/HeroScale";
import WaitlistForm from "@/components/WaitlistForm";
import { BRAND } from "@/lib/config";
import { PRICE_DATE, PRICE_SOURCE, categoryLabels, foods, mad, pricePerKg } from "@/lib/foods";
import { diets, recipeAllowed } from "@/lib/nutrition";
import { mealLabels, recipeNutrition, recipes } from "@/lib/recipes";
import { wholesale, retailRange } from "@/lib/souk";
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
  { name: "Souks & primeurs (estimation)", status: "Estimation" },
  { name: "Boucheries", status: "Bientôt" },
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

function Section({ id, kicker, title, children, className = "" }: { id?: string; kicker: string; title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`reveal mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:py-28 ${className}`}>
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden="true" />
        {kicker}
      </p>
      <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.05] sm:text-5xl">{title}</h2>
      <div className="mt-12">{children}</div>
    </section>
  );
}

const card = "spotlight glass min-w-0 rounded-[1.75rem] p-6 sm:p-7";

export default function Home() {
  const withNutrition = recipes.map((r) => ({ r, n: recipeNutrition(r) }));
  const plats = withNutrition.filter((x) => x.r.meal === "plat");
  const cheapest = Math.min(...plats.map((x) => x.n.cost));
  const fitness = withNutrition.filter((x) => x.r.tags?.includes("fitness"));
  const featured = [...fitness].filter((x) => x.r.meal === "plat").sort((a, b) => b.n.protein / b.n.cost - a.n.protein / a.n.cost).slice(0, 6);
  const day = ["fm-pancakes-avoine-banane", "fp-bowl-poulet-cumin-semoule", "fp-dal-lentilles-oeufs"]
    .map((id) => withNutrition.find((x) => x.r.id === id))
    .filter((x): x is (typeof withNutrition)[number] => Boolean(x));
  const dayTotal = day.reduce((a, x) => ({ cost: a.cost + x.n.cost, kcal: a.kcal + x.n.kcal, protein: a.protein + x.n.protein }), { cost: 0, kcal: 0, protein: 0 });
  const ticker = [
    ...foods.slice(0, 18).map((f) => `${f.name} · ${mad(pricePerKg(f))}/kg`),
    ...wholesale.slice(0, 8).map((w) => {
      const r = retailRange(w);
      return `${w.name} au souk · ${r.low.toLocaleString("fr-MA")}–${r.high.toLocaleString("fr-MA")} DH`;
    }),
  ];
  const heroWords = ["Ton", "corps.", "Ton", "régime."];

  return (
    <>
      {/* Héros */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-10 md:min-h-[calc(100svh-5rem)] md:grid-cols-[1.15fr_1fr] md:pt-6">
        <div className="text-center md:text-left">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold sm:text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            🇲🇦 {recipes.length} recettes · prix réels · {diets.length} régimes
          </span>
          <h1 className="mt-7 text-[2.6rem] font-bold leading-[0.95] sm:text-7xl lg:text-[4.75rem]">
            {heroWords.map((w, i) => (
              <span key={i} className="rise mr-[0.25em]" style={{ "--i": i } as React.CSSProperties}>
                {w}
              </span>
            ))}
            <br />
            <span className="rise text-gradient" style={{ "--i": 4 } as React.CSSProperties}>
              Ton budget.
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-lg text-lg text-muted md:mx-0">
            {BRAND} calcule tes besoins, compose ton menu de la semaine et te donne la liste de courses au vrai prix de ton supermarché ou du souk.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <Link href="/commencer" className="btn-glow w-full rounded-2xl bg-accent px-8 py-4 text-center text-lg font-bold text-on-accent sm:w-auto">
              Calcule mon menu →
            </Link>
            <Link href="/recettes" className="glass w-full rounded-2xl px-8 py-4 text-center font-semibold transition-colors hover:border-accent sm:w-auto">
              🎲 Explorer les recettes
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">Gratuit · 1 minute · sans inscription</p>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-8 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <HeroScale />
          <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
            <span className="float glass absolute left-0 top-6 rounded-2xl px-4 py-2 text-sm font-semibold">🔥 2 140 kcal</span>
            <span className="float glass absolute right-2 top-16 rounded-2xl px-4 py-2 text-sm font-semibold" style={{ animationDelay: "1.5s" }}>
              💪 152 g de protéines
            </span>
            <span className="float glass absolute bottom-28 left-4 rounded-2xl px-4 py-2 text-sm font-semibold" style={{ animationDelay: "3s" }}>
              💸 {mad(dayTotal.cost || 25)} / jour
            </span>
          </div>
        </div>
      </section>

      {/* Bandeau des prix en direct */}
      <div className="relative overflow-hidden border-y border-border bg-accent py-3 text-on-accent" aria-label="Exemples de prix relevés">
        <div className="marquee gap-10 whitespace-nowrap font-display text-sm font-semibold">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-10" aria-hidden={i >= ticker.length ? true : undefined}>
              {t}
              <span aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bento */}
      <Section id="features" kicker="Tout-en-un" title={<>Ton coach nutrition, <span className="text-gradient">ton comptable</span> et ton marché.</>}>
        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-6">
          {/* Journée type */}
          <div className={`${card} md:col-span-4 md:row-span-2`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">Une journée fitness type</p>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">1 personne</span>
            </div>
            <ul className="mt-6 space-y-3">
              {day.map(({ r, n }, i) => (
                <li key={r.id}>
                  <Link href={`/recettes/${r.id}`} className="group flex items-center gap-4 rounded-2xl border border-border bg-background/40 p-4 transition-colors hover:border-accent">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-xl" aria-hidden="true">
                      {["🥞", "🥗", "🍲"][i]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-wide text-accent">{mealLabels[r.meal]}</span>
                      <span className="block font-semibold leading-snug group-hover:text-accent">{r.name}</span>
                      <span className="block text-xs text-muted">
                        {r.minutes} min · {Math.round(n.kcal)} kcal · {Math.round(n.protein)} g prot.
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-base font-bold tabular-nums sm:text-lg">{mad(n.cost)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                ["Total", mad(dayTotal.cost)],
                ["Calories", `${Math.round(dayTotal.kcal)}`],
                ["Protéines", `${Math.round(dayTotal.protein)} g`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-accent-soft p-3">
                  <p className="text-xs text-muted">{k}</p>
                  <p className="font-display text-lg font-bold text-accent tabular-nums sm:text-xl">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">Prix {PRICE_SOURCE} du {PRICE_DATE}.</p>
          </div>

          <Link href="/commencer" className={`${card} group md:col-span-2`}>
            <p className="text-4xl" aria-hidden="true">🎓</p>
            <h3 className="mt-3 font-display text-xl font-bold">Mode étudiant</h3>
            <p className="mt-2 text-sm text-muted">Plats en 20 min, une poêle ou un micro-ondes, petit budget.</p>
            <p className="mt-4 text-sm font-bold text-accent transition-transform group-hover:translate-x-1">Activer →</p>
          </Link>

          <Link href="/prix-du-souk" className={`${card} group md:col-span-2`}>
            <p className="text-4xl" aria-hidden="true">🥕</p>
            <h3 className="mt-3 font-display text-xl font-bold">Prix du souk</h3>
            <p className="mt-2 text-sm text-muted">La mercuriale des fruits et légumes, corrigée par la communauté.</p>
            <p className="mt-4 text-sm font-bold text-accent transition-transform group-hover:translate-x-1">Voir les prix →</p>
          </Link>

          <div className={`${card} md:col-span-2`}>
            <p className="font-display text-5xl font-bold text-gradient">dès {Math.ceil(cheapest)} DH</p>
            <p className="mt-2 font-semibold">le plat maison, par personne</p>
          </div>
          <div className={`${card} md:col-span-2`}>
            <p className="font-display text-5xl font-bold text-gradient">{fitness.length}</p>
            <p className="mt-2 font-semibold">recettes fitness, riches en protéines</p>
          </div>
          <div className={`${card} md:col-span-2`}>
            <p className="font-display text-5xl font-bold text-gradient">{foods.length}</p>
            <p className="mt-2 font-semibold">produits suivis au prix réel</p>
          </div>
        </div>
      </Section>

      {/* Comment ça marche */}
      <Section kicker="Comment ça marche" title="Trois étapes. Zéro prise de tête.">
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className={card}>
              <span className="font-display text-7xl font-bold text-transparent [-webkit-text-stroke:1.5px_var(--accent)]">0{i + 1}</span>
              <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Recettes vedettes */}
      <Section kicker="Les plus rentables" title={<>Le plus de protéines <span className="text-gradient">par dirham.</span></>}>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {featured.map(({ r, n }) => (
            <li key={r.id} className="w-[78%] shrink-0 snap-start md:w-auto">
              <Link href={`/recettes/${r.id}`} className={`${card} group flex h-full flex-col`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-accent">{r.minutes} min</span>
                  <span className="rounded-2xl bg-accent px-3 py-1.5 text-center leading-none text-on-accent">
                    <span className="block font-display text-xl font-bold">{Math.round(n.protein)}</span>
                    <span className="text-[10px] font-semibold">g prot.</span>
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold leading-tight group-hover:text-accent">{r.name}</h3>
                <p className="mt-auto pt-6 text-sm text-muted">
                  <span className="font-display text-2xl font-bold text-foreground">{mad(n.cost)}</span> / pers · {Math.round(n.kcal)} kcal
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/recettes?filtres=fitness&tri=ratio" className="glass mt-6 inline-flex rounded-2xl px-6 py-3 font-semibold hover:border-accent">
          Voir les {recipes.length} recettes →
        </Link>
      </Section>

      {/* Régimes */}
      <Section id="regimes" kicker="Tous les régimes" title="Du végan au carnivore. Chacun sa façon.">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {diets.map((d) => {
            const count = recipes.filter((r) => recipeAllowed(r, { diet: d.id, glutenFree: false, lactoseFree: false })).length;
            return (
              <Link key={d.id} href={`/regimes/${d.id}`} className={`${card} group !p-5`}>
                <p className="text-4xl transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125" aria-hidden="true">
                  {d.emoji}
                </p>
                <h3 className="mt-4 font-display font-bold">{d.name}</h3>
                <p className="mt-1 hidden text-sm text-muted sm:block">{d.description}</p>
                <p className="mt-3 text-xs font-bold text-accent">{count} recettes →</p>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Enseignes */}
      <Section id="prix" kicker="Tes enseignes" title="Les mêmes courses n'ont pas le même prix partout.">
        <ul className="flex flex-wrap gap-2">
          {stores.map((s) => (
            <li
              key={s.name}
              className={`rounded-full px-4 py-2 text-sm ${s.status === "Bientôt" ? "border border-dashed border-border text-muted" : "bg-accent font-bold text-on-accent"}`}
            >
              {s.name}
              {s.status === "Bientôt" ? " · bientôt" : " ✓"}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/prix" className="glass rounded-2xl px-6 py-3 font-semibold hover:border-accent">
            Prix de la semaine →
          </Link>
          <Link href="/prix-du-souk" className="glass rounded-2xl px-6 py-3 font-semibold hover:border-accent">
            Prix du souk →
          </Link>
        </div>
      </Section>

      {/* Bêta */}
      <section id="beta" className="reveal mx-auto max-w-6xl px-4 py-16">
        <div className="ring-gradient relative overflow-hidden rounded-[2.5rem] bg-card px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
          <h2 className="relative text-3xl font-bold sm:text-5xl">
            Sois parmi <span className="text-gradient">les premiers.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">
            La bêta ouvre bientôt à Casablanca, Rabat et Marrakech : menus sauvegardés, partage en famille, alertes promo. Les premiers inscrits auront
            un accès premium offert.
          </p>
          <div className="relative mx-auto mt-8 max-w-md">
            <WaitlistForm source="landing-beta" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section kicker="FAQ" title="Questions fréquentes">
        <div className="grid gap-3 md:grid-cols-2">
          {faq.map((f) => (
            <details key={f.q} className="group glass rounded-2xl p-5 open:border-accent">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-transform group-open:rotate-45">
                  +
                </span>
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
