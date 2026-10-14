
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { NameMaps } from "@/types/namemaps";

const actions = makeCrudActions<NameMaps>("name_mappings", "source_text");

export async function createNameMappingsFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.source_text) return { success: false, error: "source_text required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateNameMappingsFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteNameMappings(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getNameMappingsById(id: string) {
  return await actions.getById(id);
}

export async function getNameMappingsList(opts?: { page?: number; pageSize?: number }) {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;

  const result = await actions.list({
    page,
    pageSize,
    sort: "created_at",
    order: "desc",
  });

  return result;
}