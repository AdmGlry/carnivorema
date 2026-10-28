import Link from "next/link";
import { BRAND, BRAND_TLD } from "@/lib/config";
import { diets } from "@/lib/nutrition";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted sm:grid-cols-3">
        <div>
          <p className="font-extrabold text-foreground">
            <span aria-hidden="true">⚖️ </span>
            {BRAND}
            {BRAND_TLD}
          </p>
          <p className="mt-1">Mange selon ton corps, ton régime et ton budget.</p>
          <p className="mt-3">© {new Date().getFullYear()} {BRAND} — Tous droits réservés.</p>
        </div>
        <nav aria-label="Régimes">
          <p className="font-semibold text-foreground">Régimes</p>
          <ul className="mt-2 grid grid-cols-2 gap-1">
            {diets.map((d) => (
              <li key={d.id}>
                <Link href={`/regimes/${d.id}`} className="hover:text-accent">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Liens utiles">
          <p className="font-semibold text-foreground">Liens utiles</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/recettes" className="hover:text-accent">Toutes les recettes</Link></li>
            <li><Link href="/prix" className="hover:text-accent">Prix de la semaine</Link></li>
            <li><Link href="/legal/mentions-legales" className="hover:text-accent">Mentions légales</Link></li>
            <li><Link href="/legal/cgu" className="hover:text-accent">CGU</Link></li>
            <li><Link href="/legal/cgv" className="hover:text-accent">CGV</Link></li>
            <li><Link href="/legal/confidentialite" className="hover:text-accent">Confidentialité</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
