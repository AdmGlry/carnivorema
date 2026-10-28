import Link from "next/link";
import { notFound } from "next/navigation";

const pages: Record<string, string> = {
  "mentions-legales": "Mentions légales",
  cgu: "Conditions générales d'utilisation",
  cgv: "Conditions générales de vente",
  confidentialite: "Politique de confidentialité",
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = pages[slug];
  if (!title) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-accent">← Retour</Link>
      <h1 className="mt-4 text-3xl font-bold">{title}</h1>
      <p className="mt-6 text-muted">Cette page sera publiée avant l&apos;ouverture de la bêta.</p>
    </main>
  );
}
