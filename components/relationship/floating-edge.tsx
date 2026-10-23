"use client"

import {
  BaseEdge, EdgeLabelRenderer, getStraightPath, useInternalNode,
  type EdgeProps, type InternalNode,
} from "@xyflow/react"
import { cn } from "@/lib/utils/utils"
import type { RelationEdge } from "./graph-types"

function center(n: InternalNode) {
  return {
    x: n.internals.positionAbsolute.x + (n.measured.width ?? 0) / 2,
    y: n.internals.positionAbsolute.y + (n.measured.height ?? 0) / 2,
  }
}

/**
 * ノードの矩形と「相手に向かう直線（中心線を offset だけ平行移動したもの）」の交点。
 * offset が 0 なら、中心どうしを結ぶ線がノードの縁と交わる点になる。
 */
function exitPoint(node: InternalNode, other: InternalNode, offset: number) {
  const c = center(node)
  const o = center(other)
  const dx = o.x - c.x
  const dy = o.y - c.y
  const len = Math.hypot(dx, dy) || 1
  const ox = (-dy / len) * offset
  const oy = (dx / len) * offset
  const hw = (node.measured.width ?? 0) / 2
  const hh = (node.measured.height ?? 0) / 2

  const tx = dx === 0 ? Infinity : (hw - ox * Math.sign(dx)) / Math.abs(dx)
  const ty = dy === 0 ? Infinity : (hh - oy * Math.sign(dy)) / Math.abs(dy)
  const t = Math.min(tx, ty)
  return Number.isFinite(t)
    ? { x: c.x + ox + dx * t, y: c.y + oy + dy * t }
    : { x: c.x + ox, y: c.y + oy }
}

export function FloatingEdge({ id, source, target, data, markerStart, markerEnd, style }: EdgeProps<RelationEdge>) {
  const s = useInternalNode(source)
  const t = useInternalNode(target)
  if (!s || !t) return null

  const offset = data?.offset ?? 0
  const a = exitPoint(s, t, offset)
  // 相手側から見ると左右が逆になるので符号を反転すると、同じ側にずれる
  const b = exitPoint(t, s, -offset)
  const [path, labelX, labelY] = getStraightPath({ sourceX: a.x, sourceY: a.y, targetX: b.x, targetY: b.y })

  return (
    <>
      <BaseEdge id={id} path={path} markerStart={markerStart} markerEnd={markerEnd} style={style} />
      {data?.showLabel && data.label && (
        <EdgeLabelRenderer>
          <div
            title={data.description ?? undefined}
            className={cn(
              "nodrag nopan pointer-events-auto absolute max-w-40 truncate rounded-sm border bg-ananta-surface2 px-1.5 py-0.5 text-[10px]",
              data.active ? "border-ananta-accent/50 text-ananta-text" : "border-ananta-border text-ananta-muted",
            )}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
