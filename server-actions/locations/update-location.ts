"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function updateLoacation(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)

    // --- characters 更新 ---
    const { data: country, error: charError } = await supabase
      .from("locations")
      .update({
        name,
        fast_travel: formData.get("fast_travel"),
        x: formData.get("x"),
        y: formData.get("description"),
        parent_region_id: formData.get("parent_region_id"),
        slug: formData.get("slug"),
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
    return { success: true, data: country }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
