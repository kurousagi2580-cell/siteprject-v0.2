do $$
declare
  existing_policy record;
begin
  grant usage on schema public to anon, authenticated;

  if to_regclass('public.words') is not null then
    alter table public.words enable row level security;

    for existing_policy in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = 'words'
    loop
      execute format('drop policy %I on public.words', existing_policy.policyname);
    end loop;

    create policy "Public can read application data"
      on public.words for select to anon, authenticated using (true);
    create policy "Admins have full access"
      on public.words for all to authenticated
      using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

    grant select on public.words to anon, authenticated;
    grant insert, update, delete on public.words to authenticated;
  end if;

  if to_regclass('public.character_relationship_positions') is not null then
    alter table public.character_relationship_positions enable row level security;

    for existing_policy in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = 'character_relationship_positions'
    loop
      execute format(
        'drop policy %I on public.character_relationship_positions',
        existing_policy.policyname
      );
    end loop;

    create policy "Public can read application data"
      on public.character_relationship_positions
      for select to anon, authenticated using (true);
    create policy "Admins have full access"
      on public.character_relationship_positions for all to authenticated
      using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

    grant select on public.character_relationship_positions to anon, authenticated;
    grant insert, update, delete on public.character_relationship_positions to authenticated;
  end if;
end
$$;
