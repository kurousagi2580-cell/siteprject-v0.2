
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Update } from "@/types/update";

const actions = makeCrudActions<Update>("updates", "id");

export async function createUpdateFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.id) return { success: false, error: "id required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateUpdateFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteUpdate(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getUpdateById(id: string) {
  return await actions.getById(id);
}