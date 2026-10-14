
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Character } from "@/types/character";

const actions = makeCrudActions<Character>("characters", "name", {slugField: "slug", sourceField: "name"});

export async function createCharacterFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.name) return { success: false, error: "name required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateCharacterFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteCharacter(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getCharacterById(id: string) {
  return await actions.getById(id);
}

export async function getCharacterBySlug(slug: string) {
  return await actions.getBySlug(slug);
}

export async function getCharacterByList() {
  return await actions.list();
}