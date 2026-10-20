
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Relationship } from "@/types/relationships";

const actions = makeCrudActions<Relationship>("relationships", "character_id");

export async function createRelationFromObject(payload: Record<string, any>) {
  if (!payload.character_id) return { success: false, error: "character_id required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateRelationFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteRelation(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getRelationById(id: string) {
  return await actions.getById(id);
}