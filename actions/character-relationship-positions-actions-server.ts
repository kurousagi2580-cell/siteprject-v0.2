import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { CharacterRelationshipPosition } from "@/types/character-relationship-position";

const actions = makeCrudActions<CharacterRelationshipPosition>(
  "character_relationship_positions",
  "character_id",
);

export async function createCharacterRelationshipPositionFromObject(
  payload: Record<string, any>,
) {
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateCharacterRelationshipPositionFromObject(
  id: string,
  payload: Record<string, any>,
) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteCharacterRelationshipPosition(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getCharacterRelationshipPositionById(id: string) {
  return await actions.getById(id);
}

export async function getCharacterRelationshipPositionList(opts?: {
  page?: number;
  pageSize?: number;
  diagramKey?: string;
}) {
  const filters = opts?.diagramKey ? { diagram_key: opts.diagramKey } : undefined;
  return await actions.list({
    page: opts?.page ?? 1,
    pageSize: opts?.pageSize ?? 100,
    filters,
    sort: "sort_order",
    order: "asc",
  });
}
