import "server-only";
import { toHiragana } from "wanakana";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type SearchTabKey } from "@/types/utils/tab";

const escapeLikePattern = (value: string) => value.replace(/[\\%_]/g, "\\$&");
const normalizeQuery = (value: string) => value.trim().slice(0, 100);

const splitTerms = (value: string) =>
  value
    .trim()
    .split(/[\s\u3000]+/)
    .filter(Boolean)
    .map((term) => term.slice(0, 50));

const isKana = (value: string) => /[\u3040-\u30ff]/.test(value);

function matchAllTerms(text: string, terms: string[]) {
  const haystack = text.toLowerCase();
  return terms.every((term) => haystack.includes(term.toLowerCase()));
}

type CharacterRow = {
  id: string;
  name: string | null;
  short_name: string | null;
  image_url: string | null;
  slug: string | null;
};

type AffiliationRow = {
  id: string;
  name: string | null;
  icon_url: string | null;
  slug: string | null;
};

type CountryRow = {
  id: string;
  name: string | null;
  image_url: string | null;
  slug: string | null;
};

type RegionRow = {
  id: string;
  name: string | null;
  image_url: string | null;
  slug: string | null;
};

type GameEventRow = {
  id: string;
  title: string | null;
  image_url: string | null;
  articles_slug: string | null;
};

type WordRow = {
  id: string;
  keyword: string | null;
  read_word: string | null;
  image_url: string | null;
  slug: string | null;
};

type Result = {
  characters: CharacterRow[];
  affiliations: AffiliationRow[];
  countries: CountryRow[];
  regions: RegionRow[];
  events: GameEventRow[];
  words: WordRow[];
  totals: { characters: number; affiliations: number; countries: number; regions: number; events: number; words: number };
};

async function getKanaSourceTexts(readdb: ReturnType<typeof createSupabaseServerClient>, value: string) {
  const hiragana = toHiragana(value);
  if (!hiragana || !isKana(hiragana)) return [];

  const { data, error } = await readdb
    .from("name_mappings")
    .select("source_text")
    .ilike("hiragana", `%${escapeLikePattern(hiragana)}%`)
    .limit(50);

  if (error) throw error;

  return Array.from(new Set((data ?? []).map((row) => row.source_text).filter(Boolean) as string[]));
}

function filterRows<T extends Record<string, any>>(items: T[], terms: string[], textSelectors: Array<(item: T) => string | null | undefined>) {
  if (!terms.length) return items;
  return items.filter((item) => {
    const haystacks = textSelectors.map((selector) => selector(item) ?? "");
    return terms.every((term) =>
      haystacks.some((value) => matchAllTerms(value, [term]))
    );
  });
}

async function getFilteredCharacters(readdb: ReturnType<typeof createSupabaseServerClient>, query: string) {
  const { data, error } = await readdb
    .from("characters")
    .select("id, name, short_name, image_url, slug")
    .limit(1000);

  if (error) throw error;

  const rawItems = (data ?? []) as CharacterRow[];
  if (!query) return { items: rawItems, total: rawItems.length };

  const tokens = splitTerms(query).map((token) => token.toLowerCase());
  const kanaTerms = new Set<string>();
  for (const token of tokens) {
    if (!isKana(token)) continue;
    const mapped = toHiragana(token);
    if (mapped) kanaTerms.add(mapped.toLowerCase());
    const matchSources = await getKanaSourceTexts(readdb, token);
    matchSources.forEach((source) => kanaTerms.add(source.toLowerCase()));
  }

  const allTerms = Array.from(new Set([...tokens, ...kanaTerms]));
  const filtered = rawItems.filter((item) => {
    const haystacks = [item.name ?? "", item.short_name ?? ""].join(" ");
    return allTerms.every((term) => haystacks.toLowerCase().includes(term.toLowerCase()));
  });

  return { items: filtered, total: filtered.length };
}

async function getFilteredMaybe(readdb: ReturnType<typeof createSupabaseServerClient>, table: string, select: string, query: string, textKey: string) {
  const { data, error } = await readdb.from(table).select(select).limit(1000);
  if (error) throw error;

  const items = (data ?? []) as Record<string, any>[];
  if (!query) return { items, total: items.length };

  const tokens = splitTerms(query).map((token) => token.toLowerCase());
  const filtered = items.filter((item) => tokens.every((term) => (item[textKey] ?? "").toLowerCase().includes(term)));
  return { items: filtered, total: filtered.length };
}

export async function getSearchResults({ q, page = 1, pageSize = 20, tab = "all" as SearchTabKey }: { q: string; page?: number; pageSize?: number; tab?: SearchTabKey }): Promise<Result> {
  const readdb = createSupabaseServerClient();
  const normalizedQuery = normalizeQuery(q);
  const query = splitTerms(normalizedQuery).join(" ");

  const [
    characterResult,
    affiliationResult,
    countryResult,
    regionResult,
    eventResult,
    wordResult,
  ] = await Promise.all([
    query ? getFilteredCharacters(readdb, query) : (async () => {
      const { data, error } = await readdb.from("characters").select("id, name, short_name, image_url, slug").range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { items: (data ?? []) as CharacterRow[], total: (data ?? []).length };
    })(),
    query ? getFilteredMaybe(readdb, "affiliation", "id, name, icon_url, slug", query, "name") : (async () => {
      const { data, error } = await readdb.from("affiliation").select("id, name, icon_url, slug").range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { items: (data ?? []) as AffiliationRow[], total: (data ?? []).length };
    })(),
    query ? getFilteredMaybe(readdb, "countries", "id, name, image_url, slug", query, "name") : (async () => {
      const { data, error } = await readdb.from("countries").select("id, name, image_url, slug").range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { items: (data ?? []) as CountryRow[], total: (data ?? []).length };
    })(),
    query ? getFilteredMaybe(readdb, "regions", "id, name, image_url, slug", query, "name") : (async () => {
      const { data, error } = await readdb.from("regions").select("id, name, image_url, slug").range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { items: (data ?? []) as RegionRow[], total: (data ?? []).length };
    })(),
    query ? getFilteredMaybe(readdb, "game_events", "id, title, image_url, articles_slug", query, "title") : (async () => {
      const { data, error } = await readdb.from("game_events").select("id, title, image_url, articles_slug").range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { items: (data ?? []) as GameEventRow[], total: (data ?? []).length };
    })(),
    query ? getFilteredMaybe(readdb, "words", "id, keyword, read_word, image_url, slug", query, "keyword") : (async () => {
      const { data, error } = await readdb.from("words").select("id, keyword, read_word, image_url, slug").range((page - 1) * pageSize, page * pageSize - 1);
      if (error) throw error;
      return { items: (data ?? []) as WordRow[], total: (data ?? []).length };
    })(),
  ]);

  const pageSlice = <T,>(items: T[]) => items.slice((page - 1) * pageSize, page * pageSize);

  return {
    characters: pageSlice(characterResult.items as CharacterRow[]),
    affiliations: pageSlice(affiliationResult.items as AffiliationRow[]),
    countries: pageSlice(countryResult.items as CountryRow[]),
    regions: pageSlice(regionResult.items as RegionRow[]),
    events: pageSlice(eventResult.items as GameEventRow[]),
    words: pageSlice(wordResult.items as WordRow[]),
    totals: {
      characters: characterResult.total,
      affiliations: affiliationResult.total,
      countries: countryResult.total,
      regions: regionResult.total,
      events: eventResult.total,
      words: wordResult.total,
    },
  };
}

