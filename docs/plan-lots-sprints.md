# Mizan.ma : plan des lots et des sprints

> « Mizan » (ميزان) = la balance : ton budget **et** ton poids. Nom de travail, modifiable dans `web/src/lib/config.ts`.

**Objectif** : la référence au Maroc pour **manger selon son budget, son régime et son corps**. L'utilisateur entre poids, taille, âge, activité et objectif (perdre, maintenir, prendre). Il reçoit ses besoins (calories, macros), un menu de la semaine adapté à son régime et une liste de courses au **vrai prix** des supermarchés marocains.

**Face à Planivore** : eux font du budget seulement, avec des prix moyens estimés et des recettes générales. Nous ajoutons la nutrition personnalisée, 8 régimes, les prix réels et l'achat en un clic.

- **Stack** : Next.js + Tailwind (fait), Supabase (base, auth), scrapers Node/Playwright en tâche planifiée, déploiement Vercel.
- **Sprints** de 2 semaines.

---

## Les lots

| Lot | Contenu |
|---|---|
| **L0 – Fondations** | Landing page, design, domaine, analytics, pages légales, liste d'attente |
| **L1 – Données de prix** | Scrapers Bringo (Carrefour), Glovo (Marjane), etc. ; prix/kg ; historique des prix |
| **L2 – Nutrition** | Valeurs nutritionnelles de chaque produit, calcul des besoins (Mifflin-St Jeor + activité + objectif), macros par régime, garde-fous santé |
| **L3 – Recettes** | Base de recettes marocaines et internationales pour tous les régimes : petit-déj, plats, collations ; coût et macros calculés automatiquement |
| **L4 – Moteur de menus** | Menu de la semaine : calories, protéines et budget visés, portions ajustées, variété, allergies |
| **L5 – Comptes et suivi** | Profil sauvegardé, suivi du poids, recalcul automatique quand le poids change, partage avec le foyer |
| **L6 – Liste de courses et achat** | Liste par rayon arrondie aux paquets, comparaison du panier entre enseignes, bouton « commander » |
| **L7 – Monétisation** | Freemium + premium, partenariats (boucheries, primeurs, salles de sport, marques), affiliation |
| **L8 – Croissance** | Darija et arabe, appli installable, ambassadeurs, alertes WhatsApp, pages pour Google |

---

## Les sprints

### Sprint 0 : Fondations + prototype ✅ en grande partie fait
- [x] Analyse du concurrent Planivore
- [x] Tests de scraping : Bringo (7 rayons) et Glovo/Marjane
- [x] Landing page avec la même structure de sections que Planivore
- [x] **Calculateur en direct** : IMC, métabolisme de base, dépense, calories visées, macros
- [x] **8 régimes** : équilibré, méditerranéen, riche en protéines, végétarien, végan, pauvre en glucides, cétogène, carnivore, avec les options sans gluten et sans lactose
- [x] **Moteur de menu** sur 7 jours (portions ajustées, collations si besoin, variété) et **liste de courses** arrondie aux paquets, au prix réel
- [x] 36 recettes et 32 produits au prix réel
- [ ] Choisir le nom et le domaine, déployer sur Vercel
- [ ] Liste d'attente branchée sur Supabase
- [ ] Analytics

### Sprint 1 : Données de prix automatisées (L1)
- Schéma Supabase : `stores`, `products`, `prices` (daté), `categories`, `nutrition`
- Scraper quotidien Bringo sur tous les rayons alimentaires (3 magasins)
- Normalisation des prix au kg, filtre des ruptures (prix à 0), alertes en cas d'échec
- Le site lit les prix depuis la base

**Fin de sprint** : plus de 1 000 produits à jour chaque jour.

### Sprint 2 : Nutrition des produits + Marjane (L1, L2)
- Rattacher chaque produit à une fiche nutritionnelle (table de référence CIQUAL ou Open Food Facts quand le code-barres existe)
- Scraper Marjane (Glovo) par ville, et faire correspondre les produits entre enseignes
- Page publique « Prix des courses au Maroc cette semaine », pour Google

### Sprint 3 : Recettes à grande échelle (L3)
- Éditeur de recettes (back-office) : ingrédients reliés aux produits, étapes, photos
- 150 recettes : marocaines (tagines, couscous, harira, bissara, zaalouk…), healthy, sportives, végétales, céto
- Pages recettes publiques avec macros et prix

### Sprint 4 : Comptes et suivi (L5)
- Connexion par e-mail sans mot de passe + Google
- Profil sauvegardé, **suivi du poids** (courbe), recalcul automatique des besoins
- Préférences : aliments exclus, matériel, temps de cuisine

### Sprint 5 : Moteur v2 + bêta privée (L4, L6)
- Remplacer un plat en un clic, verrouiller un plat, cuisiner en double pour les restes
- Menus différents par membre du foyer (objectifs différents), avec une liste commune
- Bouton « Commander sur Bringo / Glovo »
- **Bêta privée** ouverte aux inscrits de la liste d'attente, retours dans l'app

### Sprint 6 : Monétisation (L7)
- Gratuit : calculateur + 1 menu par semaine. Premium (29 / 39 / 49 MAD par mois, à tester) : menus illimités, suivi du poids, foyer, alertes
- Paiement CMI ou Stripe, ou Paddle/WHOP
- Partenaires : boucheries, primeurs, salles de sport (code promo traçable, commission)

### Sprint 7 : Comparateur de panier + alertes (L6)
- « Ta liste coûte X chez Carrefour et Y chez Marjane »
- Alertes promo sur tes produits habituels
- Indicateurs « protéines par dirham » et « calories par dirham »

### Sprint 8 : Croissance (L8)
- Interface en darija et en arabe
- Appli installable avec notifications, rappels WhatsApp
- Programme ambassadeurs (coachs, influenceurs fitness et nutrition)
- Catalogues BIM et Aswak (lecture des catalogues PDF)

**Lancement public** vers la semaine 17.

---

## Indicateurs
| Étape | Indicateur | Cible |
|---|---|---|
| Sprint 0-2 | Inscrits sur la liste d'attente | 1 000 |
| Sprint 2+ | Calculs lancés par semaine | 2 000 |
| Sprint 5 | Utilisateurs actifs de la bêta | 300 / semaine |
| Sprint 6+ | Conversion gratuit → payant | 3 à 5 % |
| Sprint 6+ | Clics vers l'achat / partenaires | 20 % des listes |

## Risques
- **Santé** : afficher « pas un avis médical », ne jamais descendre sous 1 200 kcal (femme) ou 1 500 kcal (homme), pas de perte de poids proposée si l'IMC est bas, avertissement pour les mineurs. À terme, faire valider le moteur par un diététicien (c'est aussi un argument marketing).
- **Données de prix** : sites qui changent de structure → surveillance quotidienne ; ne garder que nom, poids et prix ; viser des partenariats.
- **Valeurs nutritionnelles** : aujourd'hui des moyennes de référence ; passer à des données par produit (Open Food Facts) au Sprint 2.
- **Faible volonté de payer** : calculateur gratuit pour l'acquisition, revenus des partenaires en complément du premium.
