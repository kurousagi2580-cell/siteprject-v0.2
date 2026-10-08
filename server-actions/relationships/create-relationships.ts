"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function createRelationShips(formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {

    const { data: relationships, error: charError } = await supabase
      .from("relationships")
      .insert({
        character_id: formData.get("character_id"),
        target_character_id: formData.get("target_character_id"),
        relation_type: formData.get("relation_type"),
        direction: formData.get("direction"),
        relation_description: formData.get("relation_description"),
      })
      .select()
      .single()

    if (charError) {
      return { success: false, error: charError.message }
    }

    {/* とりあえず削除 
    const { data: page, error: pageSelectError } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()

    if (pageSelectError) {
      return { success: false, error: pageSelectError.message }
    }

    if (!page) {
      const { error: pageInsertError } = await supabase
        .from("pages")
        .insert({
          slug,
          title: name,
          type: "country",
        })

      if (pageInsertError) {
        return { success: false, error: pageInsertError.message }
      }
    } else {
      const { error: pageUpdateError } = await supabase
        .from("pages")
        .update({ title: name })
        .eq("slug", slug)

      if (pageUpdateError) {
        return { success: false, error: pageUpdateError.message }
      }
    }
    */}

    return { success: true, data: relationships }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
