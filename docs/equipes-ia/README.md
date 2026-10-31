# Les équipes IA de Mizan.ma

> Mizan n'est pas un simple planificateur de repas : c'est un **coach sportif et nutritionniste** pour le Maroc, alimenté par la meilleure donnée disponible sur internet (prix réels, science, recettes).
> Deux équipes d'agents travaillent pour lui. Adam est le CTO : il pilote et valide, environ 10 h par semaine.

## START HERE FIRST

1. **Lis ce fichier** (10 min), puis les 6 fiches agents dans `.claude/agents/`.
2. **Ajoute les secrets GitHub**, dans *Settings → Secrets and variables → Actions* (5 min) :
   - `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` : sans eux, les 2 434 prix Carrefour relevés chaque jour ne vont pas en base ;
   - `OPENROUTER_API_KEY` : lecture des prospectus BIM.
3. **Lance la première boucle Prix** dans une session Claude Code : « Équipe Prix : complète Marjane. » Le chef d'orchestre (Claude) enchaîne Collecteur, puis Vérificateur, puis Éditeur, et te montre le bulletin.
4. **Lance la première veille** : « Éclaireur : veille coach sportif et nutrition IA, top 5 pour le Maroc. »
5. **Choisis une idée** dans le top 5. L'Architecte la prototype sur une branche `proto/…`, avec un lien de prévisualisation Vercel.
6. **Ton rituel hebdomadaire de 10 h** : voir « Pilotage » plus bas.

---

## 1. Les équipes

### Équipe Prix (en priorité) : « le bon prix, partout, toujours à jour »

| Agent | Rôle | Reçoit | Produit | Passe la main à |
|---|---|---|---|---|
| `prix-collecteur` | Relève les prix réels Carrefour, Marjane, BIM et souk | Une enseigne ou une liste d'aliments | `data/<enseigne>/selection.csv` et des commits | Vérificateur |
| `prix-verificateur` | Contrôle le produit, le grammage, le prix au kilo et les écarts | Le diff de `data/` | VALIDÉ ou BLOQUÉ dans `data/prix/journal.md` | Éditeur (si VALIDÉ) ou Collecteur (si BLOQUÉ) |
| `prix-editeur` | Met en ligne, met à jour les dates et rédige le bulletin hebdomadaire | Un relevé VALIDÉ | Build, push et `data/prix/bulletin-*.md` | Le CTO (pour une diffusion éventuelle) |

### Équipe Innovation : « inventer le coach de demain »

| Agent | Rôle | Reçoit | Produit | Passe la main à |
|---|---|---|---|---|
| `innov-eclaireur` | Veille : science, concurrents, technos, tendances au Maroc | Un thème | Top 5 d'opportunités sourcées dans `docs/equipes-ia/veille/` | Le CTO choisit une idée |
| `innov-coach-expert` | Nutritionniste et préparateur physique : le garde-fou scientifique | Un calcul, un texte, une recette ou un programme | OK, OK avec corrections, ou REFUS, avec ses sources | Architecte |
| `innov-architecte` | Spécification puis prototype testé sur une branche | Une idée choisie | `specs/<idee>.md`, branche `proto/<idee>` et prévisualisation | Le CTO décide de la mise en production |

Pourquoi un coach expert dans l'équipe Innovation : sur la santé, une erreur coûte la confiance des utilisateurs. Tout ce qui touche au corps passe par lui.

## 2. Le circuit de travail

```
ÉQUIPE PRIX (chaque lundi + à la demande)
  Collecteur ──► Vérificateur ──VALIDÉ──► Éditeur ──► site en ligne + bulletin ──► CTO
                     │
                     └─BLOQUÉ──► Collecteur (avec la liste des lignes à refaire)

ÉQUIPE INNOVATION (sprints d'une semaine)
  Éclaireur ──► top 5 ──► CTO choisit ──► Architecte (spécification)
                                              │
                                   santé ? ──► Coach expert (revue) ──► Architecte (prototype)
                                                                            │
                                              CTO teste la prévisualisation ◄┘ ──► mise en production ou abandon
```

Le chef d'orchestre est la session Claude Code principale. Elle lance les agents (avec l'outil Agent et `subagent_type: "<nom>"`), fait circuler leurs livrables et te résume le tout.

## 3. Outils, version 1 (budget de test : 10 $ par semaine)

| Outil | Pourquoi | Coût |
|---|---|---|
| Claude Code (cette session et ses agents) | Cerveau et exécution | Ton abonnement |
| Context_dev (navigation web) | Relevés Marjane, veille | Crédits existants |
| GitHub, dépôt et Actions | Code, relevé Carrefour quotidien, journal | Gratuit |
| Supabase | Base de données (prix, signalements, liste d'attente) | Gratuit |
| Vercel | Site, avec une prévisualisation pour chaque prototype | Gratuit |
| OpenRouter | Lecture des prospectus BIM et des articles de prix de gros | Environ 1 à 3 $ par semaine |
| `docs/` et `data/` dans le dépôt | Base de connaissances et journal | Gratuit |

À n'ajouter qu'en cas de vrai besoin : un service de navigation par API, pour automatiser Marjane depuis GitHub (environ 5 à 10 $ par mois), et un outil de suivi des tâches (les issues GitHub suffisent au début).

## 4. Contrôle qualité

| Point de contrôle | Qui | Ce qu'on vérifie |
|---|---|---|
| Après chaque relevé | Vérificateur | Produit, grammage, prix au kilo, 3 liens ouverts, tests verts |
| Avant chaque push | Éditeur et Architecte | `tsc`, `vitest`, `build` : tout doit passer, sinon pas de push |
| Tout contenu santé | Coach expert | Sources officielles, règles de sécurité, aucune promesse chiffrée |
| Chaque semaine | CTO | Le bulletin, un prototype testé sur téléphone, 5 prix vérifiés au hasard en magasin ou en ligne |

**Pannes connues :** page Marjane vide (réessayer), mauvais grammage (« environ 1,25 kg »), produit mariné à la place du brut, promotion expirée, redémarrage du conteneur (d'où les commits fréquents).

**Indicateurs suivis chaque semaine :**
- prix : couverture (aliments avec prix réel ÷ 62) par enseigne, objectif 100 % Carrefour et 90 % Marjane ;
- prix : âge moyen des prix, objectif moins de 7 jours ;
- prix : erreurs trouvées par le Vérificateur, objectif en baisse ;
- innovation : un prototype testable par semaine ;
- innovation : idées passées en production par mois.

## 5. Règles

- **Libre, sans demander :** relever, vérifier, coder sur une branche, pousser sur la branche de développement si les tests sont verts.
- **Accord du CTO obligatoire pour :**
  - publier sur les réseaux sociaux ou envoyer un message à une enseigne ou à un partenaire ;
  - toute dépense au-delà du budget de test ;
  - supprimer des données ;
  - modifier la base Supabase de production (migrations) ;
  - fusionner un prototype en production.
- Jamais de secret ni de mot de passe dans le chat ou dans le code : les secrets vont dans GitHub ou Vercel.
- Jamais de prix inventé, jamais de conseil santé sans source.

## 6. Pilotage : ton rituel de 10 h par semaine

| Quand | Durée | Quoi |
|---|---|---|
| Lundi | 1 h 30 | Lire le bulletin Prix, vérifier 5 prix au hasard, valider la diffusion |
| Mardi | 2 h | Revue de la veille et choix de l'idée de la semaine |
| Mercredi et jeudi | 4 h | Tester le prototype sur ton téléphone, faire tes retours, laisser l'Architecte itérer |
| Vendredi | 1 h 30 | Mise en production ou abandon, priorités de la semaine suivante |
| Au fil de l'eau | 1 h | Questions des agents, validations |

## 7. Plan de lancement sur 7 jours

| Jour | Équipe Prix | Équipe Innovation | Toi |
|---|---|---|---|
| J1 | Collecteur : compléter Marjane, de 33 à au moins 55 aliments sur 62 | Éclaireur : veille « coach IA, nutrition et sport, Maroc » | Ajouter les 3 secrets GitHub |
| J2 | Vérificateur puis Éditeur : premier bulletin | Coach expert : audit des calculs actuels (calories, macros, sécurité) | Lire le bulletin et le top 5 |
| J3 | BIM : lecture du prospectus par IA (avec la clé OpenRouter) | Architecte : spécification de l'idée choisie | Choisir l'idée |
| J4 | Souk : prix de gros automatiques depuis Médias24 | Architecte : prototype | Tester sur ton téléphone |
| J5 | Total de la liste de courses par enseigne (« où acheter ton panier ») | Coach expert : revue du prototype | Retours |
| J6 | Relevé du lundi programmé (tâche hebdomadaire) | Architecte : itération et tests | Décider mise en production ou abandon |
| J7 | Bilan des indicateurs | Bilan, puis veille suivante | Rétrospective de 30 min |

## Idées déjà sur la table pour l'équipe Innovation

- **Coach entraînement :** programmes salle ou maison adaptés à l'objectif, liés aux calories.
- **Photo d'assiette → calories,** par la vision IA.
- **Mode ramadan :** ftour et shour, hydratation.
- **Suivi du poids et des progrès,** avec ajustement automatique des calories.
- **Darija :** interface et conseils.
- **Alertes promo :** « ton panier coûte 12 % de moins chez Marjane cette semaine ».
