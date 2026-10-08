"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function createLocation(formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const name = formData.get("name") as string
    const slug = generateSlug(name)


    console.log(slug)
    console.log(formData)

    const { data: country, error: charError } = await supabase
      .from("locations")
      .insert({
        name,
        fast_travel: formData.get("fast_travel"),
        x: formData.get("x"),
        y: formData.get("y"),
        parent_region_id: formData.get("parent_region_id"),
        slug: slug,
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

    return { success: true, data: country }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
