import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { PRICE_DATE, costPerPerson, mad, pricePerKg, products, recipes } from "@/lib/prices";

const stores = [
  { name: "Carrefour", status: "Prix réels relevés" },
  { name: "Carrefour Market", status: "Bientôt" },
  { name: "Marjane", status: "Bientôt" },
  { name: "Aswak Assalam", status: "Bientôt" },
  { name: "BIM", status: "Bientôt" },
  { name: "Boucheries partenaires", status: "Bientôt" },
];

const steps = [
  {
    title: "Ton profil, en 2 minutes",
    text: "Combien vous êtes à table, ton objectif (perte de gras, prise de muscle, santé), ta ville et ton budget mensuel en dirhams.",
  },
  {
    title: "Ton menu carnivore, déjà chiffré",
    text: "Composé avec les vrais prix du jour de ton enseigne. La liste de courses part avec, triée par rayon.",
  },
  {
    title: "Tu commandes ou tu y vas",
    text: "Fais tes courses où tu veux, ou commande ta liste en un clic chez nos partenaires.",
  },
];

const faq = [
  {
    q: "C'est quoi Carnivore.ma ?",
    a: "Un planificateur de repas carnivores et riches en protéines pensé pour le Maroc : menus de la semaine, prix réel de chaque plat en dirhams, liste de courses et comparateur d'enseignes.",
  },
  {
    q: "D'où viennent les prix ?",
    a: "Des catalogues en ligne des supermarchés marocains, relevés automatiquement. Contrairement à une moyenne estimée, tu vois le prix réel affiché en ligne, promotions comprises. Les prix en magasin peuvent légèrement varier.",
  },
  {
    q: "La viande est halal ?",
    a: "Oui, toutes les viandes proposées proviennent d'enseignes et de boucheries marocaines.",
  },
  {
    q: "Le régime carnivore, c'est sans danger ?",
    a: "Carnivore.ma est un outil de planification, pas un avis médical. Si tu as une condition de santé, parles-en à ton médecin avant de changer ton alimentation.",
  },
  {
    q: "Je dois faire mes courses où ?",
    a: "Où tu veux. Tu choisis ton enseigne, on adapte les prix. Tu peux aussi commander directement chez nos partenaires.",
  },
  {
    q: "Combien ça coûte ?",
    a: "Une version gratuite pour découvrir, puis un abonnement mensuel à petit prix, sans engagement. Les tarifs seront annoncés à l'ouverture de la bêta.",
  },
  {
    q: "Il y a une application ?",
    a: "Le site fonctionne sur mobile, tablette et ordinateur. Tu peux l'ajouter à ton écran d'accueil comme une application.",
  },
];

function Section({ id, kicker, title, children }: { id?: string; kicker: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">{kicker}</p>
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Cta({ children = "Rejoindre la bêta" }: { children?: React.ReactNode }) {
  return (
    <a href="#beta" className="inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white hover:opacity-90">
      {children}
    </a>
  );
}

export default function Home() {
  const weekMenu = [recipes[0], recipes[3], recipes[1], recipes[5]];
  const people = 2;
  const weekTotal = weekMenu.reduce((s, r) => s + costPerPerson(r) * people, 0);
  const cheapest = Math.min(...recipes.map(costPerPerson));
  const sortedProducts = [...products].sort((a, b) => pricePerKg(a) - pricePerKg(b));

  return (
    <>
      {/* En-tête */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-extrabold">
            🥩 Carnivore<span className="text-accent">.ma</span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="#features" className="hidden text-sm sm:inline">Fonctionnalités</a>
            <a href="#prix" className="hidden text-sm sm:inline">Prix de la viande</a>
            <ThemeToggle />
            <a href="#beta" className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white">
              Mon menu
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 text-center sm:pt-24">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
            🇲🇦 Pensé pour le Maroc
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Mange carnivore, <span className="text-accent">pile dans ton budget</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Carnivore.ma connaît le vrai prix de la viande dans ton supermarché, compose tes repas de la semaine et
            te prépare la liste de courses. Tu fixes ton budget en dirhams, on s&apos;occupe du reste.
          </p>
          <div className="mt-8">
            <Cta>Découvrir mon menu carnivore</Cta>
          </div>
          <p className="mt-10 text-sm text-muted">Les prix de tes enseignes, relevés pour de vrai</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {stores.map((s) => (
              <li key={s.name} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm">
                {s.name}
              </li>
            ))}
          </ul>
        </section>

        {/* Le mécanisme */}
        <Section id="features" kicker="Le mécanisme" title={<>Chaque plat a un prix. <span className="text-accent">En dirhams.</span></>}>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-4 text-lg text-muted">
              <p>
                Carnivore.ma calcule le coût de chaque recette, ingrédient par ingrédient, à partir des{" "}
                <strong className="text-foreground">prix réellement affichés</strong> par ton enseigne. Pas une moyenne
                nationale : le prix du jour, promos comprises.
              </p>
              <p>Ton menu de la semaine n&apos;est plus une surprise en caisse : c&apos;est un budget que tu connais avant de partir.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex justify-between text-sm text-muted">
                <span className="font-semibold text-foreground">Menu de la semaine</span>
                <span>4 dîners · {people} pers</span>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {weekMenu.map((r) => (
                  <li key={r.name} className="flex justify-between py-3">
                    <span>{r.name}</span>
                    <span className="text-right">
                      <span className="font-semibold">{mad(costPerPerson(r) * people)}</span>
                      <span className="block text-xs text-muted">{mad(costPerPerson(r))}/pers</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-bold">
                <span>Total viande de la semaine</span>
                <span className="text-accent">{mad(weekTotal)}</span>
              </div>
              <p className="mt-3 text-xs text-muted">Calculé avec les prix Carrefour relevés le {PRICE_DATE}, hors épices et accompagnements.</p>
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
        <Section kicker="Concrètement" title="Ce que ça change à la fin du mois">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-accent-soft p-6">
              <p className="text-4xl font-extrabold text-accent">dès {Math.ceil(cheapest)} MAD</p>
              <p className="mt-2 font-semibold">le plat carnivore maison, par personne</p>
              <p className="mt-1 text-sm text-muted">Calculé sur les prix Carrefour du {PRICE_DATE}.</p>
            </div>
            <div className="rounded-2xl bg-accent-soft p-6">
              <p className="text-4xl font-extrabold text-accent">{products.length} produits</p>
              <p className="mt-2 font-semibold">suivis au prix réel</p>
              <p className="mt-1 text-sm text-muted">Bœuf, agneau, volaille, abats… et bientôt plus d&apos;enseignes.</p>
            </div>
            <div className="rounded-2xl bg-accent-soft p-6">
              <p className="text-4xl font-extrabold text-accent">0 calcul</p>
              <p className="mt-2 font-semibold">pour ton budget protéines</p>
              <p className="mt-1 text-sm text-muted">Le « on mange quoi ce soir ? » est réglé depuis dimanche.</p>
            </div>
          </div>
        </Section>

        {/* Prix de la viande */}
        <Section id="prix" kicker="Prix de la viande cette semaine" title="Les mêmes protéines n'ont pas le même prix.">
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Enseigne</th>
                  <th className="p-4 text-right">Prix affiché</th>
                  <th className="p-4 text-right">Prix au kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4">
                      {p.name}
                      {p.promo && <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">{p.promo}</span>}
                    </td>
                    <td className="p-4 text-muted">{p.store}</td>
                    <td className="p-4 text-right">
                      {mad(p.priceMad)} <span className="text-muted">/ {p.weightKg >= 1 ? "kg" : `${p.weightKg * 1000} g`}</span>
                    </td>
                    <td className="p-4 text-right font-semibold">{mad(pricePerKg(p))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            Prix relevés en ligne sur Carrefour Hypermarket (Bringo) le {PRICE_DATE}. Marques © leurs propriétaires respectifs.
          </p>
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
        <Section kicker="Ta réserve" title="Des plats carnivores marocains, tous chiffrés.">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recipes.map((r) => (
              <div key={r.name} className="rounded-2xl border border-border bg-card p-4">
                <span className="text-xs font-semibold uppercase text-accent">{r.tag}</span>
                <p className="mt-1 font-bold">{r.name}</p>
                <p className="mt-3 text-sm text-muted">{r.minutes} min</p>
                <p className="font-semibold">{mad(costPerPerson(r))} /pers</p>
              </div>
            ))}
          </div>
        </Section>

        {/* L'app en images */}
        <Section kicker="L'app en images" title="Tout est là, rien à gérer.">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-bold">L&apos;inspi tombe du ciel.</h3>
              <p className="mt-1 text-muted">Kefta, tagine, mechoui… des idées carnivores variées.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Express", "Mijoté", "Barbecue", "Abats", "Fête", "Plaisir"].map((t) => (
                  <span key={t} className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-bold">On compose ton menu.</h3>
              <p className="mt-1 text-muted">Tu l&apos;ajustes à volonté : un plat ne te plaît pas, tu le remplaces.</p>
              <ul className="mt-4 space-y-2 text-sm">
                {weekMenu.map((r) => (
                  <li key={r.name} className="flex justify-between rounded-lg bg-background px-3 py-2">
                    <span>{r.name}</span>
                    <span className="text-muted">{r.minutes} min</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-bold">Ta liste, triée par rayon.</h3>
              <p className="mt-1 text-muted">Tout est additionné. Tu n&apos;as plus qu&apos;à cocher.</p>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-accent">Boucherie</p>
                  <p>Viande hachée · 400 g</p>
                  <p>Tagine de bœuf avec os · 600 g</p>
                  <p>Collier de bœuf · 500 g</p>
                </div>
                <div>
                  <p className="font-semibold text-accent">Volaille</p>
                  <p>Poulet entier · 1 pièce</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Bêta */}
        <section id="beta" className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl bg-accent px-6 py-12 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">Sois parmi les premiers</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              La bêta ouvre bientôt à Casablanca, Rabat et Marrakech. Les premiers inscrits auront un accès gratuit
              prolongé.
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
            <p className="font-extrabold text-foreground">🥩 Carnivore.ma</p>
            <p className="mt-1">© {new Date().getFullYear()} Carnivore.ma — Tous droits réservés.</p>
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
