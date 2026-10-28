# Supabase : base de données

La base stocke les enseignes, les rayons, les produits, les relevés de prix, les valeurs nutritionnelles et la liste d'attente de la bêta.

## Contenu
- `supabase/migrations/20261028120000_schema_initial.sql` : le schéma complet
  - `stores`, `categories`, `products`, `nutrition_facts` (pour 100 g)
  - `prices` : un relevé par produit, enseigne et date (historique conservé)
  - vue `latest_prices` : le dernier prix connu de chaque produit (ruptures à 0 MAD exclues)
  - `waitlist` : e-mails de la liste d'attente (unique, insensible à la casse)
- `supabase/seed.sql` : les 3 magasins Carrefour (Bringo) et les 9 rayons

## Sécurité (RLS activée sur toutes les tables)
| Table | Visiteur (clé anon) | Scrapers (clé service_role) |
|---|---|---|
| stores, categories, products, nutrition_facts, prices, latest_prices | lecture | lecture + écriture |
| waitlist | **insertion seulement**, aucune lecture | tout |

La clé anon peut donc être publique : elle ne permet ni de lire la liste d'attente ni de modifier les prix.

## 1. Créer le projet
1. Va sur https://supabase.com, puis **New project**. Région conseillée : la plus proche du Maroc (ex. `eu-west` / Francfort / Paris si disponible).
2. Note le mot de passe de la base.

## 2. Appliquer les migrations
Avec la CLI Supabase (`npm i -g supabase` ou `npx supabase`) depuis la racine du repo :

```bash
npx supabase login
npx supabase link --project-ref <ref-du-projet>
npx supabase db push            # applique supabase/migrations/
psql "<chaîne de connexion>" -f supabase/seed.sql   # données de départ
```

Sans la CLI : copie le contenu de la migration, puis du seed, dans **SQL Editor** sur le tableau de bord et exécute-les dans cet ordre.

Pour tester en local : `npx supabase start` (Docker requis), puis `npx supabase db reset` applique migrations + seed.

## 3. Variables d'environnement
Valeurs dans **Project Settings > API**.

| Variable | Où | Rôle |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel (Production + Preview), `web/.env.local` | URL du projet |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel (Production + Preview), `web/.env.local` | Clé publique, utilisée par `/api/waitlist` |
| `SUPABASE_URL` | GitHub Actions (secret) | URL du projet pour les scrapers |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Actions (secret) **uniquement** | Écriture des prix par les scrapers ; ne jamais l'exposer au navigateur |

- **Vercel** : Project > Settings > Environment Variables, puis redéployer.
- **GitHub Actions** : repo > Settings > Secrets and variables > Actions > New repository secret.
- **Local** : `cp web/.env.example web/.env.local` et remplir.

## Liste d'attente
- Le formulaire `web/src/components/WaitlistForm.tsx` envoie vers `POST /api/waitlist`.
- La route valide l'e-mail et la ville, ignore les robots (champ caché), limite la taille de la requête, puis insère dans `waitlist`.
- Sans variables Supabase, la route répond **503** (« inscriptions pas encore ouvertes ») : aucun faux succès.
- Une adresse déjà inscrite renvoie un message « déjà inscrit », sans doublon.
- Pour exporter les inscrits : tableau de bord > Table Editor > `waitlist` > Export CSV.
