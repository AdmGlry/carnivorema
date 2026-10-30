import { BRAND, BRAND_TLD } from "@/lib/config";
import { foodById } from "@/lib/foods";
import { diets, recipeAllowed } from "@/lib/nutrition";
import { Recipe } from "@/lib/recipes";

// URL publique du site : à définir via NEXT_PUBLIC_SITE_URL en production.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${BRAND.toLowerCase()}${BRAND_TLD}`).replace(/\/$/, "");
export const SITE_NAME = `${BRAND}${BRAND_TLD}`;
export const SITE_DESCRIPTION =
  "Calcule tes besoins selon ton poids, ta taille et ton objectif, choisis ton régime et reçois ton menu de la semaine avec la liste de courses au vrai prix des supermarchés marocains.";

export const THEME_LIGHT = "#f2f5ec";
export const THEME_DARK = "#060d0a";
export const ACCENT = "#2f7a12";

export const compatibleDiets = (r: Recipe) => diets.filter((d) => recipeAllowed(r, { diet: d.id, glutenFree: false, lactoseFree: false }));

export const recipeHasGluten = (r: Recipe) => r.ingredients.some((i) => foodById[i.id].gluten);
export const recipeHasLactose = (r: Recipe) => r.ingredients.some((i) => foodById[i.id].lactose);

export const round = (n: number) => Math.round(n);
