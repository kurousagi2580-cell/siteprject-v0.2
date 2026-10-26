import { createSupabaseServerClient } from "@/lib/supabase/server"
import { layoutNodes, type Point } from "@/lib/grah/relationship-layout"
import { frameLayoutGroups } from "@/lib/grah/frame-style"
import type { FrameRect, GraphFrame, RelationshipGraphData } from "@/types/relationship-graph"

export const DEFAULT_DIAGRAM_KEY = "main"

const supabase = createSupabaseServerClient()

type CharacterRow = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  slug: string | null
  type: string | null
  affiliation_id: string | null
  affiliation: { name: string | null } | { name: string | null }[] | null
}

type RelationRow = {
  id: string
  character_id: string | null
  target_character_id: string | null
  relation_type: string | null
  relation_description: string | null
  direction: string | null
  strength: number | null
}

type AffiliationRow = {
  id: string
  name: string | null
  short_name: string | null
  parent_affiliation_id: string | null
}

type FrameRow = {
  id: string
  affiliation_id: string | null
  label: string | null
  color: string | null
  position_x: number | null
  position_y: number | null
  width: number | null
  height: number | null
  is_visible: boolean
}

type PositionRow = {
  character_id: string
  position_x: number
  position_y: number
  is_visible: boolean
}

/** 相関図の表示に必要なデータ（キャラ・関係・保存済み座標）をまとめて取得する */
export async function getRelationshipGraphData(
  diagramKey: string = DEFAULT_DIAGRAM_KEY,
): Promise<RelationshipGraphData> {
  const [chars, rels, poss, affs, frs] = await Promise.all([
    supabase
      .from("characters")
      .select("id, name, short_name, image_url, slug, type, affiliation_id, affiliation:affiliation_id ( name )"),
    supabase
      .from("relationships")
      .select("id, character_id, target_character_id, relation_type, relation_description, direction, strength")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("character_relationship_positions")
      .select("character_id, position_x, position_y, is_visible")
      .eq("diagram_key", diagramKey),
    supabase.from("affiliation").select("id, name, short_name, parent_affiliation_id"),
    supabase
      .from("character_relationship_frames")
      .select("id, affiliation_id, label, color, position_x, position_y, width, height, is_visible")
      .eq("diagram_key", diagramKey),
  ])
  if (chars.error) throw chars.error
  if (rels.error) throw rels.error
  if (poss.error) throw poss.error
  if (affs.error) throw affs.error
  // 枠のテーブルがまだ無い（マイグレーション未適用）場合でも、相関図そのものは表示する
  if (frs.error) console.error("character_relationship_frames の取得に失敗:", frs.error)

  const positionRows = (poss.data ?? []) as unknown as PositionRow[]
  const hiddenIds = new Set(positionRows.filter((p) => !p.is_visible).map((p) => p.character_id))

  const characterRows = ((chars.data ?? []) as unknown as CharacterRow[]).filter((c) => !hiddenIds.has(c.id))
  const exists = new Set(characterRows.map((c) => c.id))

  // 両端のキャラが存在し、自分自身への関係ではないものだけ使う
  const relations = ((rels.data ?? []) as unknown as RelationRow[])
    .filter(
      (r): r is RelationRow & { character_id: string; target_character_id: string } =>
        !!r.character_id &&
        !!r.target_character_id &&
        r.character_id !== r.target_character_id &&
        exists.has(r.character_id) &&
        exists.has(r.target_character_id),
    )
    .map((r) => ({
      id: r.id,
      source: r.character_id,
      target: r.target_character_id,
      label: r.relation_type?.trim() ?? "",
      description: r.relation_description?.trim() || null,
      mutual: r.direction === "two-way",
      strength: Math.min(5, Math.max(1, r.strength ?? 3)),
    }))

  // 関係のあるキャラだけを表示する
  const connected = new Set(relations.flatMap((r) => [r.source, r.target]))
  const targets = characterRows.filter((c) => connected.has(c.id))

  const saved = new Map<string, Point>()
  for (const p of positionRows) {
    if (connected.has(p.character_id)) saved.set(p.character_id, { x: p.position_x, y: p.position_y })
  }

  const frames = buildFrames(
    targets,
    (affs.data ?? []) as unknown as AffiliationRow[],
    frs.error ? [] : ((frs.data ?? []) as unknown as FrameRow[]),
  )

  const pos = layoutNodes(
    targets.map((c) => c.id),
    relations.map((r) => ({ source: r.source, target: r.target })),
    saved,
    frameLayoutGroups(frames),
  )

  const characters = targets.map((c) => {
    const affiliation = Array.isArray(c.affiliation) ? c.affiliation[0] : c.affiliation
    const p = pos.get(c.id) ?? { x: 0, y: 0 }
    return {
      id: c.id,
      name: c.short_name?.trim() || c.name,
      fullName: c.name,
      image: c.image_url?.trim() || null,
      slug: c.slug,
      href: c.slug ? `/characters/${c.slug}` : null,
      type: c.type,
      affiliation: affiliation?.name?.trim() || null,
      x: p.x,
      y: p.y,
      manual: saved.has(c.id),
    }
  })

  return { diagramKey, characters, relations, frames }
}

function rectOf(row?: FrameRow): FrameRect | null {
  if (!row || row.position_x == null || row.position_y == null || row.width == null || row.height == null) return null
  return { x: row.position_x, y: row.position_y, width: row.width, height: row.height }
}

/**
 * 所属（親子関係あり）から枠の一覧を作る。
 * - メンバーが1人以上いる所属が枠になる。子の所属のメンバーは親の枠にも含まれる
 * - 表示するかどうかは、上書きの行があればその値、なければ「2人以上いるか」
 * - 上書きの行に位置があれば手動配置、なければメンバーを囲む自動配置
 */
function buildFrames(targets: CharacterRow[], affs: AffiliationRow[], rows: FrameRow[]): GraphFrame[] {
  const affById = new Map(affs.map((a): [string, AffiliationRow] => [a.id, a]))

  const direct = new Map<string, string[]>()
  for (const c of targets) {
    if (!c.affiliation_id || !affById.has(c.affiliation_id)) continue
    const list = direct.get(c.affiliation_id)
    if (list) list.push(c.id)
    else direct.set(c.affiliation_id, [c.id])
  }

  const children = new Map<string, string[]>()
  for (const a of affs) {
    const parent = a.parent_affiliation_id
    if (!parent || parent === a.id || !affById.has(parent)) continue
    const list = children.get(parent)
    if (list) list.push(a.id)
    else children.set(parent, [a.id])
  }

  // 子孫のメンバーまで含めたメンバー一覧と、入れ子の深さ
  const memo = new Map<string, { members: string[]; height: number }>()
  const resolving = new Set<string>()
  const resolve = (id: string): { members: string[]; height: number } => {
    const hit = memo.get(id)
    if (hit) return hit
    if (resolving.has(id)) return { members: [], height: 0 } // 親子が循環していても止まるように
    resolving.add(id)
    const members = [...(direct.get(id) ?? [])]
    let height = 0
    for (const child of children.get(id) ?? []) {
      const r = resolve(child)
      if (r.members.length > 0) {
        members.push(...r.members)
        height = Math.max(height, r.height + 1)
      }
    }
    resolving.delete(id)
    const result = { members: Array.from(new Set(members)), height }
    memo.set(id, result)
    return result
  }

  const rowByAffiliation = new Map<string, FrameRow>()
  for (const r of rows) if (r.affiliation_id) rowByAffiliation.set(r.affiliation_id, r)

  const frames: GraphFrame[] = []
  for (const a of affs) {
    const { members, height } = resolve(a.id)
    if (members.length === 0) continue
    const row = rowByAffiliation.get(a.id)
    frames.push({
      key: `aff:${a.id}`,
      affiliationId: a.id,
      defaultLabel: a.name?.trim() || a.short_name?.trim() || "（名称なし）",
      label: row?.label?.trim() || null,
      color: row?.color ?? null,
      rect: rectOf(row),
      visible: row ? row.is_visible : members.length >= 2,
      hasRow: !!row,
      memberIds: members,
      height,
      parentKey: a.parent_affiliation_id && affById.has(a.parent_affiliation_id) ? `aff:${a.parent_affiliation_id}` : null,
    })
  }

  // 自由に描いた枠
  for (const r of rows) {
    const rect = rectOf(r)
    if (r.affiliation_id || !rect) continue
    frames.push({
      key: `custom:${r.id}`,
      affiliationId: null,
      defaultLabel: r.label?.trim() || "枠",
      label: null,
      color: r.color,
      rect,
      visible: r.is_visible,
      hasRow: true,
      memberIds: [],
      height: 0,
      parentKey: null,
    })
  }

  // 外側の枠（深さが大きい）を先に並べる
  return frames.sort((a, b) => b.height - a.height || a.defaultLabel.localeCompare(b.defaultLabel, "ja"))
}
