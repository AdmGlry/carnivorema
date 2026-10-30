import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { BRAND, BRAND_TLD } from "@/lib/config";

const links = [
  { href: "/prix-du-souk", label: "Souk" },
  { href: "/recettes", label: "Recettes" },
  { href: "/#regimes", label: "Régimes" },
  { href: "/prix", label: "Prix" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-extrabold" aria-label={`${BRAND}${BRAND_TLD}, accueil`}>
          <span aria-hidden="true">⚖️ </span>
          {BRAND}
          <span className="text-accent">{BRAND_TLD}</span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-5 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/commencer" className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-on-accent">
            Mon menu
          </Link>
        </div>
      </div>
      <nav aria-label="Navigation mobile" className="border-t border-border md:hidden">
        <ul className="mx-auto flex max-w-6xl justify-between px-4 py-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
