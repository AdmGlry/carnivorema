import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import Effects from "@/components/Effects";
import MobileTabBar from "./_components/MobileTabBar";
import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, THEME_DARK, THEME_LIGHT } from "./_site";
import "./globals.css";

// Titres et grands chiffres : une grotesque large et graphique ; texte courant : une sans-serif nette.
const display = Unbounded({ subsets: ["latin"], variable: "--font-display-face", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body-face", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — mange selon ton corps, ton régime et ton budget`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "menu de la semaine",
    "calcul calories",
    "régime",
    "perte de poids",
    "prise de masse",
    "liste de courses",
    "prix supermarché Maroc",
    "recettes marocaines",
    "Carrefour Maroc",
    "Marjane",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — mange selon ton corps, ton régime et ton budget`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_LIGHT },
    { media: "(prefers-color-scheme: dark)", color: THEME_DARK },
  ],
  colorScheme: "light dark",
};

// Applique le thème avant le premier rendu pour éviter le flash. Sombre par défaut : c'est l'identité de Mizan.
const themeScript = `try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased pb-24 md:pb-0">
        <div className="zellige" aria-hidden="true" />
        <div className="aurora" aria-hidden="true" />
        <a
          href="#contenu"
          className="sr-only rounded-full bg-accent px-4 py-2 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileTabBar />
        <Effects />
      </body>
    </html>
  );
}
