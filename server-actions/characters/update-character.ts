"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function updateCharacter(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)

    // --- characters 更新 ---
    const { data: character, error: charError } = await supabase
      .from("characters")
      .update({
        name,
        slug,
        short_name: formData.get("short_name"),
        image_url: formData.get("image_url"),
        type: formData.get("type"),
        profile: formData.get("profile"),
        affiliation_id: formData.get("affiliation_id"),
        spaction: formData.get("spaction"),
      })
      .eq("id", id)
      .select()
      .single()

    if (charError) {
      return { success: false, error: charError.message }
    }

    // --- pages 更新 ---
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

    // --- 成功 ---
    return { success: true, data: character }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
