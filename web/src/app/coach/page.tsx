import type { Metadata } from "next";
import Coach from "@/components/Coach";

export const metadata: Metadata = {
  title: "Mon coach",
  description: "Coche tes repas, pèse-toi, et ton coach ajuste tes calories chaque semaine selon tes vrais résultats.",
  alternates: { canonical: "/coach" },
};

export default function CoachPage() {
  return <Coach />;
}
