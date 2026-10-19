alter table public.aggregate_pages
  drop constraint if exists aggregate_pages_entity_type_check;

alter table public.aggregate_pages
  add constraint aggregate_pages_entity_type_check
  check (entity_type in ('characters', 'countries', 'regions'));

insert into public.aggregate_pages (slug, title, subtitle, entity_type, sort_order)
values ('regions', '地域一覧', '各国の地域一覧', 'regions', 30)
on conflict (slug) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    entity_type = excluded.entity_type,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.aggregate_filters (page_slug, field_key, label, sort_order)
values ('regions', 'country', '国', 10)
on conflict (page_slug, field_key) do update
set label = excluded.label,
    sort_order = excluded.sort_order;
