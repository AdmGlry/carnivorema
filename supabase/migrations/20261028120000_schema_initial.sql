-- Schéma initial : enseignes, rayons, produits, relevés de prix, nutrition, liste d'attente.

create extension if not exists citext with schema extensions;

-- Enseignes (un magasin en ligne = une ligne, ex. carrefour-hypermarket)
create table public.stores (
  slug text primary key,
  name text not null,
  chain text not null,
  source text not null,
  base_url text,
  created_at timestamptz not null default now()
);

-- Rayons
create table public.categories (
  slug text primary key,
  name text not null,
  sort_order int not null default 0
);

-- Produit canonique (indépendant de l'enseigne), auquel on rattache les relevés de prix
create table public.products (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  category_slug text references public.categories (slug),
  gluten boolean not null default false,
  lactose boolean not null default false,
  created_at timestamptz not null default now()
);

-- Valeurs nutritionnelles pour 100 g
create table public.nutrition_facts (
  product_id bigint primary key references public.products (id) on delete cascade,
  kcal numeric not null check (kcal >= 0),
  protein numeric not null check (protein >= 0),
  carbs numeric not null check (carbs >= 0),
  fat numeric not null check (fat >= 0),
  fiber numeric check (fiber >= 0),
  source text not null,
  updated_at timestamptz not null default now()
);

-- Relevés de prix bruts : une ligne par produit, par enseigne et par relevé
create table public.prices (
  id bigint generated always as identity primary key,
  store_slug text not null references public.stores (slug),
  product_ext_id text not null,
  name text not null,
  category_slug text references public.categories (slug),
  price_mad numeric not null check (price_mad >= 0),
  promo text,
  pack_grams numeric check (pack_grams > 0),
  pack_ml numeric check (pack_ml > 0),
  unit_count int check (unit_count > 0),
  price_per_kg numeric check (price_per_kg >= 0),
  url text,
  scraped_at timestamptz not null default now(),
  -- Rattachement optionnel au produit canonique
  product_id bigint references public.products (id) on delete set null
);

create index prices_store_product_scraped_idx
  on public.prices (store_slug, product_ext_id, scraped_at desc);
create index prices_product_id_idx on public.prices (product_id);

-- Dernier prix connu de chaque produit dans chaque enseigne (ruptures à 0 MAD exclues)
create view public.latest_prices
with (security_invoker = true) as
select distinct on (store_slug, product_ext_id) *
from public.prices
where price_mad > 0
order by store_slug, product_ext_id, scraped_at desc;

-- Liste d'attente de la bêta
create table public.waitlist (
  id bigint generated always as identity primary key,
  email citext not null unique
    check (length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  city text check (length(city) <= 60),
  diet text check (length(diet) <= 40),
  goal text check (length(goal) <= 40),
  source text check (length(source) <= 60),
  created_at timestamptz not null default now()
);

-- Sécurité : RLS sur toutes les tables
alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.nutrition_facts enable row level security;
alter table public.prices enable row level security;
alter table public.waitlist enable row level security;

-- Lecture publique du catalogue et des prix
create policy "lecture publique" on public.stores for select to anon, authenticated using (true);
create policy "lecture publique" on public.categories for select to anon, authenticated using (true);
create policy "lecture publique" on public.products for select to anon, authenticated using (true);
create policy "lecture publique" on public.nutrition_facts for select to anon, authenticated using (true);
create policy "lecture publique" on public.prices for select to anon, authenticated using (true);
-- Pas de politique d'écriture : seul le service role (scrapers) écrit, il contourne la RLS.
revoke insert, update, delete, truncate on public.stores, public.categories, public.products, public.nutrition_facts, public.prices
  from anon, authenticated;
grant select on public.stores, public.categories, public.products, public.nutrition_facts, public.prices, public.latest_prices
  to anon, authenticated;

-- Liste d'attente : insertion anonyme uniquement, aucune lecture
create policy "inscription anonyme" on public.waitlist for insert to anon, authenticated with check (true);
revoke all on public.waitlist from anon, authenticated;
grant insert (email, city, diet, goal, source) on public.waitlist to anon, authenticated;
