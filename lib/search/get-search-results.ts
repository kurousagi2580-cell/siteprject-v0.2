// src/lib/supabase/queries/get-search-results.ts
import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin"; // あなたの server helper に合わせて調整
import { type SearchTabKey } from "@/types/utils/tab";

type Result = {
  characters: any[];
  affiliations: any[];
  countries: any[];
  regions: any[];
  events: any[];
  totals: { characters: number; affiliations: number; countries: number; regions: number; events: number };
};

export async function getSearchResults({ q, page = 1, pageSize = 20, tab = "all" as SearchTabKey }: { q: string; page?: number; pageSize?: number; tab?: SearchTabKey }): Promise<Result> {
  const supabase = createSupabaseAdminClient();
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;
  const like = `%${q}%`;

  // 例: characters
  const [{ data: characters = [], count: cCount }, { data: affiliations = [], count: aCount }, { data: countries = [], count: coCount }, { data: regions = [], count: rCount }, { data: events = [], count: eCount }] = await Promise.all([
    supabase.from("characters").select("*", { count: "exact" }).ilike("name", like).range(from, to),
    supabase.from("affiliations").select("*", { count: "exact" }).ilike("name", like).range(from, to),
    supabase.from("countries").select("*", { count: "exact" }).ilike("name", like).range(from, to),
    supabase.from("regions").select("*", { count: "exact" }).ilike("name", like).range(from, to),
    supabase.from("events").select("*", { count: "exact" }).ilike("title", like).range(from, to),
  ]);

  return {
    characters: characters ?? [],
    affiliations: affiliations ?? [],
    countries: countries ?? [],
    regions: regions ?? [],
    events: events ?? [],
    totals: { characters: cCount ?? 0, affiliations: aCount ?? 0, countries: coCount ?? 0, regions: rCount ?? 0, events: eCount ?? 0 },
  };
}
