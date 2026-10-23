export type GraphCharacter = {
  id: string
  /** ノードに表示する名前（short_name 優先） */
  name: string
  fullName: string
  image: string | null
  /** 詳細ページ用の slug（?character=<slug> で選択状態にするのに使う） */
  slug: string | null
  href: string | null
  type: string | null
  affiliation: string | null
  /** React Flow の座標（ノード左上） */
  x: number
  y: number
  /** character_relationship_positions に保存済みの座標を使っているか */
  manual: boolean
}

export type GraphRelation = {
  id: string
  source: string
  target: string
  label: string
  description: string | null
  /** direction = two-way */
  mutual: boolean
  /** 1〜5 */
  strength: number
}

export type RelationshipGraphData = {
  diagramKey: string
  characters: GraphCharacter[]
  relations: GraphRelation[]
}
