# Recherche : sites de recettes fitness, protéinées et étudiantes

Recherche faite le 30/10/2026 (moteur de recherche web + lecture des pages d'accueil ou d'articles). Objectif : repérer les formats et les idées d'UX dont Mizan peut s'inspirer. On ne copie aucun texte ni aucune recette : les recettes de `recipes-fitness-inspirees.ts` sont écrites de zéro et adaptées aux produits marocains de `foods.ts`. Aucune affiliation.

Les nombres de recettes sont des ordres de grandeur relevés sur les sites eux-mêmes ou leurs profils publics ; quand ils n'ont pas pu être vérifiés, c'est indiqué.

## Les sites retenus

| # | Site | URL | Recettes (approx.) | Points forts |
|---|------|-----|--------------------|--------------|
| 1 | Fit Men Cook | https://fitmencook.com/recipes/ | 1 000+ (dont 400+ meal prep) | Macros en tête de chaque fiche, protéines dans le titre (« 40g Protein »), plans « 5 recettes → 10 repas » à combiner. A même publié un plan « Moroccan Meal Prep » (poulet chermoula, riz au cumin, légumes rôtis, sauce amlou). |
| 2 | Fourchette & Bikini | https://www.fourchette-et-bikini.fr/ | ~1 300 (1 320 sur son profil CuisineAZ) | Référence francophone « healthy & minceur » : recettes simples, calories et protéines dans les légendes, beaucoup de bowls et de desserts protéinés au fromage blanc ou au skyr. |
| 3 | Healthy Food Creation | https://www.healthyfoodcreation.fr/ | plusieurs centaines (non vérifié), en ligne depuis 2016 | Blog très suivi sur Instagram. Plats sains et gourmands, versions « healthy » de classiques (mac & cheese, quiches express), galettes protéinées de légumineuses. |
| 4 | Recettes Protéinées | https://recetteproteine.fr/ | quelques centaines (estimation) | Site 100 % protéiné, tutoiement, classement sucré/salé/encas. Chakchouka aux épinards, wraps, currys de légumineuses, sources de protéines expliquées (tofu, lentilles, pois chiches, oléagineux). |
| 5 | Power Nutrition (blog) | https://www.power-nutrition.fr/blog/recettes-riches-en-proteines-pour-la-musculation-n61 | ~dizaines | Liste compacte : nom, temps et calories sur une ligne (« Omelette aux blancs d'œufs · 10 min · 310 »). Format très rapide à parcourir. |
| 6 | Swipe & Cook | https://www.swipeandcook.fr/meal-prep-etudiant | catalogue d'appli (non chiffré) | Planificateur de repas étudiant : filtre « rapide, moins de 20 min », coût par portion affiché (soupe de lentilles < 2 €, riz sauté < 1 €), conseil « 3 à 4 recettes par semaine, cuisiner 2 à 3 fois ». C'est le concurrent le plus proche de Mizan. |
| 7 | U-Meal (blog) | https://www.u-meal.com/blogs/articles-umeal/repas-proteine-etudiant | articles | Repas protéinés pour étudiants sans vraie cuisine : skyr + avoine le matin, sandwich œufs ou thon le midi. |
| 8 | Marie Claire / Elle à Table (sélections étudiantes) | https://www.marieclaire.fr/cuisine/15-recettes-pour-etudiants,1322844.asp · https://www.elle.fr/Elle-a-Table/Idees-de-menus/Plats-faciles-pour-etudiants | 20 à 50 par sélection | Classement par matériel (« avec ou sans four, au micro-ondes ») et rappel que la version végétarienne revient souvent moins cher. |
| 9 | Nutrola (blog) | https://nutrola.app/fr/blog/college-students-eat-healthy-tiktok-recipes-calorie-tracker | articles | Reprend les recettes TikTok étudiantes : omelette au mug au micro-ondes (3 œufs, poivron, épinards), avec grammages précis. |
| 10 | Côté Maroc : chaînes et comptes fitness | https://www.youtube.com/watch?v=2Vh6xZvytcw (« Harira protéinée ») · https://www.youtube.com/channel/UCA7yB89dIcoKkmjxFykkMGQ (Monquotidienhealthy) · https://www.instagram.com/mealprepmorocco/ | petites chaînes | Le créneau « cuisine marocaine version fitness » existe mais reste peu structuré : harira protéinée, rfissa « healthy », service de meal prep à Marrakech (commande WhatsApp/Glovo). Aucun gros site marocain de recettes fitness filtrables n'est ressorti : c'est une place à prendre pour Mizan. |

## Ce qu'on peut en retenir pour Mizan

**Formats de fiche**
- Mettre les protéines par portion en évidence, au niveau du titre ou juste dessous (Fit Men Cook, Fourchette & Bikini). Mizan calcule déjà les macros : il suffit de les mettre en avant.
- Une ligne de résumé « temps · kcal · protéines · prix » pour parcourir une liste rapidement (Power Nutrition, Swipe & Cook).
- Le coût par portion en dirhams : c'est l'argument numéro un des sites étudiants.

**Filtres**
- Temps (« moins de 20 min »), matériel (micro-ondes seul, sans cuisson, une poêle), objectif (fitness, étudiant, meal prep). Ce sont les étiquettes `tags` et `equipment` déjà prévues dans `Recipe`.
- Végétarien / « légumineuses » comme option économique.

**Meal prep**
- Le format « 5 recettes de base → 10 repas » (une protéine, un féculent, un légume, une sauce à combiner) est le plus repris. Mizan peut proposer une cuisson le dimanche qui couvre plusieurs repas de la semaine et l'indiquer dans la liste de courses.
- Préciser la conservation (3 à 4 jours au frigo) sur les recettes meal prep.

**UX**
- Tutoiement et ton direct (comme recetteproteine.fr), étapes courtes.
- Une version marocaine des tendances (harira protéinée, chakchouka, lben/raïb à la place du skyr) : aucun site ne le fait bien aujourd'hui.

## Tendances repérées

- **Meal prep** en lots : riz ou semoule + poulet/dinde + légumes rôtis, boîtes pour 3 à 4 jours.
- **Bowls** : base féculent ou légumineuses, protéine, crudités, sauce yaourt ou citron.
- **Recettes au micro-ondes** : omelette au mug, porridge en 3 minutes, légumes cuits à la vapeur dans une assiette creuse couverte.
- **Overnight oats** protéinés : avoine + lait + yaourt (ici raïb ou lben) préparés la veille.
- **Bowl cake / mug cake** : banane écrasée + œuf + avoine, 2 minutes au micro-ondes.
- **Produits laitiers riches en protéines** comme base (skyr, cottage cheese, fromage blanc). Au Maroc, l'équivalent abordable : raïb, lben, fromage frais, œufs.
- **Légumineuses** mises en avant comme protéine pas chère : lentilles, pois chiches, haricots blancs, fèves.
- **Conserves malines** : thon et sardines pour un repas sans cuisson en 5 minutes.
- **Plats traditionnels « revisités »** en version protéinée (harira, chakchouka, rfissa).
