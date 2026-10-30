import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { BRAND, BRAND_TLD } from "@/lib/config";

const links = [
  { href: "/recettes", label: "Recettes" },
  { href: "/prix-du-souk", label: "Souk" },
  { href: "/#regimes", label: "Régimes" },
  { href: "/prix", label: "Prix" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 px-3 pt-3">
      <div className="glass mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 shadow-lg shadow-black/10">
        <Link href="/" className="font-display text-base font-bold tracking-tight" aria-label={`${BRAND}${BRAND_TLD}, accueil`}>
          <span aria-hidden="true" className="mr-1.5 inline-grid size-7 place-items-center rounded-lg bg-accent text-sm text-on-accent">
            ⚖
          </span>
          {BRAND}
          <span className="text-accent">{BRAND_TLD}</span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-muted transition-colors hover:bg-accent-soft hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/commencer" className="btn-glow hidden rounded-full bg-accent px-5 py-2 text-sm font-bold text-on-accent sm:inline-block">
            Mon menu →
          </Link>
        </div>
      </div>
    </header>
  );
}
