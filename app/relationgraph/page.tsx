import { RelationshipGraph } from "@/components/ui/relationship-graph"
import { layoutNodes } from "@/lib/grah/relationship-layout"
import { createSupabaseServerClient } from "@/lib/supabase/server" // ← 既存の Supabase クライアントの取得方法に置き換える

// direction が「双方向」を表す値に合わせて変更する
const MUTUAL = new Set(["both", "bidirectional", "mutual"])

export default async function RelationsPage() {
  const supabase = await createSupabaseServerClient()

  const [chars, rels] = await Promise.all([
    supabase.from("characters").select("id, name, short_name, image_url, slug"),
    supabase
      .from("relationships")
      .select("id, character_id, target_character_id, relation_type, relation_description, direction"),
  ])
  if (chars.error) throw new Error(chars.error.message)
  if (rels.error) throw new Error(rels.error.message)

  const exists = new Set(chars.data.map((c) => String(c.id)))

  // 両端のキャラが存在する関係だけを使う
  const relations = rels.data
    .filter((r) => exists.has(String(r.character_id)) && exists.has(String(r.target_character_id)))
    .map((r) => ({
      id: String(r.id),
      source: String(r.character_id),
      target: String(r.target_character_id),
      label: r.relation_type ?? "",
      description: r.relation_description ?? null,
      mutual: MUTUAL.has(r.direction ?? ""),
    }))

  // 関係のあるキャラだけを表示する（関係のないキャラは出さない）
  const connected = new Set(relations.flatMap((r) => [r.source, r.target]))
  const targets = chars.data.filter((c) => connected.has(String(c.id)))

  const pos = layoutNodes(
    targets.map((c) => String(c.id)),
    relations.map((r) => ({ source: r.source, target: r.target })),
  )

  const characters = targets.map((c) => ({
    id: String(c.id),
    name: c.short_name ?? c.name,
    image: c.image_url,
    href: `/characters/${c.slug}`, // ← 実際のキャラ詳細ページの URL に合わせる
    ...pos.get(String(c.id))!,
  }))

  return <RelationshipGraph characters={characters} relations={relations} />
}