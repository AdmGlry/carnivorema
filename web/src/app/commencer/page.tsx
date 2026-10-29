import type { Metadata } from "next";
import Onboarding from "@/components/Onboarding";

export const metadata: Metadata = {
  title: "Mon menu en 10 questions",
  description: "Réponds à 10 questions (âge, poids, taille, objectif, régime, budget) et reçois ton menu de la semaine avec la liste de courses au prix réel.",
  alternates: { canonical: "/commencer" },
};

export default function CommencerPage() {
  return <Onboarding />;
}
