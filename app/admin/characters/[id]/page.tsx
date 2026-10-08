import CharacterForm from "@/components/admin/character-form"
import type { Character } from "@/types/character"
import { fetchData } from "@/lib/supabase/queries"
import { getAffiliations } from "@/lib/supabase/get-affiliations"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const character = await fetchData<Character>("characters", {
      select: "id, name, short_name, image_url, type, spaction, profile, affiliation_id, slug",
      filters: [{ column: "id", operator: "eq", value: id }],
      single:true
    })

  const affiliations = await getAffiliations()
  
  console.log(character)

  if (!character) {
    return null
  }

  return <CharacterForm mode="edit" initialData={character} affiliations={affiliations}/>
}
