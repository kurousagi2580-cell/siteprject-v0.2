
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { UpdateLog } from "@/types/updatelog";

const actions = makeCrudActions<UpdateLog>("updateslog", "id");

export async function createUpdateLogFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.id) return { success: false, error: "id required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateUpdateLogFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteUpdateLog(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getUpdateLogById(id: string) {
  return await actions.getById(id);
}

export async function getUpdateLogListByType(type: string) {
  // updateslog には `type` 列がないため、一覧取得はそのまま全件を返す。
  // 既存の呼び出し側が `type` を渡しているが、DB には対応列がないため、
  // ここで簡易的に未使用扱いにしてビルドと表示を安定させる。
  void type;

  return await actions.list({
    page: 1,
    pageSize: 20,
    sort: "created_at",
    order: "desc"
  });
}