import { createSupabaseServerClient } from "@/lib/supabase/server"
import { layoutNodes, type Point } from "@/lib/grah/relationship-layout"
import type { RelationshipGraphData } from "@/types/relationship-graph"

export const DEFAULT_DIAGRAM_KEY = "main"

const supabase = createSupabaseServerClient()

type CharacterRow = {
  id: string
  name: string
  short_name: string | null
  image_url: string | null
  slug: string | null
  type: string | null
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
  const [chars, rels, poss] = await Promise.all([
    supabase.from("characters").select("id, name, short_name, image_url, slug, type, affiliation:affiliation_id ( name )"),
    supabase
      .from("relationships")
      .select("id, character_id, target_character_id, relation_type, relation_description, direction, strength")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("character_relationship_positions")
      .select("character_id, position_x, position_y, is_visible")
      .eq("diagram_key", diagramKey),
  ])
  if (chars.error) throw chars.error
  if (rels.error) throw rels.error
  if (poss.error) throw poss.error

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

  const pos = layoutNodes(
    targets.map((c) => c.id),
    relations.map((r) => ({ source: r.source, target: r.target })),
    saved,
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

  return { diagramKey, characters, relations }
}
