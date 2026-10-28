import { OG_SIZE, ogCard } from "./_og/card";

export const alt = "Mange selon ton corps, ton régime et ton budget";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Pensé pour le Maroc",
    title: "Mange selon ton corps, ton régime et ton budget",
    subtitle: "Calories, menus de la semaine et liste de courses au vrai prix des supermarchés.",
  });
}
