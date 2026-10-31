# Veille : coach sportif et nutritionniste IA pour le Maroc

> Éclaireur, équipe Innovation, 31 octobre 2026 (J1).
> Thème : ce que font les meilleures applis, les technos mûres en 2026, ce que dit la science sur l'adhérence, et les spécificités marocaines.
> Toutes les descriptions sont reformulées ; aucun texte de concurrent n'est recopié.

## Ce que Mizan a déjà (point de départ)

- 194 recettes, menus sur 7 jours, 8 régimes, mode étudiant.
- Prix réels Carrefour, Marjane et souk.
- Calcul des besoins : Mifflin-St Jeor × niveau d'activité, plancher de sécurité en kcal (`web/src/lib/nutrition.ts`).
- **Ce qui manque** (vérifié dans le code) : aucun suivi du poids, aucun ajustement adaptatif, rien sur le ramadan, rien en darija, aucun module d'entraînement.

---

## 1. Panorama des concurrents

| Appli | Ce qu'elle fait de mieux | Prix constaté (2026) | Ce que les utilisateurs adorent | Ce qu'ils détestent |
|---|---|---|---|---|
| **MyFitnessPal** | Énorme base d'aliments, code-barres, synchronisation Health Connect | Premium autour de 19,99 $/mois ; offre gratuite rognée | La base de données, l'écosystème | Fonctions de base passées en payant, synchronisation des pas peu fiable |
| **MacroFactor** | Algorithme qui recalcule la dépense réelle (TDEE) à partir du poids et des repas, puis ajuste les cibles chaque semaine | 11,99 $/mois ou 71,99 $/an, pas d'offre gratuite | « Le meilleur algorithme de la catégorie », ton neutre sans culpabilisation | Prix, exige une saisie quotidienne rigoureuse, pas de planification de repas |
| **Yazio** | Suivi + jeûne intermittent | 23,90 à 47,90 $/an | Interface simple, jeûne | Renouvellement automatique, relances vers le payant |
| **Lifesum** | Plans par régime, recettes | 49,99 à 119,99 $/an | Design | Trop de fonctions payantes, base d'aliments centrée sur l'Europe |
| **Noom** | Coaching comportemental (psychologie) + coach humain | Environ 70 $/mois ou 209 $/an | L'approche « pourquoi je mange » | Ton culpabilisant, résiliation difficile, prix jugé injustifié |
| **Cal AI** | Photo d'assiette vers calories, onboarding très travaillé | Environ 9,99 $/mois ou 20 à 30 $/an, prix testés par région | La rapidité de saisie | Prix caché jusqu'à la fin de l'inscription, essai de 3 jours, remboursements difficiles, appli inutilisable sans payer |
| **Fitbod** | Générateur de séances de musculation selon le matériel disponible, surcharge progressive automatique, récupération par muscle | 12,99 à 15,99 $/mois, 79,99 $/an | La progression gérée pour toi | Il faut tout saisir, pas de correction de technique, « générateur plutôt que coach » |
| **Planivore** | Planification de repas + liste de courses selon budget et supermarché choisi | Non publié (projet récent) | Lien budget, courses, menus | Peu de recul, peu d'avis |

Sources :
- MacroFactor : https://www.bentobunny.app/guides/macrofactor-cost ; https://www.mealift.app/blog/macrofactor-review ; https://nutrola.app/en/blog/why-is-macrofactor-so-expensive
- Comparatifs prix : https://thebitetracker.com/field-notes/cheapest-calorie-tracking-apps ; https://nutrola.app/en/blog/every-calorie-tracking-app-compared-2026 ; https://calorietrackerlab.com/compare/noom-vs-myfitnesspal-honest-cost-comparison-detailed-2026/
- Avis 1 étoile (Lifesum, Yazio, Noom) : https://unstar.app/blog/calorie-tracking-apps-ranked-1-star-reviews-2026
- Cal AI : https://nutriscan.app/blog/posts/cal-ai-pricing-2026-monthly-yearly-premium-abc6e7b26f ; https://myclaw.ai/blog/cal-ai-reviews ; https://www.shelog.ai/blog/cal-ai-review-2026
- Fitbod : https://agent-finder.co/reviews/fitbod ; https://www.sensai.fit/blog/fitbod-review-2026
- Planivore : https://blink.new/p/planivore-meal-app-eatnfgxv
- MyFitnessPal et Health Connect : https://community.myfitnesspal.com/en/discussion/10932429/mfp-is-not-loading-all-steps-from-android-health-connect

**Leçon générale :** aucune de ces applis ne relie menu, prix réels en dirhams et produits locaux. Toutes sont en dollars ou en euros, avec des bases d'aliments occidentales. Les reproches les plus fréquents portent sur le modèle économique (paywall agressif, résiliation pénible), pas sur la science. C'est un espace libre pour Mizan : honnête, local, pas cher.

---

## 2. Ce que dit la science (base de toutes les fiches)

- **L'adhérence compte plus que le type de régime.** Dans les essais comparant plusieurs régimes populaires sur un an, la perte de poids suit l'adhérence déclarée (r ≈ 0,60), pas le type de régime (r ≈ 0,07). Une méta-analyse montre aussi que laisser le choix du régime ne suffit pas : ce qui compte, c'est de tenir.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC10908186 ; https://www.healio.com/news/endocrinology/20211202/adherence-not-diet-type-strong-predictor-for-weightloss-success ; https://www.mdpi.com/2072-6643/10/9/1136
- **L'auto-suivi marche, s'il est régulier.** Revue systématique (Obesity, 2021) : 74 % des associations entre fréquence d'auto-suivi numérique et perte de poids sont positives. Une étude montre que noter plusieurs fois par jour et au moins 3 jours par semaine fait la différence.
  https://onlinelibrary.wiley.com/doi/10.1002/oby.23088 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC6647027/
- **Photo d'assiette : pas encore fiable.** Étude NIH 2026 (résumé de congrès, non encore relu par les pairs) sur 102 repas pesés : MyFitnessPal, Lose It!, Cal AI et une autre appli sous-estiment de 250 à 345 kcal par repas (environ un tiers) et de 30 g de lipides. Les chatbots généralistes se trompent de 30 à 64 %. La portion est le maillon faible.
  https://www.eurekalert.org/news-releases/1136415 ; https://www.mycallie.app/en/blog/ai-calorie-accuracy-research ; https://fitia.app/learn/article/ai-calorie-photo-apps-accuracy-2026/
- **Protéines pour les sportifs :** 1,4 à 2,0 g/kg/jour (position ISSN), 20 à 40 g par repas.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/
- **Pas :** méta-analyse Lancet Public Health 2025 : 7 000 pas/jour contre 2 000 sont associés à 47 % de mortalité en moins ; le bénéfice plafonne vers 5 000 à 7 000 pas.
  https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(25)00164-1/fulltext
- **Ramadan :** méta-analyses chez l'adulte sain : environ −1 kg en moyenne pendant le mois, avec une perte transitoire de masse maigre (−0,66 kg) surtout chez les hommes, souvent reprise ensuite.
  https://www.mdpi.com/2072-6643/11/2/478 ; https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2023.1082217/full
- **IA générative et perte de poids :** premiers essais encourageants (recommandations personnalisées en temps réel, programme de prévention du diabète piloté par IA comparé à un coaching humain), mais les preuves restent minces.
  https://mitsloan.mit.edu/ideas-made-to-matter/generative-ai-shows-effectiveness-in-aiding-weight-loss ; https://medicine-matters.blogs.hopkinsmedicine.org/2025/11/an-ai-powered-lifestyle-intervention-vs-human-coaching-in-the-diabetes-prevention-program-a-randomized-clinical-trial/

## 3. Contexte marocain

- **Surpoids :** enquête nationale Stepwise (ministère de la Santé) : 53 % des adultes ont un IMC ≥ 25, 20 % sont obèses (29 % des femmes contre 11 % des hommes). Le World Obesity Atlas 2025 cité par la presse projette 59 % de surpoids.
  https://www.sante.gov.ma/Documents/2019/05/Rapport%20de%20l%20enqu%C3%AAte%20Stepwise.pdf ; https://lematin.ma/societe/24-des-adultes-souffrent-dobesite-au-maroc-etude/267250
- **Mobile d'abord :** ANRT 2024 : environ 32,5 millions de smartphones, téléphone mobile dans quasiment tous les ménages. Mizan doit être pensé pour le téléphone, Android en tête.
  https://www.anrt.ma/sites/default/files/2025-10/Synth%C3%A8se-Brochure_Fr.pdf
- **Salles de sport :** City Club, leader, communique des tarifs annuels entre environ 1 225 et 3 950 DH selon la formule et la période, sur une cinquantaine de clubs. Le public salle existe, mais les coachs personnels restent chers.
  https://fr.scribd.com/document/784192964/Tarifs-City-Club ; https://leseco.ma/sports/le-formidable-cadeau-de-city-club-a-ses-adherents.html
- **Darija :** des modèles ouverts spécialisés existent (Atlas-Chat 2B, 9B, 27B, état de l'art sur DarijaMMLU ; GemMaroc). La darija s'écrit en arabe et en latin (« arabizi »), sans orthographe fixe.
  https://aclanthology.org/2025.loreslm-1.2/ ; https://arxiv.org/html/2505.17082v1
- **Wearables :** sur Android 14 et plus, Health Connect compte les pas avec le capteur du téléphone, sans montre. Une appli web ne peut pas le lire directement : il faut une appli native ou une coquille (TWA, Capacitor).
  https://sahha.ai/blog/health-connect-without-a-wearable/ ; https://developer.android.com/health-and-fitness/health-connect

---

## 4. Fiches idées

### Fiche 1. Suivi du poids et ajustement adaptatif des calories (façon MacroFactor)
- **Constat :** l'ajustement de la dépense réelle est la fonction la plus louée de MacroFactor ; elle coûte 72 $/an et n'existe pas en dirhams. La science dit que la pesée régulière et l'auto-suivi aident (Obesity 2021). Les formules type Mifflin se trompent souvent de ±10 % sur une personne. Sources : bentobunny, mealift, Wiley Obesity 2021 (URLs plus haut).
- **Pour un Marocain :** le menu 7 jours de Mizan se recale tout seul chaque semaine ; plus besoin de payer une appli en dollars. Version simple : le menu suivi sert d'apport estimé, pas besoin de tout peser.
- **Effort :** M (courbe de poids lissée sur 7 jours, calcul TDEE = apport moyen − variation de poids × 7 700 kcal/kg, garde-fous).
- **Impact :** 5.
- **Risque :** santé : garder le plancher kcal existant, plafonner la baisse (par exemple 1 % du poids par semaine), alerte si perte trop rapide. Grossesse, mineurs, troubles du comportement alimentaire : « avis pro requis » et fonction désactivée. Données : poids = donnée de santé (loi 09-08, CNDP), stockage local par défaut.

### Fiche 2. Mode ramadan (ftour, shour, hydratation, entraînement)
- **Constat :** aucune grande appli occidentale ne traite sérieusement le ramadan. Méta-analyses : environ −1 kg, perte de masse maigre transitoire, souvent reprise après. Sources : MDPI Nutrients 2019, Frontiers 2023.
- **Pour un Marocain :** tout le pays change de rythme un mois par an : menu ftour (harira, dattes, œufs, msemen avec mesure), shour riche en protéines et fibres, rappel d'eau entre ftour et shour, séances placées après le ftour, budget du mois (les prix grimpent : lien avec les prix réels). Fort potentiel d'acquisition (pic d'intérêt chaque année).
- **Effort :** M (répartition des calories sur 2 ou 3 prises, tag recettes ftour et shour, horaires par ville).
- **Impact :** 5.
- **Risque :** diabète, grossesse, maladies chroniques : « avis pro requis », message clair sur les dispenses. Aucune promesse de perte de poids.

### Fiche 3. Coach entraînement généré, lié aux calories (façon Fitbod, mais local)
- **Constat :** Fitbod (80 à 190 $/an) génère des séances selon le matériel et gère la surcharge progressive ; critiqué comme « générateur sans coach ». ISSN : 1,4 à 2 g/kg de protéines pour les sportifs. OMS : activité d'endurance + renforcement musculaire. Sources : agent-finder, sensai, ISSN.
- **Pour un Marocain :** trois profils : City Club ou salle de quartier, maison sans matériel (chambre d'étudiant), extérieur. Les protéines du menu suivent l'entraînement, et les calories des jours de séance aussi. Un coach personnel coûte cher ; ici c'est inclus.
- **Effort :** L (bibliothèque d'exercices, modèles de programmes, journal des charges, progression).
- **Impact :** 4.
- **Risque :** blessures : programmes prudents, échauffement, vidéos ou schémas, « avis pro requis » pour douleurs, grossesse, mineurs, maladies cardiaques.

### Fiche 4. Saisie rapide « j'ai mangé le menu » + mini-journal
- **Constat :** l'adhérence prédit la perte de poids bien mieux que le régime (r 0,60 contre 0,07) ; l'auto-suivi fréquent aide. Les applis échouent quand saisir devient pénible. Sources : PMC10908186, PMC6647027.
- **Pour un Marocain :** un bouton « fait / pas fait / remplacé » par repas, et un « je suis invité chez la famille » (couscous du vendredi, fêtes) qui estime large au lieu de culpabiliser. Donne en même temps l'apport pour la fiche 1.
- **Effort :** S.
- **Impact :** 4.
- **Risque :** faible. Ton neutre, jamais culpabilisant (leçon de Noom).

### Fiche 5. Coach conversationnel en français et en darija
- **Constat :** LLM généralistes utiles mais imprécis sur les chiffres ; modèles darija ouverts disponibles (Atlas-Chat). Premiers essais d'IA générative positifs, preuves encore minces. Sources : ACL 2025, arXiv GemMaroc, MIT Sloan, Johns Hopkins.
- **Pour un Marocain :** poser une question comme à un ami (« chno nakol f l3cha b 30 dh ? »), réponses ancrées sur les recettes et les prix Mizan, pas inventées.
- **Effort :** L (RAG sur recettes et prix, garde-fous, coûts d'API via OpenRouter, évaluation darija).
- **Impact :** 4.
- **Risque :** élevé : hallucinations santé, conseils sur pathologies (« avis pro requis », refus automatique), coût par message, données de conversation sensibles. Revue obligatoire du Coach expert.

### Fiche 6. Interface et conseils en darija (sans chatbot)
- **Constat :** aucun concurrent ne parle darija ; la langue de tous les jours au Maroc, écrite en arabe ou en latin. Source : Atlas-Chat.
- **Pour un Marocain :** noms locaux des aliments (khobz, l3dess, loubia), conseils courts, audience plus large que le français.
- **Effort :** M (traductions relues par des natifs, pas de traduction automatique brute).
- **Impact :** 3.
- **Risque :** faible ; qualité de traduction, choix arabe ou latin.

### Fiche 7. Pas et activité via Health Connect / Apple Santé
- **Constat :** 7 000 pas/jour = gros bénéfice santé (Lancet 2025). Health Connect compte les pas sans montre sur Android 14+. MyFitnessPal a des bugs de synchronisation. Sources : Lancet, sahha, Android Developers.
- **Pour un Marocain :** objectif de pas simple et gratuit, sans acheter de montre ; ajuste les calories d'activité.
- **Effort :** L (Mizan est une appli web : il faut une coquille native, publication Play Store).
- **Impact :** 3.
- **Risque :** données de santé (CNDP), permissions.

### Fiche 8. Photo d'assiette vers calories
- **Constat :** techno à la mode mais imprécise : environ un tiers de sous-estimation, portion mal évaluée (étude NIH 2026). Les meilleurs résultats combinent photo + correction manuelle + base vérifiée. Sources : EurekAlert, Callie, Fitia.
- **Pour un Marocain :** utile pour les tajines et plats partagés, mais justement les plus durs à estimer (plat commun, huile cachée).
- **Effort :** L (API vision, base de plats marocains, écran de correction).
- **Impact :** 2 aujourd'hui (risque de fausser la fiche 1).
- **Risque :** chiffres faux présentés comme précis ; photos = données personnelles. À reconsidérer en 2027, en mode « estimation + confirmation ».

### Fiche 9. Alertes panier et promo (déjà sur la table)
- **Constat :** Planivore relie budget et supermarché, mais sans vrais prix marocains ; Mizan les a déjà (Carrefour, Marjane, souk).
- **Pour un Marocain :** « ton panier de la semaine coûte X % de moins chez Marjane », très parlant pour les étudiants et les familles.
- **Effort :** S à M (dépend de la fraîcheur des prix de l'équipe Prix).
- **Impact :** 3 (fidélisation, mais ce n'est pas du coaching).
- **Risque :** prix périmé ou faux : afficher la date du relevé.

### Fiche 10. Modèle économique honnête (contre-pied des concurrents)
- **Constat :** les reproches majeurs visent paywall caché, essai trop court, résiliation pénible (Cal AI, Noom, Yazio). Sources : unstar, nutriscan.
- **Pour un Marocain :** pouvoir d'achat limité, méfiance envers les abonnements en devises ; un Mizan gratuit pour l'essentiel, prix clair en dirhams, sans piège, est un argument en soi.
- **Effort :** S (décision produit, page de prix).
- **Impact :** 3.
- **Risque :** viabilité financière à étudier par le CTO.

---

## 5. Top 5, classé par impact ÷ effort

Barème : S = 1, M = 2, L = 3, XL = 4.

| Rang | Idée | Impact | Effort | Score | Ce que Mizan a déjà | Ce qu'il faut ajouter |
|---|---|---|---|---|---|---|
| 1 | **Saisie rapide « j'ai mangé le menu »** (fiche 4) | 4 | S | 4,0 | Menus 7 jours, 194 recettes avec macros, 8 régimes | Boutons fait / remplacé / repas de famille, historique local |
| 2 | **Suivi du poids et calories adaptatives** (fiche 1) | 5 | M | 2,5 | Calcul Mifflin × activité, plancher kcal, menus calibrés en calories | Saisie du poids, tendance lissée, recalcul hebdomadaire du TDEE, garde-fous |
| 3 | **Mode ramadan** (fiche 2) | 5 | M | 2,5 | Recettes marocaines, prix réels (budget du mois), mode étudiant | Répartition ftour / shour, tags recettes, hydratation, horaires par ville |
| 4 | **Coach entraînement lié aux calories** (fiche 3) | 4 | L | 1,3 | Niveaux d'activité, cibles protéines par régime | Bibliothèque d'exercices, programmes salle / maison, progression, lien jours de séance → calories |
| 5 | **Coach conversationnel FR / darija** (fiche 5) | 4 | L | 1,3 | Recettes, prix Carrefour / Marjane / souk comme base de réponses fiables | RAG, garde-fous santé, coût API, évaluation darija |

Remarques :
- Les fiches 1 et 4 se combinent : la saisie rapide fournit l'apport, la pesée fournit la tendance, et l'algorithme adapte le menu. C'est le cœur d'un vrai « coach », et personne ne le fait avec des prix en dirhams.
- Le mode ramadan est une fenêtre calendaire : le prochain ramadan devrait commencer vers le 8 février 2027 (date à confirmer selon l'observation du croissant), il faut un prototype début janvier.
- La photo d'assiette est volontairement hors du top 5 : techno pas assez fiable en 2026.
- Tout ce qui touche au poids, au jeûne et à l'entraînement passe par `innov-coach-expert` avant prototype.
