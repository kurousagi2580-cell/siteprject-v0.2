
import { getCharacters } from "@/lib/supabase/get-characters"
import RelationShipsForm from "@/components/admin/relationship-form"


export default async function Page() {
 const characters = await getCharacters()

  if (!characters) {
    return null
  }
  return <RelationShipsForm mode="create" characters={characters} />
}
