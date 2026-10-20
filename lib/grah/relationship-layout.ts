import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3-force"

const NODE_W = 112 // ノードのおおよその大きさ（左上に合わせるために使う）
const NODE_H = 112

type SimNode = { id: string; x?: number; y?: number }
type SimLink = { source: string; target: string }

/** 関係の線でつながったキャラを、近すぎず離れすぎない位置に並べる（サーバー側で一度だけ計算） */
export function layoutNodes(ids: string[], links: SimLink[]) {
  const nodes: SimNode[] = ids.map((id) => ({ id }))
  const sim = forceSimulation(nodes)
    .force("link", forceLink<SimNode, SimLink>(links.map((l) => ({ ...l }))).id((d) => d.id).distance(240))
    .force("charge", forceManyBody().strength(-700))
    .force("center", forceCenter(0, 0))
    .force("collide", forceCollide(90))
    .stop()

  for (let i = 0; i < 300; i++) sim.tick()

  // d3 は中心座標を返すので、React Flow の基準（左上）に直す
  return new Map(
    nodes.map((n) => [n.id, { x: (n.x ?? 0) - NODE_W / 2, y: (n.y ?? 0) - NODE_H / 2 }]),
  )
}