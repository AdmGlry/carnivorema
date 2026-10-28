# Analyse du concurrent Planivore + faisabilité du scraping au Maroc

_Relevé du 28/10/2026_

## 1. Planivore.eu, ce qu'ils font

- **Promesse** : « les meilleures recettes pile dans ton budget ». Menus de la semaine chiffrés, liste de courses triée par rayon, comparateur de 12 enseignes françaises (Aldi, Auchan, Carrefour, Leclerc, Franprix, Grand Frais, Intermarché, Lidl, Monoprix, Netto, Picard, Super U).
- **Contenu** : 600 recettes, toutes chiffrées par personne.
- **Calcul des prix** : un **prix moyen par ingrédient et par enseigne**, sans le premium/bio ni le premier prix, basé sur des **moyennes nationales**. Ils le disent eux-mêmes : ce sont des **estimations indicatives**, pas des prix réels en temps réel.
- **Produit** : application web (pas d'app native), partage avec jusqu'à 4 proches.
- **Revenus** (CGV) :
  - Découverte gratuite (très limitée)
  - **9,99 € / 30 jours** (paiement via WHOP)
  - **59,99 € accès à vie** (offre limitée dans le temps)
  - Pack de recettes à 14,99 €
  - Ancien abonnement annuel à 69,99 €, plus proposé
- **Pas d'affiliation ni de pub** : « Pas de drive, pas de pub, juste ta liste ».
- **Traction annoncée** : 1 800+ foyers, note de 4,6/5. Adresse à Paris.

### Leurs faiblesses (nos opportunités)
1. **Les prix sont des moyennes estimées, pas de vrais prix scrapés.** Ils ne montrent ni les promos réelles ni les ruptures de stock.
2. **Aucun lien vers l'achat** : l'utilisateur ne peut pas commander sa liste, et eux ne touchent aucune commission.
3. **Recettes généralistes** (lasagnes, curry de pois chiches…) : pas de niche.
4. **Uniquement la France.** Le Maroc n'est pas couvert du tout.

## 2. Notre version : Carnivore.ma

| | Planivore | Carnivore.ma |
|---|---|---|
| Prix | Moyennes nationales estimées | **Vrais prix scrapés** chaque jour, promos incluses |
| Enseignes | 12 FR | Carrefour/Label'Vie (Bringo), Marjane (via Glovo), plus tard Aswak Assalam, BIM (catalogues) et boucheries partenaires |
| Niche | Grand public | Carnivore / céto / protéiné, **halal**, cuisine marocaine (tagine, kefta, mrouzia, khlii…) |
| Achat | Liste seulement | Bouton « commander » (Bringo/Glovo) et boucheries partenaires, d'où des commissions |
| Revenus | Abonnement seul | Freemium pas cher (~29 à 49 MAD/mois) + partenariats + affiliation + données de prix |
| Langues | FR | FR + darija (+ arabe) |
| Paiement | Carte | Carte + CMI, et plus tard paiement en espèces ou mobile |

Fonctionnalités qui nous différencient :
- **Alerte promo viande** (« l'entrecôte est à -15 % chez Carrefour cette semaine »)
- **Prix au kg réel** et protéines par dirham (MAD par gramme de protéine)
- Plan carnivore selon le budget (« 1 500 MAD / mois, 2 personnes »)
- Gros achats pour l'Aïd et pour le batch-cooking

## 3. Tests de scraping réalisés

| Source | Résultat |
|---|---|
| **Bringo (Carrefour / Label'Vie)** – `bringo.ma` | ✅ **Fonctionne.** Pages rendues côté serveur, catégories (Boucherie, Volaille, Poissonnerie…), `?limit=100` et tri par prix. Plus de 50 produits de boucherie récupérés avec leur prix en MAD et leurs promos. Voir `data/bringo-carrefour-boucherie-2026-10-28.csv`. Trois magasins : Hyper, Market, Gourmet. |
| **Marjane Market (via Glovo)** | ✅ **Fonctionne** sur certaines pages (exemple : Bouskoura, fruits secs, prix en MAD récupérés). Les URL de catégorie changent et certaines renvoient « page doesn't exist » : il faut d'abord découvrir les URL (sitemap ou carte du site). Attention, les prix Glovo peuvent être majorés par rapport au magasin. |
| **Marjane Mall** (`marjanemall.ma`) | ⚠️ Surtout une place de marché non alimentaire : peu utile pour la viande. |
| BIM, Aswak Assalam | ❌ Pas de catalogue en ligne : il faudra passer par les catalogues promo (reconnaissance de texte) ou par des partenariats. |

Points d'attention constatés :
- Certains produits affichent **0 MAD** quand ils sont en rupture ou à prix variable : il faut les filtrer.
- Les libellés mélangent « au kg » et « 500g » : il faut **normaliser le prix au kg**.
- Côté juridique, on ne garde que nom, poids et prix, à fréquence modérée, sans copier les photos ni les descriptions. Il faut aussi relire les CGU de Bringo et Glovo. À terme, mieux vaut un partenariat ou un flux officiel.

## 4. Prochaines étapes proposées
1. Script de scraping quotidien Bringo (3 magasins × Boucherie, Volaille, Poissonnerie, Œufs/Crémerie), stocké en base (Supabase).
2. Découverte des URL Glovo/Marjane par ville, puis scraping des mêmes catégories.
3. Normalisation : prix au kg, catégorie (bœuf, agneau, volaille, abats, poisson, œufs, graisses).
4. Page publique « Prix de la viande au Maroc cette semaine » pour le référencement et l'acquisition.
5. Générateur de menus carnivores marocains chiffrés avec les vrais prix.
