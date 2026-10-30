import type { Recipe } from "./recipes";

// Plats express (20 minutes au plus, sans four) pour compléter le mode étudiant
// en végan et en carnivore. Légumineuses : poids sec, à prendre cuites (bocal ou préparées à l'avance).

const student = { tags: ["etudiant", "fitness"] as Recipe["tags"] };

export const expressRecipes: Recipe[] = [
  // Végans
  {
    id: "fv-salade-pois-chiches",
    name: "Salade express pois chiches, concombre & tomate",
    meal: "plat",
    minutes: 10,
    ingredients: [{ id: "pois-chiche", grams: 100 }, { id: "concombre", grams: 100 }, { id: "tomate", grams: 100 }, { id: "oignon", grams: 20 }, { id: "pain-mie", grams: 30 }, { id: "huile-olive", grams: 5 }],
    steps: ["Rince et égoutte les pois chiches cuits.", "Coupe le concombre, la tomate et l'oignon en petits dés.", "Mélange avec l'huile d'olive, du citron, du cumin, du sel et du persil.", "Sers avec le pain grillé."],
    ...student,
    equipment: ["sans-cuisson"],
  },
  {
    id: "fv-poelee-pois-chiches-epinards",
    name: "Poêlée pois chiches, épinards & semoule",
    meal: "plat",
    minutes: 15,
    ingredients: [{ id: "pois-chiche", grams: 100 }, { id: "epinards", grams: 120 }, { id: "tomate", grams: 80 }, { id: "semoule", grams: 40 }, { id: "huile-olive", grams: 6 }],
    steps: ["Verse de l'eau bouillante salée sur la semoule, couvre 5 minutes et égrène.", "Fais dorer les pois chiches cuits 4 minutes dans l'huile avec de l'ail, du cumin et du paprika.", "Ajoute la tomate en dés puis les épinards, et laisse tomber 3 minutes.", "Sers sur la semoule avec un trait de citron."],
    ...student,
    equipment: ["poele"],
  },
  {
    id: "fv-lentilles-express",
    name: "Lentilles express à la tomate & carotte",
    meal: "plat",
    minutes: 20,
    ingredients: [{ id: "lentilles", grams: 90 }, { id: "carotte", grams: 80 }, { id: "tomate", grams: 100 }, { id: "semoule", grams: 30 }, { id: "huile-olive", grams: 5 }],
    steps: ["Mets les lentilles, la carotte râpée et la tomate en dés dans une casserole avec 3 fois leur volume d'eau, du cumin et du paprika.", "Laisse cuire 18 minutes à feu moyen, puis sale.", "Prépare la semoule à l'eau bouillante pendant ce temps.", "Sers avec un filet d'huile d'olive et de la coriandre."],
    ...student,
    equipment: ["casserole"],
  },
  {
    id: "fv-haricots-tomate-poivron",
    name: "Haricots blancs tomate-poivron & pain grillé",
    meal: "plat",
    minutes: 15,
    ingredients: [{ id: "haricot-blanc", grams: 100 }, { id: "tomate", grams: 150 }, { id: "poivron-vert", grams: 60 }, { id: "pain-mie", grams: 40 }, { id: "huile-olive", grams: 5 }],
    steps: ["Fais revenir le poivron émincé 3 minutes dans l'huile d'olive.", "Ajoute la tomate en dés, de l'ail, du cumin et du paprika, et laisse réduire 5 minutes.", "Ajoute les haricots cuits et réchauffe 3 minutes.", "Sers avec le pain grillé."],
    ...student,
    equipment: ["poele"],
  },
  {
    id: "fv-pates-pois-chiches-courgette",
    name: "Pâtes pois chiches & courgette",
    meal: "plat",
    minutes: 20,
    ingredients: [{ id: "spaghetti", grams: 50 }, { id: "pois-chiche", grams: 80 }, { id: "courgette", grams: 120 }, { id: "tomate", grams: 80 }, { id: "huile-olive", grams: 5 }],
    steps: ["Fais cuire les pâtes dans l'eau bouillante salée.", "Fais sauter la courgette en dés 5 minutes dans l'huile avec de l'ail.", "Ajoute la tomate et les pois chiches cuits, et laisse 4 minutes.", "Mélange avec les pâtes égouttées et un peu d'eau de cuisson."],
    ...student,
    equipment: ["casserole", "poele"],
  },
  {
    id: "fv-riz-saute-haricots-brocoli",
    name: "Riz sauté haricots, brocoli & poivron",
    meal: "plat",
    minutes: 15,
    ingredients: [{ id: "haricot-blanc", grams: 90 }, { id: "brocoli", grams: 100 }, { id: "poivron", grams: 60 }, { id: "riz", grams: 30 }, { id: "huile-table", grams: 6 }],
    steps: ["Utilise du riz cuit la veille et des haricots déjà cuits.", "Fais sauter le brocoli en petites fleurettes et le poivron 5 minutes à feu vif dans l'huile.", "Ajoute le riz, les haricots, de l'ail et du gingembre, et fais sauter 4 minutes.", "Sale, poivre et sers."],
    ...student,
    equipment: ["poele"],
  },
  {
    id: "fv-chili-express",
    name: "Chili express haricots & poivrons",
    meal: "plat",
    minutes: 20,
    ingredients: [{ id: "haricot-blanc", grams: 100 }, { id: "tomate", grams: 150 }, { id: "oignon", grams: 40 }, { id: "poivron", grams: 80 }, { id: "semoule", grams: 30 }, { id: "huile-olive", grams: 5 }],
    steps: ["Fais revenir l'oignon et le poivron 5 minutes dans l'huile.", "Ajoute la tomate, les haricots cuits, du cumin, du paprika et du piment, et laisse mijoter 10 minutes.", "Prépare la semoule à l'eau bouillante.", "Sers le chili sur la semoule avec de la coriandre."],
    ...student,
    equipment: ["poele"],
  },

  // Carnivores
  {
    id: "fc-filet-poulet-beurre",
    name: "Filet de poulet poêlé au beurre",
    meal: "plat",
    minutes: 15,
    ingredients: [{ id: "filet-poulet", grams: 220 }, { id: "beurre", grams: 10 }],
    steps: ["Coupe le filet en deux dans l'épaisseur pour qu'il cuise vite.", "Saisis-le 4 minutes par face dans le beurre mousseux.", "Sale, poivre et laisse reposer 2 minutes avant de servir."],
    ...student,
    equipment: ["poele"],
  },
  {
    id: "fc-cuisses-poelees",
    name: "Hauts de cuisse poêlés croustillants",
    meal: "plat",
    minutes: 20,
    ingredients: [{ id: "cuisse", grams: 280 }],
    steps: ["Assaisonne les hauts de cuisse de sel, de poivre et de paprika.", "Pose-les côté peau dans une poêle froide, puis mets à feu moyen.", "Laisse cuire 12 minutes sans toucher, retourne et cuis encore 6 minutes à couvert."],
    ...student,
    equipment: ["poele"],
  },
  {
    id: "fc-dinde-gruyere",
    name: "Escalope de dinde au gruyère fondu",
    meal: "plat",
    minutes: 12,
    ingredients: [{ id: "escalope-dinde", grams: 200 }, { id: "gruyere", grams: 25 }, { id: "beurre", grams: 5 }],
    steps: ["Saisis l'escalope 3 minutes dans le beurre.", "Retourne-la, pose le gruyère dessus et couvre.", "Laisse fondre 3 minutes, sale et poivre."],
    ...student,
    equipment: ["poele"],
  },
];
