// src/lib/nameMap.ts
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const supabase = createSupabaseAdminClient();

let nameMapCache: Record<string,string> = {};
let lastLoaded = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5分

export async function loadNameMap(force = false) {
  if (!force && Date.now() - lastLoaded < CACHE_TTL && Object.keys(nameMapCache).length) return nameMapCache;
  const { data, error } = await supabase.from("name_mappings").select("source_text, hiragana");
  if (error) throw error;
  nameMapCache = Object.fromEntries((data ?? []).map((r: any) => [r.source_text, r.hiragana]));
  lastLoaded = Date.now();
  return nameMapCache;
}

export function clearNameMapCache() {
  nameMapCache = {};
  lastLoaded = 0;
}

export function toHiraganaByMap(name: string) {
  let result = name;
  for (const [k, v] of Object.entries(nameMapCache)) {
    result = result.replaceAll(k, v);
  }
  // カタカナ→ひらがな変換は既存ロジックを使う
  result = result.replace(/[ァ-ン]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  return result;
}
