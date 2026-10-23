import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { CharacterRelationshipPosition } from "@/types/character-relationship-position";
import { revalidatePath } from "next/cache";
import { createSupabaseSessionClient } from "@/lib/supabase/ssr";
import { getAdminUser } from "@/lib/auth/require-admin";
import { parseAdminPayload } from "@/lib/validation/admin-payload";

const actions = makeCrudActions<CharacterRelationshipPosition>(
  "character_relationship_positions",
  "character_id",
);

export async function createCharacterRelationshipPositionFromObject(
  payload: Record<string, any>,
) {
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateCharacterRelationshipPositionFromObject(
  id: string,
  payload: Record<string, any>,
) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteCharacterRelationshipPosition(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getCharacterRelationshipPositionById(id: string) {
  return await actions.getById(id);
}

export async function getCharacterRelationshipPositionList(opts?: {
  page?: number;
  pageSize?: number;
  diagramKey?: string;
}) {
  const filters = opts?.diagramKey ? { diagram_key: opts.diagramKey } : undefined;
  return await actions.list({
    page: opts?.page ?? 1,
    pageSize: opts?.pageSize ?? 100,
    filters,
    sort: "sort_order",
    order: "asc",
  });
}

/**
 * 相関図の座標をまとめて保存する（管理者のみ）。
 * - (diagram_key, character_id) が一致する行は更新、なければ追加
 * - 書き込みはログイン中ユーザーの JWT で行うので、RLS（管理者のみ）も効く
 */
export async function upsertCharacterRelationshipPositions(
  diagramKey: string,
  positions: { character_id: string; position_x: number; position_y: number }[],
) {
  await getAdminUser();

  // 同じキャラが複数あると upsert が失敗するので、最後の値だけ使う
  const unique = new Map(positions.map((p) => [p.character_id, p] as const));
  const rows = Array.from(unique.values()).map((p) =>
    parseAdminPayload(
      "character_relationship_positions",
      {
        diagram_key: diagramKey,
        character_id: p.character_id,
        position_x: p.position_x,
        position_y: p.position_y,
        position_mode: "manual",
      },
      "create",
    ),
  );

  const supabase = await createSupabaseSessionClient();
  const { error } = await supabase
    .from("character_relationship_positions")
    .upsert(rows, { onConflict: "diagram_key,character_id" });
  if (error) throw error;

  revalidatePath("/relationgraph");
  return { success: true, saved: rows.length };
}
