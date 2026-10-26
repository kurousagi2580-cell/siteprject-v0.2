import "server-only"

import { revalidatePath } from "next/cache"
import { createSupabaseSessionClient } from "@/lib/supabase/ssr"
import { getAdminUser } from "@/lib/auth/require-admin"

const TABLE = "character_relationship_frames"

export type FrameUpsert = {
  /** 自由枠のみ。クライアントで作った UUID */
  id?: string
  affiliation_id: string | null
  label: string | null
  color: string | null
  position_x: number | null
  position_y: number | null
  width: number | null
  height: number | null
  is_visible: boolean
}

/**
 * 陣営の枠の上書き設定を保存する（管理者のみ）。
 * - 所属の枠: (diagram_key, affiliation_id) で upsert
 * - 自由枠: id で upsert
 * - deleteIds: 自由枠の削除
 */
export async function saveCharacterRelationshipFrames(
  diagramKey: string,
  input: { upserts: FrameUpsert[]; deleteIds: string[] },
) {
  await getAdminUser()
  const supabase = await createSupabaseSessionClient()

  const toRow = (u: FrameUpsert) => ({
    diagram_key: diagramKey,
    affiliation_id: u.affiliation_id,
    label: u.label,
    color: u.color,
    position_x: u.position_x,
    position_y: u.position_y,
    width: u.width,
    height: u.height,
    is_visible: u.is_visible,
  })

  const byAffiliation = input.upserts.filter((u) => u.affiliation_id).map(toRow)
  const custom = input.upserts.filter((u) => !u.affiliation_id && u.id).map((u) => ({ id: u.id, ...toRow(u) }))

  if (byAffiliation.length > 0) {
    const { error } = await supabase.from(TABLE).upsert(byAffiliation, { onConflict: "diagram_key,affiliation_id" })
    if (error) throw error
  }
  if (custom.length > 0) {
    const { error } = await supabase.from(TABLE).upsert(custom, { onConflict: "id" })
    if (error) throw error
  }
  if (input.deleteIds.length > 0) {
    const { error } = await supabase.from(TABLE).delete().eq("diagram_key", diagramKey).in("id", input.deleteIds)
    if (error) throw error
  }

  revalidatePath("/relationgraph")
  return { success: true as const, saved: byAffiliation.length + custom.length, deleted: input.deleteIds.length }
}
