"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { generateSlug } from "@/lib/utils/generate-slug"

export async function createEvents(formData: FormData) {
  const supabase = createSupabaseAdminClient()

  try {
    const title = formData.get("title") as string
    const slug = generateSlug(title)

    console.log(slug)
    console.log(formData)

    const { data: gameevents, error: charError } = await supabase
      .from("game_events")
      .insert({
        title:title,
        status: formData.get("status"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
        image_url: formData.get("image_url"),
        articles_slug: slug,
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

    return { success: true, data: gameevents }

  } catch (e: any) {
    return { success: false, error: e.message ?? "Unknown error" }
  }
}
