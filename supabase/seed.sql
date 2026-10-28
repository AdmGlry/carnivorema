-- Données de départ : enseignes et rayons.
insert into public.stores (slug, name, chain, source, base_url) values
  ('carrefour-hypermarket', 'Carrefour Hypermarket', 'Carrefour Maroc (Label''Vie)', 'bringo', 'https://www.bringo.ma/fr_MA/stores/carrefour-hypermarket'),
  ('carrefour-supermarket', 'Carrefour Market', 'Carrefour Maroc (Label''Vie)', 'bringo', 'https://www.bringo.ma/fr_MA/stores/carrefour-supermarket'),
  ('carrefour-gourmet', 'Carrefour Gourmet', 'Carrefour Maroc (Label''Vie)', 'bringo', 'https://www.bringo.ma/fr_MA/stores/carrefour-gourmet')
on conflict (slug) do nothing;

-- Mêmes identifiants que les catégories de web/src/lib/foods.ts
insert into public.categories (slug, name, sort_order) values
  ('viande', 'Boucherie', 1),
  ('volaille', 'Volaille', 2),
  ('poisson', 'Poissonnerie', 3),
  ('oeuf', 'Œufs', 4),
  ('laitier', 'Crémerie', 5),
  ('legume', 'Légumes', 6),
  ('fruit', 'Fruits', 7),
  ('feculent', 'Pâtes, riz & semoule', 8),
  ('legumineuse', 'Légumineuses', 9)
on conflict (slug) do nothing;
