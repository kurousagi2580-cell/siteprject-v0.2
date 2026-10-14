import { toRomaji } from "wanakana";
import { loadNameMap, toHiraganaByMap } from "@/lib/supabase/queries/name-maps";

export async function generateSlug(name: string) {
  // 起動時や呼び出し前にキャッシュをロード
  await loadNameMap();

  const hiragana = toHiraganaByMap(name || "");
  let slug = toRomaji(hiragana);
  slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug;
}