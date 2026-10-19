import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Affiliation } from "@/types/affiliation"

export type AffiliationCharacter = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  slug: string | null
}

export async function getAffiliationWithCharacters(
  slug: string,
): Promise<{ affiliation: Affiliation; characters: AffiliationCharacter[] } | null> {
  const supabase = createSupabaseServerClient()
  const { data: affiliation, error: affiliationError } = await supabase
    .from("affiliation")
    .select("id, name, short_name, icon_url, description, category, order, parent_affiliation_id, slug, created_at")
    .eq("slug", slug)
    .maybeSingle()
    .returns<Affiliation>()

  if (affiliationError) {
    console.error("getAffiliationWithCharacters affiliation error:", affiliationError)
    throw affiliationError
  }
  if (!affiliation) return null

  const { data: characters, error: charactersError } = await supabase
    .from("characters")
    .select("id, name, short_name, image_url, slug")
    .eq("affiliation_id", affiliation.id)
    .order("name", { ascending: true })
    .returns<AffiliationCharacter[]>()

  if (charactersError) {
    console.error("getAffiliationWithCharacters characters error:", charactersError)
    throw charactersError
  }

  return { affiliation, characters }
}
