
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Comment } from "@/types/comment";

const actions = makeCrudActions<Comment>("comments", "page_id");

export async function createCommentFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.page_id) return { success: false, error: "page_id required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateCommentFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteComment(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getCommentById(id: string) {
  return await actions.getById(id);
}

export async function getCommentList() {
  return await actions.list();
}

export async function getCommentListByPage(page_id: string) {
  return await actions.list({
  filters: page_id,
  page: 1,
  pageSize: 20,
  sort: "created_at",
  order: "desc"
});
}