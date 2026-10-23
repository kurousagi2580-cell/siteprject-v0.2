-- 座標の一括保存（upsert の onConflict: diagram_key, character_id）に必要な一意制約。
-- すでに同じ列の一意インデックスがあれば何もしない。
do $$
begin
  if not exists (
    select 1
    from pg_index i
    where i.indrelid = 'public.character_relationship_positions'::regclass
      and i.indisunique
      and (
        select array_agg(a.attname::text order by a.attname::text)
        from pg_attribute a
        where a.attrelid = i.indrelid and a.attnum = any(i.indkey)
      ) = array['character_id', 'diagram_key']
  ) then
    create unique index character_relationship_positions_diagram_character_key
      on public.character_relationship_positions (diagram_key, character_id);
  end if;
end
$$;
