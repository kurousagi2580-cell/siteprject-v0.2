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

export type FrameRect = { x: number; y: number; width: number; height: number }

/** 陣営の枠。key は "aff:<所属ID>"（所属から自動）または "custom:<ID>"（自由枠） */
export type GraphFrame = {
  key: string
  affiliationId: string | null
  /** 所属名（自由枠は初期名） */
  defaultLabel: string
  /** 上書きした名前（null なら defaultLabel） */
  label: string | null
  /** 上書きした色（null なら自動） */
  color: string | null
  /** 手動で決めた位置と大きさ（null ならメンバーを囲む自動配置） */
  rect: FrameRect | null
  visible: boolean
  /** character_relationship_frames に保存済みの行があるか */
  hasRow: boolean
  /** 枠に含まれるキャラ（子の所属も含む）。自由枠は空 */
  memberIds: string[]
  /** 入れ子の深さ（子の所属を持たない = 0）。大きいほど外側の枠 */
  height: number
  parentKey: string | null
}

export type RelationshipGraphData = {
  diagramKey: string
  characters: GraphCharacter[]
  relations: GraphRelation[]
  frames: GraphFrame[]
}
