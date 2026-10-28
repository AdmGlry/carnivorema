import { foodById } from "./foods";
import { Recipe, recipeNutrition } from "./recipes";

export type Sex = "homme" | "femme";
export type Goal = "perdre" | "perdre-doux" | "maintenir" | "prendre";
export type DietId =
  | "equilibre"
  | "mediterraneen"
  | "proteine"
  | "vegetarien"
  | "vegan"
  | "low-carb"
  | "keto"
  | "carnivore";

export const activityLevels = [
  { value: 1.2, label: "Sédentaire (bureau, peu de marche)" },
  { value: 1.375, label: "Légère (1-3 séances / semaine)" },
  { value: 1.55, label: "Modérée (3-5 séances / semaine)" },
  { value: 1.725, label: "Intense (6-7 séances / semaine)" },
  { value: 1.9, label: "Très intense (sport + travail physique)" },
];

export const goals: { value: Goal; label: string; delta: number }[] = [
  { value: "perdre", label: "Perdre du poids (≈ -0,5 kg / semaine)", delta: -500 },
  { value: "perdre-doux", label: "Perdre doucement (≈ -0,25 kg / semaine)", delta: -250 },
  { value: "maintenir", label: "Maintenir mon poids", delta: 0 },
  { value: "prendre", label: "Prendre du poids / du muscle", delta: 300 },
];

type Diet = {
  id: DietId;
  name: string;
  emoji: string;
  description: string;
  // part des calories venant des lipides (ignorée si maxCarbs est fixé)
  fatShare: number;
  maxCarbs?: number;
  proteinBoost?: number;
  allows: (r: Recipe) => boolean;
};

const cats = (r: Recipe) => r.ingredients.map((i) => foodById[i.id].category);
const has = (r: Recipe, list: string[]) => cats(r).some((c) => list.includes(c));
const only = (r: Recipe, list: string[]) => cats(r).every((c) => list.includes(c));

export const diets: Diet[] = [
  { id: "equilibre", name: "Équilibré", emoji: "⚖️", description: "Un peu de tout, en bonnes proportions.", fatShare: 0.3, allows: () => true },
  {
    id: "mediterraneen",
    name: "Méditerranéen",
    emoji: "🫒",
    description: "Poisson, volaille, légumes et légumineuses, peu de viande rouge.",
    fatShare: 0.35,
    allows: (r) => !has(r, ["viande"]),
  },
  { id: "proteine", name: "Riche en protéines", emoji: "💪", description: "Pour la musculation et la satiété.", fatShare: 0.28, proteinBoost: 0.4, allows: () => true },
  { id: "vegetarien", name: "Végétarien", emoji: "🥚", description: "Sans viande ni poisson, avec œufs et laitiers.", fatShare: 0.3, allows: (r) => !has(r, ["viande", "volaille", "poisson"]) },
  {
    id: "vegan",
    name: "Végan",
    emoji: "🌱",
    description: "100 % végétal : légumineuses, céréales, légumes.",
    fatShare: 0.25,
    allows: (r) => !has(r, ["viande", "volaille", "poisson", "oeuf", "laitier"]),
  },
  {
    id: "low-carb",
    name: "Pauvre en glucides",
    emoji: "🥗",
    description: "Moins de féculents, plus de protéines et de légumes.",
    fatShare: 0.45,
    maxCarbs: 100,
    allows: (r) => recipeNutrition(r).carbs <= 35,
  },
  { id: "keto", name: "Cétogène", emoji: "🥑", description: "Très peu de glucides, beaucoup de bons gras.", fatShare: 0.7, maxCarbs: 30, allows: (r) => recipeNutrition(r).carbs <= 12 },
  {
    id: "carnivore",
    name: "Carnivore",
    emoji: "🥩",
    description: "Uniquement viandes, poissons, œufs et beurre.",
    fatShare: 0.6,
    maxCarbs: 10,
    allows: (r) => only(r, ["viande", "volaille", "poisson", "oeuf", "laitier"]),
  },
];

export const dietById = Object.fromEntries(diets.map((d) => [d.id, d])) as Record<DietId, Diet>;

export type Profile = {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
  activity: number;
  goal: Goal;
  diet: DietId;
  glutenFree: boolean;
  lactoseFree: boolean;
  people: number;
  monthlyBudget: number;
};

export type Targets = {
  bmi: number;
  bmiLabel: string;
  bmr: number;
  tdee: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  dailyBudgetPerPerson: number;
  warnings: string[];
};

export function bmiLabel(bmi: number) {
  if (bmi < 18.5) return "Insuffisance pondérale";
  if (bmi < 25) return "Corpulence normale";
  if (bmi < 30) return "Surpoids";
  return "Obésité";
}

export function computeTargets(p: Profile): Targets {
  const warnings: string[] = [];
  const bmi = p.weightKg / (p.heightCm / 100) ** 2;
  // Mifflin-St Jeor
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === "homme" ? 5 : -161);
  const tdee = bmr * p.activity;

  let goal = p.goal;
  if (bmi < 18.5 && goal.startsWith("perdre")) {
    goal = "maintenir";
    warnings.push("Ton IMC est déjà bas : on ne te propose pas de perte de poids. Parles-en à un médecin.");
  }
  if (p.age < 18) warnings.push("Moins de 18 ans : demande l'avis d'un médecin avant tout régime.");

  const floor = p.sex === "homme" ? 1500 : 1200;
  const delta = goals.find((g) => g.value === goal)!.delta;
  const kcal = Math.max(floor, tdee + delta);
  if (tdee + delta < floor) warnings.push(`On ne descend pas sous ${floor} kcal par jour, par sécurité.`);

  const diet = dietById[p.diet];
  const baseProtein = goal === "maintenir" ? 1.4 : goal === "prendre" ? 1.8 : 1.8;
  const protein = p.weightKg * (baseProtein + (diet.proteinBoost ?? 0));
  let carbs: number;
  let fat: number;
  if (diet.maxCarbs !== undefined) {
    // Régimes à glucides plafonnés : le reste des calories vient des lipides.
    carbs = diet.maxCarbs;
    fat = Math.max(0, (kcal - protein * 4 - carbs * 4) / 9);
  } else {
    fat = (kcal * diet.fatShare) / 9;
    carbs = Math.max(0, (kcal - protein * 4 - fat * 9) / 4);
  }

  return {
    bmi,
    bmiLabel: bmiLabel(bmi),
    bmr,
    tdee,
    kcal,
    protein,
    carbs,
    fat,
    dailyBudgetPerPerson: p.monthlyBudget / 30 / Math.max(1, p.people),
    warnings,
  };
}

export function recipeAllowed(r: Recipe, p: Pick<Profile, "diet" | "glutenFree" | "lactoseFree">) {
  if (!dietById[p.diet].allows(r)) return false;
  const fs = r.ingredients.map((i) => foodById[i.id]);
  if (p.glutenFree && fs.some((f) => f.gluten)) return false;
  if (p.lactoseFree && fs.some((f) => f.lactose)) return false;
  return true;
}
