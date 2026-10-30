import type { Metadata } from "next";
import Onboarding from "@/components/Onboarding";

export const metadata: Metadata = {
  title: "Mon menu en 12 questions",
  description: "Réponds à 12 questions (âge, poids, taille, objectif, régime, souk ou supermarché, cuisine complète ou mode étudiant, budget) et reçois ton menu de la semaine avec la liste de courses au prix réel.",
  alternates: { canonical: "/commencer" },
};

export default function CommencerPage() {
  return <Onboarding />;
}
