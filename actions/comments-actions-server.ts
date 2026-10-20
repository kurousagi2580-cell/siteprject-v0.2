
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Comment, CommentView } from "@/types/comment";

const actions = makeCrudActions<Comment>("comments", "page_id", { publicCreate: true }); // 投稿だけ公開。更新・削除は管理者のみ
const view_actions = makeCrudActions<CommentView>("comments_view", "page_id"); // 公開してよいものだけのビュー

export async function createCommentFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.page_id) return { success: false, error: "page_id required" };
  const created = await actions.create(payload);
  const { ip: _ip, ...publicComment } = created;
  return { success: true, id: created.id, item: publicComment };
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
  return await view_actions.getById(id);
}

export async function getCommentList() {
  return await view_actions.list();
}

export async function getCommentListByPage(page_id: string) {
  return await view_actions.list({
  filters: page_id,
  page: 1,
  pageSize: 20,
  sort: "created_at",
  order: "desc"
});
}