import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { RegionJoinLocation } from "@/types/region"

//リジョンテーブル×ロケーションテーブル
export async function getRegionBySlug(slug: string): Promise<RegionJoinLocation | null> {

  const supabase = createSupabaseServerClient()

  const select = `
    id, name, short_name, parent_id, image_url, description, map_x, map_y, slug,
    Locations:locations!locations_parent_region_id_fkey (
      id, name, fast_travel, x, y, parent_region_id, slug, created_at
    )
  `

  const { data, error } = await supabase
    .from("regions")
    .select(select)
    .eq("slug", slug)
    .single();

  if (error) {
    // ログを残す（必要なら監視サービスへ送る）
    console.error("getRegionBySlug error:", error);
    throw error;
  }

  return data
}