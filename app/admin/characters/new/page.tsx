import { requireAdminPage } from "@/lib/auth/require-admin";
import CharacterForm from "@/components/entities/character/character-form"
import { getAffiliationList } from "@/actions/affiliations-actions-server";

export default async function Page() {
  await requireAdminPage();

  const affRes = await getAffiliationList();
  const affiliations = affRes?.items ?? []

  return <CharacterForm mode="create" affiliations={affiliations} />
}
