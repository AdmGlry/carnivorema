# Mise en ligne de Mizan.ma

_Mise en ligne le 29/10/2026_

## Site (Vercel)

- **Adresse publique** : https://mizan-road-to-users.vercel.app
- Projet Vercel `mizan`, équipe « road to users ». Le site est construit depuis le dossier `web/`.
- Région des fonctions : Paris (`cdg1`), au plus près du Maroc et de la base Supabase.
- **Déploiement automatique** : chaque push sur `claude/clever-planck-5vwifp` (la branche par défaut du dépôt) met la production à jour.
- Protection Vercel limitée aux prévisualisations : la production est publique.
- Variables d'environnement :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`, qui vaut l'adresse Vercel pour l'instant. Elle passera à `https://mizan.ma` quand le domaine sera branché.

## Base de données (Supabase)

- Projet `mizan` (`ucufrbbxyuxpbsxkboxr`), région Paris (`eu-west-3`) : https://ucufrbbxyuxpbsxkboxr.supabase.co
- Migration `supabase/migrations/20261028120000_schema_initial.sql` appliquée, ainsi que le seed : 3 magasins et 10 rayons.
- Règles d'accès vérifiées en SQL avec le rôle anonyme :
  - inscription sur la liste d'attente : autorisée ;
  - lecture de la liste d'attente : refusée ;
  - écriture de prix : refusée ;
  - lecture des prix et des magasins : autorisée.
- Seule alerte de sécurité Supabase : l'extension `citext` était dans le schéma public. Elle est corrigée (déplacée dans `extensions`).

## Relevé des prix (GitHub Actions)

- `.github/workflows/scrape-prices.yml` tourne tous les jours à 05:17 UTC, et peut aussi être lancé à la main.
- **Premier vrai relevé le 29/10/2026 : 2 434 produits sur 36 pages** de Carrefour Hypermarket, en 1 min 17. Les fichiers JSON et CSV sont gardés 30 jours comme artefact du workflow.

## Ce qui reste à faire (action manuelle)

1. **Écriture des prix en base.** Ajouter 2 secrets dans GitHub : *Settings → Secrets and variables → Actions → New repository secret*.
   - `SUPABASE_URL` = `https://ucufrbbxyuxpbsxkboxr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = la clé « service_role » de Supabase (*Project Settings → API Keys*). Cette clé ne doit jamais aller dans Vercel ni dans le code.
2. **Domaine `mizan.ma`.** L'acheter chez un registraire marocain, l'ajouter au projet Vercel (*Settings → Domains*), puis mettre `NEXT_PUBLIC_SITE_URL` à jour.
3. **Avant d'ouvrir les inscriptions au public** : rédiger les pages légales (mentions, CGU, confidentialité) et faire la déclaration à la CNDP pour la liste d'attente. Voir `docs/business/juridique.md`.
