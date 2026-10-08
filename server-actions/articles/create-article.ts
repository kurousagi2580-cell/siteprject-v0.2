"use server"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function createArticle(formData: FormData) {
  const supabase = createSupabaseAdminClient()

  const page_id_row = formData.get("page_id")
  const page_id =
      page_id_row === "" ? null : page_id_row

  const { error } = await supabase.from("articles").insert({
    title:formData.get("title"),
    slug:formData.get("slug") as string,
    eyecatch:formData.get("eyecatch") as string,
    body:formData.get("body"),
    category:formData.get("category") as string,
    page_id: page_id
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}