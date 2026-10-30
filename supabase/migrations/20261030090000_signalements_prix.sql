-- Prix signalés par les utilisateurs (souk, hanout, marché, primeur…).
-- Aucune donnée personnelle : ni compte, ni e-mail, ni adresse IP.

create table public.price_reports (
  id bigint generated always as identity primary key,
  product_slug text not null check (product_slug ~ '^[a-z0-9-]{2,60}$'),
  price_mad numeric not null check (price_mad > 0 and price_mad < 10000),
  unit text not null check (unit in ('kg', 'piece', 'botte', 'litre')),
  city text not null check (length(city) between 2 and 60),
  place_type text not null check (place_type in ('souk', 'hanout', 'marche', 'primeur', 'supermarche', 'autre')),
  status text not null default 'approved' check (status in ('approved', 'flagged')),
  created_at timestamptz not null default now()
);

create index price_reports_product_idx on public.price_reports (product_slug, unit, created_at desc);

-- Un prix trop éloigné de la médiane récente (au moins 5 relevés) est mis de côté au lieu d'être publié.
create function public.price_reports_flag_outliers() returns trigger
language plpgsql
set search_path = ''
as $$
declare
  med numeric;
  n int;
begin
  select percentile_cont(0.5) within group (order by price_mad), count(*)
    into med, n
  from public.price_reports
  where product_slug = new.product_slug
    and unit = new.unit
    and status = 'approved'
    and created_at > now() - interval '45 days';
  new.status := case when n >= 5 and (new.price_mad < med * 0.33 or new.price_mad > med * 3) then 'flagged' else 'approved' end;
  return new;
end;
$$;

create trigger price_reports_flag_outliers
  before insert on public.price_reports
  for each row execute function public.price_reports_flag_outliers();

alter table public.price_reports enable row level security;

create policy "signalement anonyme" on public.price_reports for insert to anon, authenticated with check (true);
create policy "lecture des prix validés" on public.price_reports for select to anon, authenticated using (status = 'approved');

revoke all on public.price_reports from anon, authenticated;
grant insert (product_slug, price_mad, unit, city, place_type) on public.price_reports to anon, authenticated;
grant select (product_slug, price_mad, unit, city, place_type, created_at, status) on public.price_reports to anon, authenticated;

-- Statistiques des 45 derniers jours : par ville, et pour tout le Maroc (city = 'Maroc').
create view public.price_report_stats
with (security_invoker = true) as
select
  product_slug,
  unit,
  coalesce(city, 'Maroc') as city,
  count(*)::int as reports,
  round(percentile_cont(0.5) within group (order by price_mad)::numeric, 2) as median_mad,
  min(price_mad) as min_mad,
  max(price_mad) as max_mad,
  max(created_at) as last_report_at
from public.price_reports
where status = 'approved' and created_at > now() - interval '45 days'
group by grouping sets ((product_slug, unit, city), (product_slug, unit));

grant select on public.price_report_stats to anon, authenticated;
