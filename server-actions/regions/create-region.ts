"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function createRegion(formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)


    console.log(slug)

    const { data: regions, error: charError } = await supabase
      .from("regions")
      .insert({
        name,
        short_name: formData.get("short_name"),
        parent_id: formData.get("parentId"),
        image_url: formData.get("image_url"),
        description: formData.get("description"),
        map_x: formData.get("map_x"),
        map_y: formData.get("map_y"),
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
          type: "regions",
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

    return { success: true, data: regions }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
