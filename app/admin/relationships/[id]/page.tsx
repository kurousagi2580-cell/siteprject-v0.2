import { requireAdminPage } from "@/lib/auth/require-admin";
import RelationshipForm from "@/components/entities/relationship/relationship-form-wrapper"
import { getRelationById } from "@/actions/relations-actions-server";
import { getCharacterByList } from "@/actions/characters-actions-server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();

  const { id } = await params

  const charaRes = await getCharacterByList();
  const characters = charaRes?.items ?? []

  const relation = await getRelationById(id);
  if (!relation) return null;

  const safe = { ...relation, updated_at: relation.updated_at?.toString?.() };

  return <RelationshipForm mode="edit" initialData={safe} characters={characters} />
}

