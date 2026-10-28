# Carnivore.ma : plan des lots et des sprints

Objectif : le planificateur de repas carnivores de référence au Maroc, avec les **vrais prix** des supermarchés, une liste de courses, l'achat en un clic et des revenus issus des partenariats et de l'affiliation.

- **Stack** : Next.js (App Router) + Tailwind, Supabase (base, auth, stockage), scrapers Node/Playwright exécutés en tâche planifiée (GitHub Actions ou Supabase cron), déploiement Vercel.
- **Sprints** de 2 semaines. Équipe de référence : 1 à 2 développeurs + toi (produit, contenu, partenariats).

---

## Les lots

| Lot | Contenu | Pourquoi |
|---|---|---|
| **L0 – Fondations** | Repo, landing page, design, domaine, analytics, mentions légales | Être en ligne et capter des inscrits dès le début |
| **L1 – Données de prix** | Scrapers Bringo (Carrefour), Glovo (Marjane), normalisation au prix/kg, historique des prix | Notre avantage n°1 face à Planivore, qui n'utilise que des moyennes estimées |
| **L2 – Recettes** | Base de recettes carnivores marocaines, ingrédients reliés aux produits, coût par personne calculé automatiquement | Le contenu qui fait revenir les gens |
| **L3 – Comptes et profil** | Inscription, profil foyer (personnes, objectif, ville, enseigne, budget en MAD) | Personnalisation |
| **L4 – Menu et liste de courses** | Génération du menu dans le budget, remplacement de plats, liste triée par rayon, partage avec le foyer | Le cœur du produit (parité avec Planivore) |
| **L5 – Comparateur et alertes** | Comparaison du même panier entre enseignes, alertes promo viande, page publique « Prix de la viande au Maroc » | Différenciation + acquisition par Google |
| **L6 – Monétisation** | Freemium + abonnement (CMI / Stripe / WHOP), liens d'achat Bringo/Glovo, boucheries partenaires, codes promo | Revenus |
| **L7 – Croissance** | Darija / arabe, application installable sur mobile (PWA), programme ambassadeurs (influenceurs fitness), notifications WhatsApp | Passage à l'échelle |

---

## Les sprints

### Sprint 0 (semaine 1) : Fondations ✅ en grande partie fait
- [x] Analyse du concurrent Planivore
- [x] Test de scraping Bringo et Glovo/Marjane
- [x] Landing page Next.js avec la même structure de sections (hero, mécanisme, étapes, résultats, prix, recettes, aperçu de l'app, bêta, FAQ, footer)
- [ ] Choisir et acheter le domaine (carnivore.ma ?) et déployer sur Vercel
- [ ] **Liste d'attente branchée sur Supabase** (le bouton de la bêta ne fait encore rien)
- [ ] Analytics (Vercel Analytics ou Plausible)

**Fin de sprint** : site en ligne qui collecte des e-mails.

### Sprint 1 (semaines 2-3) : Données de prix (L1)
- Schéma Supabase : `stores`, `products`, `prices` (historique daté), `categories`
- Scraper Bringo : 3 magasins × Boucherie, Volaille, Poissonnerie, Œufs et crémerie, Charcuterie
- Normalisation : prix/kg, tri des « 500 g » et « au kg », filtre des prix à 0 (ruptures)
- Exécution quotidienne planifiée + alerte en cas d'échec
- La landing page lit les prix depuis la base au lieu du fichier statique

**Fin de sprint** : plus de 300 produits mis à jour chaque jour.

### Sprint 2 (semaines 4-5) : Marjane + page « Prix de la viande » (L1, L5)
- Découverte des pages Glovo/Marjane par ville, puis scraper
- Correspondance des produits entre enseignes (« entrecôte de bœuf » = même produit)
- Page publique `/prix-viande-maroc`, optimisée pour Google, mise à jour chaque jour, avec un graphique d'évolution des prix
- Publications Instagram/TikTok générées à partir de ces données (« la viande la moins chère cette semaine »)

**Fin de sprint** : 2 enseignes comparées, première source de trafic gratuit.

### Sprint 3 (semaines 6-7) : Recettes (L2)
- Modèle de données des recettes (ingrédients reliés aux produits, quantités, étapes, temps, tags)
- Les 60 premières recettes carnivores marocaines : kefta, tagines, mechoui, abats, poulet, poisson, œufs
- Coût par personne recalculé automatiquement avec les prix du jour
- Pages recettes publiques, pour le référencement

**Fin de sprint** : catalogue de recettes chiffrées en ligne.

### Sprint 4 (semaines 8-9) : Comptes et menu (L3, L4)
- Connexion (e-mail sans mot de passe + Google)
- Questionnaire du profil foyer en 2 minutes
- Générateur de menu de la semaine dans le budget, avec remplacement d'un plat en un clic

**Fin de sprint** : un utilisateur reçoit son menu personnalisé et chiffré.

### Sprint 5 (semaines 10-11) : Liste de courses + bêta privée (L4)
- Liste fusionnée et triée par rayon, cases à cocher, partage avec 4 proches
- Bouton « Commander sur Bringo / Glovo » (lien direct, suivi des clics)
- **Ouverture de la bêta privée** aux inscrits de la liste d'attente
- Collecte de retours dans l'app

**Fin de sprint** : bêta avec 100 à 300 utilisateurs réels, et de vrais témoignages à mettre sur la landing page.

### Sprint 6 (semaines 12-13) : Monétisation (L6)
- Offre gratuite limitée + abonnement mensuel (prix à tester : 29 / 39 / 49 MAD) + accès à vie en lancement
- Paiement : CMI ou Stripe (selon la faisabilité), Paddle/WHOP en alternative
- Premières boucheries partenaires (Casablanca) : fiche partenaire, code promo traçable, commission

**Fin de sprint** : premiers dirhams encaissés.

### Sprint 7 (semaines 14-15) : Alertes et comparateur de panier (L5)
- « Ton panier de la semaine coûte X chez Carrefour et Y chez Marjane »
- Alertes promo sur les morceaux favoris (e-mail, puis WhatsApp)
- Indicateur « protéines par dirham » (MAD par 10 g de protéines)

### Sprint 8 (semaines 16-17) : Croissance (L7)
- Interface en darija et en arabe (traduction de la page)
- Application installable (PWA) avec notifications
- Programme ambassadeurs : codes influenceurs, tableau de bord des commissions
- Catalogues BIM et Aswak (lecture des catalogues promo PDF)

**Lancement public** à la fin du sprint 8, vers la semaine 17.

---

## Indicateurs à suivre
| Étape | Indicateur | Cible |
|---|---|---|
| Sprint 0-2 | Inscrits sur la liste d'attente | 500 |
| Sprint 2+ | Visites de la page « Prix de la viande » | 5 000 / mois |
| Sprint 5 | Utilisateurs actifs de la bêta | 150 / semaine |
| Sprint 6+ | Conversion gratuit → payant | 3 à 5 % |
| Sprint 6+ | Clics vers l'achat / partenaires | 20 % des listes générées |

## Risques
- **Changement de structure des sites scrapés** : surveillance quotidienne et tests sur les scrapers.
- **Juridique** : ne garder que nom, poids et prix ; relire les CGU de Bringo et Glovo ; viser des flux officiels via partenariats.
- **Santé** : afficher un avertissement « pas un avis médical ».
- **Faible volonté de payer** : miser sur les revenus partenaires et un abonnement à prix bas.
