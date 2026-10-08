"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function updateAffiliation(id: string, formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)

    const parent_affiliation_id_row = formData.get("parent_affiliation_id")
    const parent_affiliation_id =
      parent_affiliation_id_row === "" ? null : parent_affiliation_id_row

    // --- characters 更新 ---
    const { data: affiliation, error: charError } = await supabase
      .from("affiliation")
      .update({
        name: name,
        short_name: formData.get("short_name"),
        icon_url: formData.get("icon_url"),
        description: formData.get("description"),
        category: formData.get("category"),
        parent_affiliation_id: parent_affiliation_id,
        slug: slug,
        created_at: formData.get("created_at")
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
    return { success: true, data: affiliation }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
