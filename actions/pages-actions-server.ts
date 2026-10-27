
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Page } from "@/types/page";

const actions = makeCrudActions<Page>("pages", "id");

export async function createPageFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.id) return { success: false, error: "id required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updatePageFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deletePage(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getPageById(id: string) {
  return await actions.getById(id);
}

export async function getPageBySlug(slug: string) {
  return await actions.getBySlug(slug);
}

export async function getPageByResource(resourceType: string, resourceId: string) {
  return await actions.list({
    filters: { resource_type: resourceType, resource_id: resourceId },
    page: 1,
    pageSize: 1,
    includeCount: false,
    sort: "updated_at",
    order: "desc",
  }).then((result) => result.items[0] ?? null);
}

export async function getPageList() {
  return await actions.list();
}