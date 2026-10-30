import type { MetadataRoute } from "next";
import { diets } from "@/lib/nutrition";
import { recipes } from "@/lib/recipes";
import { SITE_URL } from "./_site";

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: Frequency) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("/", 1, "weekly"),
    page("/prix", 0.9, "daily"),
    page("/prix-du-souk", 0.9, "weekly"),
    page("/commencer", 0.8, "monthly"),
    page("/recettes", 0.9, "weekly"),
    ...recipes.map((r) => page(`/recettes/${r.id}`, 0.7, "weekly")),
    ...diets.map((d) => page(`/regimes/${d.id}`, 0.8, "monthly")),
    ...["mentions-legales", "cgu", "cgv", "confidentialite"].map((s) => page(`/legal/${s}`, 0.2, "yearly")),
  ];
}
