import CharacterForm from "@/components/admin/character-form"
import { getAffiliations } from "@/lib/supabase/get-affiliations"

export default async function Page() {
  const affiliations = await getAffiliations()
  return <CharacterForm mode="create" affiliations={affiliations} />
}
