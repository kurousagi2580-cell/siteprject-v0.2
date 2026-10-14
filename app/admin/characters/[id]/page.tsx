
import CharacterForm from "@/components/entities/character/character-form"
import { getCharacterById } from "@/actions/characters-actions-server";
import { getAffiliationList } from "@/actions/affiliations-actions-server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const affRes = await getAffiliationList();
  const affiliations = affRes?.items ?? []

  const character = await getCharacterById(id);
  if (!character) return null;

  const safe = { ...character, created_at: character.created_at?.toString?.(), updated_at: character.updated_at?.toString?.() };

  return <CharacterForm mode="edit" initialData={safe} affiliations={affiliations} />
}
