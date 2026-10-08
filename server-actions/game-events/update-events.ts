"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function updateEvents(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const title = formData.get("title") as string
    const slug = generateSlug(title)

    // ---  更新 ---
    const { data: gameevents, error: charError } = await supabase
      .from("game_events")
      .update({
        title:title,
        status: formData.get("status"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        image_url: formData.get("image_url"),
        articles_slug: slug,
        created_at: formData.get("created_at")
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
    return { success: true, data: gameevents }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
