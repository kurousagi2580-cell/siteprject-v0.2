do $$
declare
  table_name text;
  existing_policy record;
  existing_function record;
  public_read_tables text[] := array[
    'characters',
    'affiliation',
    'countries',
    'regions',
    'locations',
    'game_events',
    'relationships',
    'articles',
    'pages',
    'updates',
    'updateslog',
    'name_mappings'
  ];
begin
  grant usage on schema public to anon, authenticated;

  for table_name in
    select tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format('alter table public.%I enable row level security', table_name);

    if table_name not in ('aggregate_pages', 'aggregate_filters') then
      for existing_policy in
        select policyname
        from pg_policies
        where schemaname = 'public'
          and tablename = table_name
      loop
        execute format(
          'drop policy %I on public.%I',
          existing_policy.policyname,
          table_name
        );
      end loop;
    else
      execute format(
        'drop policy if exists %I on public.%I',
        'Admins have full access',
        table_name
      );
    end if;

    execute format(
      'create policy %I on public.%I for all to authenticated using ((auth.jwt() -> %L ->> %L) = %L) with check ((auth.jwt() -> %L ->> %L) = %L)',
      'Admins have full access',
      table_name,
      'app_metadata',
      'role',
      'admin',
      'app_metadata',
      'role',
      'admin'
    );

    execute format(
      'grant select, insert, update, delete on public.%I to authenticated',
      table_name
    );

    if table_name = any(public_read_tables) then
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (true)',
        'Public can read application data',
        table_name
      );
      execute format('grant select on public.%I to anon, authenticated', table_name);
    end if;
  end loop;

  grant usage, select on all sequences in schema public to authenticated;

  if to_regclass('public.comments') is not null then
    execute 'create policy "Public can read comments" on public.comments for select to anon using (true)';
    execute 'revoke select on public.comments from public, anon';
    execute 'grant select (id, page_id, number, user_name, content, parent_id, is_adopted, delete_reason, created_at) on public.comments to anon';
  end if;

  if to_regclass('public.comments_view') is not null then
    execute 'revoke select on public.comments_view from public, authenticated';
    grant select on public.comments_view to anon;
  end if;

  for existing_function in
    select p.oid::regprocedure as signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = any(array[
        'create_entity_with_page_generic',
        'delete_entity_with_page_generic'
      ])
  loop
    execute format(
      'revoke execute on function %s from public, anon, authenticated',
      existing_function.signature
    );
    execute format(
      'grant execute on function %s to service_role',
      existing_function.signature
    );
  end loop;
end
$$;
