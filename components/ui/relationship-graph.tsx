"use client"

import { useRouter } from "next/navigation"
import {
  ReactFlow, Background, Controls, Handle, Position, MarkerType,
  BaseEdge, EdgeLabelRenderer, getStraightPath, useInternalNode,
  useNodesState, useEdgesState,
  type Node, type Edge, type NodeProps, type EdgeProps, type InternalNode,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { AppImage } from "@/components/app-image"
import { SiteShell } from "../layout/site-shell"

export type GraphCharacter = { id: string; name: string; image: string | null; href: string; x: number; y: number }
export type GraphRelation = { id: string; source: string; target: string; label: string; description: string | null; mutual: boolean }

type CharacterNode = Node<{ name: string; image: string | null; href: string }, "character">
type RelationEdge = Edge<{ label: string; description: string | null }, "floating">

/* ---- ノード：丸い画像＋名前 ---- */
function CharacterNodeView({ data }: NodeProps<CharacterNode>) {
  const hidden = { top: "50%", left: "50%", opacity: 0 } as const
  return (
    <div className="flex w-28 cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-ananta-border bg-ananta-surface px-2 py-3 text-center transition hover:border-ananta-accent">
      <Handle type="target" position={Position.Top} isConnectable={false} style={hidden} />
      <div className="relative size-14 overflow-hidden rounded-full border border-ananta-accent/40 bg-ananta-surface2">
        {data.image && <AppImage src={data.image} alt="" fill sizes="56px" className="object-cover" />}
      </div>
      <span className="text-xs font-medium text-ananta-text">{data.name}</span>
      <Handle type="source" position={Position.Bottom} isConnectable={false} style={hidden} />
    </div>
  )
}

/* ---- エッジ：ノードの縁から縁へ引く直線＋ラベル ---- */
function center(n: InternalNode) {
  return {
    x: n.internals.positionAbsolute.x + (n.measured.width ?? 0) / 2,
    y: n.internals.positionAbsolute.y + (n.measured.height ?? 0) / 2,
  }
}

function borderPoint(n: InternalNode, other: InternalNode) {
  const c = center(n)
  const o = center(other)
  const dx = o.x - c.x
  const dy = o.y - c.y
  const scale = Math.min(((n.measured.width ?? 0) / 2) / Math.abs(dx), ((n.measured.height ?? 0) / 2) / Math.abs(dy))
  return Number.isFinite(scale) ? { x: c.x + dx * scale, y: c.y + dy * scale } : c
}

function FloatingEdge({ id, source, target, data, markerStart, markerEnd, style }: EdgeProps<RelationEdge>) {
  const s = useInternalNode(source)
  const t = useInternalNode(target)
  if (!s || !t) return null

  const a = borderPoint(s, t)
  const b = borderPoint(t, s)
  const [path, labelX, labelY] = getStraightPath({ sourceX: a.x, sourceY: a.y, targetX: b.x, targetY: b.y })

  return (
    <>
      <BaseEdge id={id} path={path} markerStart={markerStart} markerEnd={markerEnd} style={style} />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            title={data.description ?? undefined}
            className="nodrag nopan pointer-events-auto absolute rounded bg-ananta-surface px-1.5 py-0.5 text-[10px] text-ananta-muted"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

/* コンポーネントの外で定義する */
const nodeTypes = { character: CharacterNodeView }
const edgeTypes = { floating: FloatingEdge }

export function RelationshipGraph({ characters, relations }: { characters: GraphCharacter[]; relations: GraphRelation[] }) {
  const router = useRouter()

  const [nodes, , onNodesChange] = useNodesState<CharacterNode>(
    characters.map((c) => ({
      id: c.id,
      type: "character",
      position: { x: c.x, y: c.y },
      data: { name: c.name, image: c.image, href: c.href },
    })),
  )

  const [edges, , onEdgesChange] = useEdgesState<RelationEdge>(
    relations.map((r) => ({
      id: r.id,
      type: "floating",
      source: r.source,
      target: r.target,
      data: { label: r.label, description: r.description },
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
      markerStart: r.mutual ? { type: MarkerType.ArrowClosed, width: 18, height: 18 } : undefined,
    })),
  )

  return (
    // 親に高さが必要。ないと何も表示されない
    <SiteShell>
    <div className="h-[70vh] w-full overflow-hidden rounded-xl border border-ananta-border bg-ananta-surface/60">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => router.push(node.data.href)}
        nodesConnectable={false}
        colorMode="dark"
        fitView
        minZoom={0.2}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
    </SiteShell>
  )
}