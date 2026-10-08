import { fetchData } from "@/lib/supabase/queries"
import { getCharacters } from "@/lib/supabase/get-characters"
import RelationShipsForm from "@/components/admin/relationship-form"
import { Relationship } from "@/types/relationships"

export default async function RelationshipsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const characters = await getCharacters()

  if (!characters) {
    return null
  }

  const relationships = await fetchData<Relationship>("relationships", {
    select: "id, character_id, target_character_id, relation_type, direction, relation_description, updated_at",
    filters: [{ column: "id", operator: "eq", value: id }],
    single: true
  })

  if (!relationships) {
    return null
  }

  return <RelationShipsForm mode="edit" initialData={relationships} characters={characters}/>
}
