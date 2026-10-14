// src/actions/affiliations-actions.server.ts
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Region } from "@/types/region";

const actions = makeCrudActions<Region>("regions", "name");

export async function createRegionFromObject(payload: Record<string, any>) {
  if (!payload.name) return { success: false, error: "name required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateRegionFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteRegion(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getRegionById(id: string) {
  return await actions.getById(id);
}

export async function getRegionBySlug(slug: string) {
  return await actions.getBySlug(slug);
}

export async function getRegionList() {
  return await actions.list();
}
