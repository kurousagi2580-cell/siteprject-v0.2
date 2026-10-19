alter table public.aggregate_pages
  drop constraint if exists aggregate_pages_entity_type_check;

alter table public.aggregate_pages
  add constraint aggregate_pages_entity_type_check
  check (entity_type in ('characters', 'countries', 'regions', 'affiliations'));

insert into public.aggregate_pages (slug, title, subtitle, entity_type, sort_order)
values ('affiliations', '所属一覧', '世界観に登場する所属一覧', 'affiliations', 40)
on conflict (slug) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    entity_type = excluded.entity_type,
    sort_order = excluded.sort_order,
    updated_at = now();
