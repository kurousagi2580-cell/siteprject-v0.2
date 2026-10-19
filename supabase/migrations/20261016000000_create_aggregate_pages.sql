create table if not exists public.aggregate_pages (
  slug text primary key,
  title text not null,
  subtitle text,
  entity_type text not null check (entity_type in ('characters', 'countries')),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aggregate_filters (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null references public.aggregate_pages(slug) on delete cascade,
  field_key text not null,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (page_slug, field_key)
);

alter table public.aggregate_pages enable row level security;
alter table public.aggregate_filters enable row level security;

grant select on public.aggregate_pages to anon, authenticated;
grant select on public.aggregate_filters to anon, authenticated;

drop policy if exists "Public can read active aggregate pages" on public.aggregate_pages;
create policy "Public can read active aggregate pages"
  on public.aggregate_pages for select
  to anon, authenticated
  using (is_active);

drop policy if exists "Public can read filters for active aggregate pages" on public.aggregate_filters;
create policy "Public can read filters for active aggregate pages"
  on public.aggregate_filters for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.aggregate_pages
      where aggregate_pages.slug = aggregate_filters.page_slug
        and aggregate_pages.is_active
    )
  );

insert into public.aggregate_pages (slug, title, subtitle, entity_type, sort_order)
values ('characters', 'キャラクター図鑑', 'キャラクター一覧', 'characters', 10)
on conflict (slug) do update
set title = excluded.title,
    subtitle = excluded.subtitle,
    entity_type = excluded.entity_type,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.aggregate_filters (page_slug, field_key, label, sort_order)
values ('characters', 'affiliation', '所属', 10)
on conflict (page_slug, field_key) do update
set label = excluded.label,
    sort_order = excluded.sort_order;
