import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mizan.ma — mange selon ton corps, ton régime et ton budget",
  description:
    "Calcul de tes besoins, menus pour tous les régimes et liste de courses au vrai prix des supermarchés marocains.",
};

// Applique le thème avant le premier rendu pour éviter le flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
