
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Location } from "@/types/location";

const actions = makeCrudActions<Location>("locations", "name", {slugField: "slug", sourceField: "name"});

export async function createLocationFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.name) return { success: false, error: "name required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateLocationFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteLocation(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getLocationById(id: string) {
  return await actions.getById(id);
}