
import RelationshipForm from "@/components/entities/relationship/relationship-form-wrapper"
import { getCharacterByList } from "@/actions/characters-actions-server";

export default async function Page() {

  const charaRes = await getCharacterByList();
  const characters = charaRes?.items ?? []

  return <RelationshipForm mode="create" characters={characters} />
}

