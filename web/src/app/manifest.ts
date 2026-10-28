import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/config";
import { ACCENT, SITE_DESCRIPTION, SITE_NAME, THEME_LIGHT } from "./_site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: BRAND,
    description: SITE_DESCRIPTION,
    lang: "fr-MA",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: THEME_LIGHT,
    theme_color: ACCENT,
    categories: ["food", "health", "lifestyle"],
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
