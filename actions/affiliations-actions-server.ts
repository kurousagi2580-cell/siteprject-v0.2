// src/actions/affiliations-actions.server.ts
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Affiliation } from "@/types/affiliation";

const actions = makeCrudActions<Affiliation>("affiliation", "name", {slugField: "slug", sourceField: "name"});

export async function createAffiliationFromObject(payload: Record<string, any>) {
  if (!payload.name) return { success: false, error: "name required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateAffiliationFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteAffiliation(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getAffiliationById(id: string) {
  return await actions.getById(id);
}

export async function getAffiliationList() {
  return await actions.list();
}
