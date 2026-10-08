"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function updateRelationShips(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {

    // ---  更新 ---
    const { data: relationships, error: charError } = await supabase
      .from("relationships")
      .update({
        character_id: formData.get("character_id"),
        target_character_id: formData.get("target_character_id"),
        relation_type: formData.get("relation_type"),
        direction: formData.get("direction"),
        relation_description: formData.get("relation_description"),
        created_at: formData.get("updated_at")
      })
      .eq("id", id)
      .select()
      .single()

    if (charError) {
      return { success: false, error: charError.message }
    }

    // --- pages 更新 ---
    {/* とりあえず削除 
    const { error: pageError } = await supabase
      .from("pages")
      .update({
        slug,
        title: name,
      })
      .eq("slug", slug)

    if (pageError) {
      return { success: false, error: pageError.message }
    }
    */}

    // --- 成功 ---
    return { success: true, data: relationships }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
