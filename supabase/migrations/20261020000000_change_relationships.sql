-- 1) 管理者判定を1か所にまとめる
--    ★ 'admin@example.com' は、articles のポリシーで使っているメールアドレスに合わせて書き換える
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'admin@example.com'
$$;

-- 2) relationships に列を追加（既存の3件はそのまま、初期値が入る）
alter table public.relationships
  add column if not exists strength   smallint    not null default 3,
  add column if not exists sort_order integer     not null default 0,
  add column if not exists created_at timestamptz not null default now();

alter table public.relationships
  add constraint relationships_strength_check  check (strength between 1 and 5),
  add constraint relationships_no_self_check   check (character_id <> target_character_id),
  add constraint relationships_direction_check check (direction in ('one-way', 'two-way'));

-- 3) 座標テーブルを新設
create table public.character_relationship_positions (
  id           uuid primary key default gen_random_uuid(),
  diagram_key  text not null default 'main',
  character_id uuid not null references public.characters(id) on delete cascade,
  position_x   double precision not null check (position_x between -100000 and 100000),
  position_y   double precision not null check (position_y between -100000 and 100000),
  position_mode text not null default 'manual' check (position_mode in ('manual', 'auto')),
  group_key    text,
  is_visible   boolean not null default true,
  sort_order   integer not null default 0,
  updated_at   timestamptz not null default now(),
  unique (diagram_key, character_id)
);

create index character_relationship_positions_character_id_idx
  on public.character_relationship_positions (character_id);

create or replace function public.touch_relationship_positions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger character_relationship_positions_touch
  before update on public.character_relationship_positions
  for each row execute function public.touch_relationship_positions_updated_at();

-- 4) 座標テーブルの RLS（閲覧は全員、書き込みは管理者のみ）
alter table public.character_relationship_positions enable row level security;

create policy "positions: read all"
  on public.character_relationship_positions
  for select to anon, authenticated
  using (true);

create policy "positions: admin insert"
  on public.character_relationship_positions
  for insert to authenticated
  with check (public.is_admin());

create policy "positions: admin update"
  on public.character_relationship_positions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "positions: admin delete"
  on public.character_relationship_positions
  for delete to authenticated
  using (public.is_admin());