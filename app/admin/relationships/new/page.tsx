import { requireAdminPage } from "@/lib/auth/require-admin";
import RelationshipForm from "@/components/entities/relationship/relationship-form-wrapper"
import { getCharacterByList } from "@/actions/characters-actions-server";

export default async function Page() {
  await requireAdminPage();

  const charaRes = await getCharacterByList();
  const characters = charaRes?.items ?? []

  return <RelationshipForm mode="create" characters={characters} />
}

