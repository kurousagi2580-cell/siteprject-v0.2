
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Article } from "@/types/article";
import { items } from "@/lib/data";

const actions = makeCrudActions<Article>("articles", "title", {slugField: "slug", sourceField: "title"});

export async function createArticleFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.title) return { success: false, error: "title required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateArticleFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteArticle(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getArticleById(id: string) {
  return await actions.getById(id);
}

export async function getArticleBySlug(slug: string) {
  return await actions.getBySlug(slug);
}

export async function getArticleList(opts?: { page?: number; pageSize?: number }) {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;

  const result = await actions.list({
    page,
    pageSize,
    sort: "created_at",
    order: "desc",
  });

  return { items:result.items, total: result.total ?? 0, page, pageSize };
}

export async function getArticleListByPage(page_id: string, opts?: { page?: number; pageSize?: number }) {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;

  // 必要なら page_id のバリデーションを追加
  if (!page_id) return { items: [], total: 0, page, pageSize };

  const result = await actions.list({
    filters: { page_id },
    page,
    pageSize,
    sort: "created_at",
    order: "desc",
  });

  return { items:result.items, total: result.total ?? 0, page, pageSize };
}