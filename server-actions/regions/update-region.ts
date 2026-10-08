"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function updateCountry(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)

    // --- characters 更新 ---
    const { data: regions, error: charError } = await supabase
      .from("regions")
      .update({
        name,
        short_name: formData.get("short_name"),
        parent_id: formData.get("parentId"),
        image_url: formData.get("image_url"),
        description: formData.get("description"),
        map_x: formData.get("map_x"),
        map_y: formData.get("map_y"),
        slug: slug,
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
    return { success: true, data: regions }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
