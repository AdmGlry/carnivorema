import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mad } from "@/lib/foods";
import { DietId, Profile, computeTargets, diets, recipeAllowed } from "@/lib/nutrition";
import { mealLabels, recipeNutrition, recipes } from "@/lib/recipes";
import JsonLd from "../../_components/JsonLd";
import { SITE_URL, round } from "../../_site";

export const dynamicParams = false;

export function generateStaticParams() {
  return diets.map((d) => ({ id: d.id }));
}

// Contenu éditorial par régime ; un régime ajouté sans texte affiche sa description courte.
const content: Partial<Record<DietId, { intro: string; eat: string[]; avoid: string[]; caution?: string }>> = {
  equilibre: {
    intro: "Le régime équilibré répartit les calories entre protéines, glucides et lipides sans rien interdire. C'est le point de départ le plus simple et le plus durable.",
    eat: ["Viandes, volailles, poissons et œufs", "Légumes et fruits de saison", "Féculents : couscous, riz, pâtes, pommes de terre", "Légumineuses et produits laitiers"],
    avoid: ["Rien d'interdit : on surveille surtout les quantités et les produits très transformés"],
  },
  mediterraneen: {
    intro: "Inspiré des cuisines du pourtour méditerranéen, dont la cuisine marocaine : beaucoup de légumes, de légumineuses, de poisson et de volaille, peu de viande rouge.",
    eat: ["Poisson et volaille", "Légumes, légumineuses (lentilles, pois chiches, fèves)", "Céréales et féculents", "Œufs et laitiers fermentés"],
    avoid: ["Viande rouge (limitée)", "Produits sucrés et ultra-transformés"],
  },
  proteine: {
    intro: "Une part de protéines plus élevée, pour préserver ou construire du muscle pendant une sèche ou une prise de masse, et pour mieux tenir la faim.",
    eat: ["Viandes maigres, filet de poulet, poisson", "Œufs, kéfir, fromage", "Légumineuses", "Féculents autour de l'entraînement"],
    avoid: ["Repas sans source de protéines"],
    caution: "En cas de maladie des reins, demande l'avis d'un médecin avant d'augmenter tes protéines.",
  },
  vegetarien: {
    intro: "Sans viande ni poisson, mais avec œufs et produits laitiers, qui apportent des protéines complètes à petit prix.",
    eat: ["Œufs et produits laitiers", "Légumineuses et céréales", "Légumes et fruits"],
    avoid: ["Viande, volaille, poisson et fruits de mer"],
    caution: "Surveille tes apports en fer : associe les légumineuses à une source de vitamine C (citron, tomate).",
  },
  vegan: {
    intro: "Une alimentation 100 % végétale. Les légumineuses associées aux céréales (couscous et pois chiches, riz et haricots) couvrent les besoins en protéines.",
    eat: ["Lentilles, pois chiches, haricots, fèves", "Céréales : couscous, riz, pâtes", "Légumes, fruits, fruits secs"],
    avoid: ["Tous les produits animaux : viande, poisson, œufs, lait, beurre, miel"],
    caution: "Une supplémentation en vitamine B12 est indispensable en alimentation végane. Parles-en à un professionnel de santé.",
  },
  "low-carb": {
    intro: "Moins de féculents et de sucres, plus de protéines, de légumes et de bonnes graisses, sans aller jusqu'à la cétose.",
    eat: ["Viandes, poissons, œufs", "Légumes verts et de saison", "Avocat, fromage, beurre en quantité raisonnable"],
    avoid: ["Pain, pâtes, riz, couscous en grande quantité", "Boissons et desserts sucrés"],
  },
  keto: {
    intro: "Le régime cétogène limite fortement les glucides (environ 30 g par jour) pour que le corps utilise surtout les graisses comme carburant.",
    eat: ["Viandes, poissons, œufs", "Beurre, avocat, fromage", "Légumes pauvres en glucides : courgette, aubergine, haricots verts"],
    avoid: ["Féculents, légumineuses, pain", "Fruits sucrés, sucre, boissons sucrées"],
    caution: "Déconseillé en cas de diabète traité, de grossesse ou de maladie du foie ou des reins sans suivi médical.",
  },
  carnivore: {
    intro: "Uniquement des produits animaux : viandes, abats, poissons, œufs et beurre. C'est le régime le plus restrictif et souvent le plus coûteux.",
    eat: ["Bœuf, agneau, poulet, abats", "Poissons et fruits de mer", "Œufs, beurre"],
    avoid: ["Tous les végétaux : légumes, fruits, céréales, légumineuses"],
    caution: "Régime très restrictif, peu étudié sur le long terme. Fais un suivi médical (bilan sanguin) si tu le pratiques plusieurs semaines.",
  },
};

const reference: Omit<Profile, "diet">[] = [
  { sex: "homme", age: 30, weightKg: 78, heightCm: 176, activity: 1.55, goal: "maintenir", glutenFree: false, lactoseFree: false, people: 1, monthlyBudget: 1500 },
  { sex: "femme", age: 30, weightKg: 62, heightCm: 164, activity: 1.375, goal: "maintenir", glutenFree: false, lactoseFree: false, people: 1, monthlyBudget: 1500 },
];

const find = (id: string) => diets.find((d) => d.id === id);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const d = find((await params).id);
  if (!d) return {};
  const title = `Régime ${d.name.toLowerCase()} : principes, macros et recettes au prix marocain`;
  const description = `${content[d.id]?.intro ?? d.description} Macros conseillées et recettes compatibles chiffrées au prix réel.`;
  return { title, description, alternates: { canonical: `/regimes/${d.id}` }, openGraph: { title, description, url: `/regimes/${d.id}` } };
}

export default async function DietPage({ params }: { params: Promise<{ id: string }> }) {
  const d = find((await params).id);
  if (!d) notFound();

  const text = content[d.id];
  const compatible = recipes.filter((r) => recipeAllowed(r, { diet: d.id, glutenFree: false, lactoseFree: false }));
  const examples = reference.map((p) => {
    const t = computeTargets({ ...p, diet: d.id });
    const total = t.protein * 4 + t.carbs * 4 + t.fat * 9 || 1;
    return {
      label: p.sex === "homme" ? `Homme, ${p.age} ans, ${p.weightKg} kg, ${p.heightCm} cm, activité modérée` : `Femme, ${p.age} ans, ${p.weightKg} kg, ${p.heightCm} cm, activité légère`,
      kcal: t.kcal,
      macros: [
        { label: "Protéines", g: t.protein, pct: (t.protein * 4) / total },
        { label: "Glucides", g: t.carbs, pct: (t.carbs * 4) / total },
        { label: "Lipides", g: t.fat, pct: (t.fat * 9) / total },
      ],
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Régime ${d.name}`,
    url: `${SITE_URL}/regimes/${d.id}`,
    inLanguage: "fr-MA",
    about: { "@type": "Diet", name: d.name, description: text?.intro ?? d.description },
  };

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <JsonLd data={jsonLd} />
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Accueil</Link> / <Link href="/#regimes" className="hover:text-accent">Régimes</Link> /{" "}
        <span aria-current="page">{d.name}</span>
      </nav>
      <p className="mt-6 text-4xl" aria-hidden="true">{d.emoji}</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-5xl">Régime {d.name.toLowerCase()}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">{text?.intro ?? d.description}</p>

      {text && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <section aria-labelledby="manger" className="rounded-2xl border border-border bg-card p-6">
            <h2 id="manger" className="text-xl font-bold">On mange</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              {text.eat.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>
          <section aria-labelledby="eviter" className="rounded-2xl border border-border bg-card p-6">
            <h2 id="eviter" className="text-xl font-bold">On évite</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
              {text.avoid.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>
        </div>
      )}

      <section aria-labelledby="macros" className="mt-12">
        <h2 id="macros" className="text-2xl font-bold">Macros typiques par jour</h2>
        <p className="mt-2 text-muted">Exemples pour maintenir son poids. Tes chiffres dépendent de ton profil : calcule-les gratuitement.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {examples.map((ex) => (
            <div key={ex.label} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted">{ex.label}</p>
              <p className="mt-1 text-2xl font-bold">{round(ex.kcal)} kcal</p>
              <ul className="mt-4 space-y-3">
                {ex.macros.map((m) => (
                  <li key={m.label}>
                    <div className="flex justify-between text-sm">
                      <span>{m.label}</span>
                      <span className="font-semibold">
                        {round(m.g)} g <span className="font-normal text-muted">({round(m.pct * 100)} %)</span>
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-accent-soft" aria-hidden="true">
                      <div className="h-2 rounded-full bg-accent" style={{ width: `${Math.min(100, m.pct * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="recettes" className="mt-12">
        <h2 id="recettes" className="text-2xl font-bold">{compatible.length} recettes compatibles</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {compatible.map((r) => {
            const n = recipeNutrition(r);
            return (
              <li key={r.id}>
                <Link href={`/recettes/${r.id}`} className="block h-full rounded-xl border border-border bg-card p-4 hover:border-accent">
                  <span className="text-xs font-semibold uppercase text-accent">{mealLabels[r.meal]}</span>
                  <span className="mt-1 block font-semibold">{r.name}</span>
                  <span className="mt-1 block text-sm text-muted">
                    {round(n.kcal)} kcal · {round(n.protein)} g prot. · {mad(n.cost)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <aside aria-label="Avertissement santé" className="mt-12 rounded-2xl border border-accent bg-accent-soft p-6 text-sm">
        <p className="font-semibold text-accent">
          <span aria-hidden="true">⚠️ </span>À lire avant de commencer
        </p>
        {text?.caution && <p className="mt-2">{text.caution}</p>}
        <p className="mt-2">
          Ces informations sont générales et ne remplacent pas un avis médical. En cas de pathologie, de grossesse, d&apos;allaitement, de
          traitement ou si tu as moins de 18 ans, demande conseil à un médecin ou à un diététicien avant de changer ton alimentation.
        </p>
      </aside>

      <div className="mt-8 rounded-2xl bg-card p-6 text-center">
        <h2 className="text-xl font-bold">Ton menu {d.name.toLowerCase()} de la semaine</h2>
        <p className="mt-2 text-muted">Avec tes calories, tes macros et ton budget, au prix réel.</p>
        <Link href="/#essayer" className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-on-accent">
          Calculer mon menu
        </Link>
      </div>
    </article>
  );
}
