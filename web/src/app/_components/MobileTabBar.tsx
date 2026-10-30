"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Accueil", icon: "🏠" },
  { href: "/recettes", label: "Recettes", icon: "🍳" },
  { href: "/commencer", label: "Mon menu", icon: "⚖️", main: true },
  { href: "/prix-du-souk", label: "Souk", icon: "🥕" },
  { href: "/prix", label: "Prix", icon: "🏷️" },
];

// Barre d'onglets façon application, sur mobile uniquement.
export default function MobileTabBar() {
  const path = usePathname();
  if (path === "/commencer") return null;
  return (
    <nav aria-label="Navigation mobile" className="fixed inset-x-3 bottom-3 z-30 md:hidden">
      <ul className="glass flex items-end justify-between rounded-3xl px-2 py-1.5 shadow-2xl shadow-black/30">
        {tabs.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-semibold transition-colors ${
                  t.main ? "" : active ? "text-accent" : "text-muted"
                }`}
              >
                {t.main ? (
                  <span className="btn-glow -mt-6 grid size-14 place-items-center rounded-2xl bg-accent text-2xl text-on-accent" aria-hidden="true">
                    {t.icon}
                  </span>
                ) : (
                  <span className={`text-xl transition-transform ${active ? "scale-110" : ""}`} aria-hidden="true">
                    {t.icon}
                  </span>
                )}
                <span className={t.main ? "text-accent" : ""}>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
