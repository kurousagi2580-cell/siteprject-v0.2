import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { Word } from "@/types/word";

const actions = makeCrudActions<Word>("words", "keyword", {
  slugField: "slug",
  sourceField: "keyword",
});

export async function createWordFromObject(payload: Record<string, any>) {
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateWordFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteWord(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getWordById(id: string) {
  return await actions.getById(id);
}

export async function getWordBySlug(slug: string) {
  return await actions.getBySlug(slug);
}

export async function getWordList(opts?: { page?: number; pageSize?: number }) {
  return await actions.list({
    page: opts?.page ?? 1,
    pageSize: opts?.pageSize ?? 20,
    sort: "created_at",
    order: "desc",
  });
}
