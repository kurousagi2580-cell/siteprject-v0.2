// src/lib/supabase/queries/countries.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CountryJoinRegion, Country } from "@/types/country";

const supabase = createSupabaseServerClient();

const baseSelectCoJoinRe = `
  id,
  name,
  short_name,
  image_url,
  description,
  slug,
  regions:regions!regions_parent_id_fkey (
    id,
    name,
    short_name,
    image_url,
    description,
    map_x,
    map_y,
    slug
  )
`;

/** 単一取得（slug 指定） */
export async function getCountryJoinRegion(slug: string): Promise<CountryJoinRegion | null> {
  const { data, error } = await supabase
    .from("countries")
    .select(baseSelectCoJoinRe)
    .eq("slug", slug)
    .single()
    .returns<CountryJoinRegion>();

  if (error) {
    console.error("getCountryJoinRegion error:", error);
    throw error;
  }
  return data;
}

/** 一覧取得（オプションでページングやフィルタを追加可能） */
export async function listCountries({
  q = "",
  page = 1,
  pageSize = 20,
  noPagination = false,
}: {
  q?: string;
  page?: number;
  pageSize?: number;
  noPagination?: boolean;
} = {}): Promise<{ items: CountryJoinRegion[]; total?: number }> {
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;
  const query = supabase.from("countries").select(baseSelectCoJoinRe, { count: "exact" });

  if (q) {
    const like = `%${q}%`;
    // name や short_name に対して部分一致検索
    query.ilike("name", like).or(`short_name.ilike.${like}`);
  }

  if (noPagination) {
    const { data, count, error } = await query;
    if (error) throw error;
    return { items: (data ?? []) as CountryJoinRegion[], total: count ?? 0 };
  } else {
    const { data, count, error } = await query.range(from, to);
    if (error) throw error;
    return { items: (data ?? []) as CountryJoinRegion[], total: count ?? 0 };
  }
}
