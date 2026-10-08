"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function createAffiliation(formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)

    const parent_affiliation_id_row = formData.get("parent_affiliation_id")
    const parent_affiliation_id =
      parent_affiliation_id_row === "" ? null : parent_affiliation_id_row

    console.log(slug)

    const { data: affiliation, error: charError } = await supabase
      .from("affiliation")
      .insert({
        name: name,
        short_name: formData.get("short_name"),
        icon_url: formData.get("icon_url"),
        description: formData.get("description"),
        category: formData.get("category"),
        parent_affiliation_id: parent_affiliation_id,
        slug: slug,
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
          type: "affiliation",
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

    return { success: true, data: affiliation }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
