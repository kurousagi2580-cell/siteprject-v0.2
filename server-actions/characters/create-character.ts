"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function createCharacter(formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)
    const affiliation_id_raw = formData.get("affiliation_id")
    const affiliation_id =
      affiliation_id_raw === "" ? null : affiliation_id_raw


    console.log(slug)

    const { data: character, error: charError } = await supabase
      .from("characters")
      .insert({
        name,
        slug,
        short_name: formData.get("short_name"),
        image_url: formData.get("image_url"),
        type: formData.get("type"),
        profile: formData.get("profile"),
        affiliation_id: affiliation_id,
        spaction: formData.get("spaction"),
      })
      .select()
      .single()

    if (charError) {
      return { success: false, error: charError.message }
    }

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
          type: "character",
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

    return { success: true, data: character }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
