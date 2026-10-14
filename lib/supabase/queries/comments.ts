import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Comment, LatestComment } from "@/types/comment"

//キャラクターテーブル×所属テーブル
export async function getLatestComments(): Promise<LatestComment[] | null> {

    const supabase = createSupabaseServerClient()

    const select = `
    id,
      content,
      created_at,
      user_name,
      page:pages (
        id,
        slug,
        title,
        type
      )
  `
    const { data, error } = await supabase
        .from("comments")
        .select(select)
        .limit(50)
        .order("created_at", {ascending: false})
        .returns<LatestComment[]>();
        

    if (error) {
        // ログを残す（必要なら監視サービスへ送る）
        console.error("getCharacterJoinAffiliation error:", error);
        throw error;
    }

    return data
}