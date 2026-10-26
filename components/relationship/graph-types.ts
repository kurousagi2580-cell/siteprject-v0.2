import type { Edge, Node } from "@xyflow/react"

export type CharacterNodeData = {
  name: string
  image: string | null
  /** 選択中のキャラ */
  selected: boolean
  /** 選択中のキャラと関係のあるキャラ */
  active: boolean
  /** 選択・検索の対象外（薄く表示する） */
  dim: boolean
  editable: boolean
}
export type CharacterNode = Node<CharacterNodeData, "character">

export type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

export type FrameNodeData = {
  label: string
  color: string
  editable: boolean
  /** 最後に触った枠（リサイズ用のハンドルを表示する） */
  active: boolean
  onActivate: () => void
  /** 枠ごと移動（dx, dy はスタートからの移動量。ズームに依存しない座標系） */
  onMoveStart: () => void
  onMove: (dx: number, dy: number) => void
  onMoveEnd: () => void
  onResizeStart: () => void
  onResize: (dir: ResizeDir, dx: number, dy: number) => void
}
export type FrameNode = Node<FrameNodeData, "frame">

export type AppNode = CharacterNode | FrameNode

export type RelationEdgeData = {
  label: string
  description: string | null
  showLabel: boolean
  active: boolean
  /** 同じ2人の間に複数の関係があるとき、線を平行にずらす量(px) */
  offset: number
}
export type RelationEdge = Edge<RelationEdgeData, "floating">
