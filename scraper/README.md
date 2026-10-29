# Scraper de prix (Bringo / Carrefour Maroc)

Relève chaque jour les prix des rayons alimentaires de Carrefour Hypermarket sur bringo.ma. Chaque produit est enregistré avec son conditionnement (poids, volume ou nombre d'unités) et son prix au kg ou au litre.

## Utilisation

```bash
cd scraper
npm install
npm test          # tests sur les pages HTML de référence (fixtures/)
npm run scrape    # relevé réel : écrit out/prices-AAAA-MM-JJ.json et .csv
```

Si les variables `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont définies, les lignes sont aussi insérées dans la table `prices` (voir `supabase/migrations/` et `docs/supabase.md`). Sans elles, seuls les fichiers locaux sont écrits.

## Fonctionnement

| Fichier | Rôle |
|---|---|
| `src/config.ts` | Magasins et rayons suivis, délai entre requêtes, User-Agent |
| `src/fetch.ts` | Téléchargement poli : 1 requête toutes les 1,5 s, 3 nouvelles tentatives avec backoff |
| `src/parse.ts` | Lecture d'une page catégorie (`.box-product`, `.bringo-product-name`, `.bringo-product-price`…) |
| `src/normalize.ts` | Conditionnement depuis le libellé (500g, 1Kg, 3x20cl, 30 unités…) et prix au kg / au litre |
| `src/collect.ts` | Parcours des pages (`?limit=100&page=N`) jusqu'à ce qu'une page n'apporte plus de produit nouveau |
| `src/output.ts` | Sorties JSON / CSV et insertion Supabase par lots de 500 |
| `src/main.ts` | Point d'entrée ; code de sortie 1 si rien n'est relevé ou si plus d'un quart des rayons échoue |

Règles appliquées :
- Les produits en rupture (prix à 0 sans prix indicatif) sont écartés.
- Un prix indicatif (« ~ 9,95 MAD / pièce ») est gardé, sans prix au kg.
- Les légumineuses du rayon « Pâtes, riz & féculents » sont reclassées en `legumineuse`.

## Tâche planifiée

`.github/workflows/scrape-prices.yml` lance le relevé tous les jours à 05:17 UTC, ou à la main (« Run workflow »). Les fichiers du jour sont conservés 30 jours comme artefact. Pour écrire en base, ajouter dans les secrets du dépôt GitHub : `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.

## Bonnes pratiques et limites

- On ne garde que le nom, le conditionnement, le prix et l'URL : pas de photos ni de descriptions. La fréquence reste modérée : un passage par jour, avec un délai entre les requêtes.
- Seul Carrefour Hypermarket est configuré. Les slugs des rayons de Carrefour Market et Gourmet ont un suffixe différent : il faut les vérifier avant de les ajouter dans `config.ts`.
- Le réseau de développement de Claude ne peut pas joindre bringo.ma : le relevé réel n'a pas été lancé depuis ici. Il tournera dans GitHub Actions. Les tests reposent sur de vraies pages enregistrées dans `fixtures/`.
- Si Bringo change sa structure HTML, les tests sur les fixtures resteront verts mais le relevé tombera à 0 produit : le workflow échoue alors (code 1), ce qui sert d'alerte.
