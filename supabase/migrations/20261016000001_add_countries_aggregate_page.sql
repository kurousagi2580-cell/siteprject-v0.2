insert into public.aggregate_pages (slug, title, subtitle, entity_type, sort_order)
values ('countries', '国一覧', '世界を構成する国一覧', 'countries', 20)
on conflict (slug) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    entity_type = excluded.entity_type,
    sort_order = excluded.sort_order,
    updated_at = now();
