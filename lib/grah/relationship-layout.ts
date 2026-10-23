import {
  forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceY,
} from "d3-force"

export const NODE_W = 112 // ノードのおおよその大きさ（左上⇔中心の変換に使う）
export const NODE_H = 112

export type Point = { x: number; y: number }
type SimNode = { id: string; x?: number; y?: number; fx?: number | null; fy?: number | null }
type SimLink = { source: string; target: string }

/**
 * 関係の線でつながったキャラを、近すぎず離れすぎない位置に並べる。
 * - fixed: 保存済みの座標（左上基準）。これらは動かさず、残りのキャラだけを周りに配置する
 * - 戻り値は全キャラの座標（左上基準）
 */
export function layoutNodes(
  ids: string[],
  links: SimLink[],
  fixed: ReadonlyMap<string, Point> = new Map(),
): Map<string, Point> {
  const nodes: SimNode[] = ids.map((id) => {
    const p = fixed.get(id)
    if (!p) return { id }
    const cx = p.x + NODE_W / 2
    const cy = p.y + NODE_H / 2
    return { id, x: cx, y: cy, fx: cx, fy: cy }
  })
  const byId = new Map(nodes.map((n): [string, SimNode] => [n.id, n]))

  // 新しいキャラは、座標が保存済みの相手の近くから動かし始める
  nodes.forEach((n, i) => {
    if (n.fx != null) return
    for (const l of links) {
      const otherId = l.source === n.id ? l.target : l.target === n.id ? l.source : null
      const other = otherId ? byId.get(otherId) : undefined
      if (other && other.fx != null && other.fy != null) {
        const angle = i * 2.399963 // 黄金角でずらして重ならないようにする
        n.x = other.fx + Math.cos(angle) * 200
        n.y = other.fy + Math.sin(angle) * 200
        break
      }
    }
  })

  const fixedNodes = nodes.filter((n) => n.fx != null)
  const cx = fixedNodes.length ? fixedNodes.reduce((s, n) => s + (n.fx ?? 0), 0) / fixedNodes.length : 0
  const cy = fixedNodes.length ? fixedNodes.reduce((s, n) => s + (n.fy ?? 0), 0) / fixedNodes.length : 0

  const sim = forceSimulation<SimNode>(nodes)
    .force("link", forceLink<SimNode, SimLink>(links.map((l) => ({ ...l }))).id((d) => d.id).distance(240))
    .force("charge", forceManyBody().strength(-700))
    .force("collide", forceCollide(90))
    // つながりのないグループが遠くへ飛んでいかないように、弱く中心へ引く
    .force("x", forceX(cx).strength(0.04))
    .force("y", forceY(cy).strength(0.04))
    .stop()

  for (let i = 0; i < 300; i++) sim.tick()

  return new Map(
    nodes.map((n): [string, Point] => [
      n.id,
      fixed.get(n.id) ?? { x: (n.x ?? 0) - NODE_W / 2, y: (n.y ?? 0) - NODE_H / 2 },
    ]),
  )
}
