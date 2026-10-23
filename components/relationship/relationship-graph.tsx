"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Controls, MiniMap,
  MarkerType, useNodesState, useReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { Button } from "@/components/ui/button"
import { CardPanel } from "@/components/ui/card-panel"
import { layoutNodes, type Point } from "@/lib/grah/relationship-layout"
import type { GraphCharacter, GraphRelation, RelationshipGraphData } from "@/types/relationship-graph"
import { CharacterNodeView } from "./character-node"
import { FloatingEdge } from "./floating-edge"
import { RelationshipDetailPanel, type PanelRelation } from "./relationship-detail-panel"
import type { CharacterNode, RelationEdge } from "./graph-types"

/* コンポーネントの外で定義する */
const nodeTypes = { character: CharacterNodeView }
const edgeTypes = { floating: FloatingEdge }

// globals.css の --ananta-* と同じ値（SVG のマーカーは CSS 変数が使えないため直接書く）
const LINE = { normal: "#5E6A78", dim: "#262E39", active: "#B9FF3D" } as const
const TYPE_ORDER = ["プレイアブル", "NPC", "調査中"]
const ALWAYS_LABEL_MAX = 30 // 関係がこの件数以下なら、選択しなくてもラベルを常に表示する
const PARALLEL_GAP = 22

// React Flow の色をサイトのダークテーマに合わせる
const FLOW_STYLE = {
  "--xy-background-color-default": "transparent",
  "--xy-controls-button-background-color-default": "#1B222C",
  "--xy-controls-button-background-color-hover-default": "#252E3A",
  "--xy-controls-button-color-default": "#F1F4F5",
  "--xy-controls-button-border-color-default": "rgba(255,255,255,0.12)",
} as CSSProperties

const chipClass = (selected: boolean) =>
  `rounded border px-3 py-1.5 text-sm transition ${
    selected
      ? "border-ananta-accent bg-ananta-accent font-bold text-black"
      : "border-ananta-border bg-ananta-surface2 text-ananta-text hover:border-ananta-accent/60"
  }`

function toNode(c: GraphCharacter, editable: boolean): CharacterNode {
  return {
    id: c.id,
    type: "character",
    position: { x: c.x, y: c.y },
    data: { name: c.name, image: c.image, selected: false, active: false, dim: false, editable },
  }
}

type Props = RelationshipGraphData & { editable?: boolean }

export function RelationshipGraph(props: Props) {
  if (props.characters.length === 0) {
    return (
      <p className="rounded-xl border border-ananta-border/60 bg-ananta-surface/50 px-4 py-10 text-center text-sm text-ananta-muted">
        表示できる関係データがありません。
      </p>
    )
  }
  return (
    <ReactFlowProvider>
      <Graph {...props} />
    </ReactFlowProvider>
  )
}

function Graph({ characters, relations, diagramKey, editable = false }: Props) {
  const { fitView } = useReactFlow()
  const searchParams = useSearchParams()

  const [initialNodes] = useState(() => characters.map((c) => toNode(c, editable)))
  const [nodes, setNodes, onNodesChange] = useNodesState<CharacterNode>(initialNodes)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [affiliationFilter, setAffiliationFilter] = useState("")
  const [query, setQuery] = useState("")

  // 編集モード用：未保存の座標 / 保存済みの座標 / 保存状況
  const [dirty, setDirty] = useState<Map<string, Point>>(() => new Map())
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const savedRef = useRef<Map<string, Point>>(
    new Map(characters.map((c): [string, Point] => [c.id, { x: c.x, y: c.y }])),
  )

  const byId = useMemo(
    () => new Map(characters.map((c): [string, GraphCharacter] => [c.id, c])),
    [characters],
  )

  /* ---- フィルター ---- */
  const typeOptions = useMemo(() => {
    const present = Array.from(new Set(characters.map((c) => c.type).filter((t): t is string => !!t)))
    const order = (t: string) => {
      const i = TYPE_ORDER.indexOf(t)
      return i === -1 ? TYPE_ORDER.length : i
    }
    return present.sort((a, b) => order(a) - order(b) || a.localeCompare(b, "ja"))
  }, [characters])

  const affiliationOptions = useMemo(
    () =>
      Array.from(new Set(characters.map((c) => c.affiliation).filter((a): a is string => !!a))).sort((a, b) =>
        a.localeCompare(b, "ja"),
      ),
    [characters],
  )

  const visibleIds = useMemo(
    () =>
      new Set(
        characters
          .filter(
            (c) =>
              (!typeFilter || c.type === typeFilter) &&
              (!affiliationFilter || c.affiliation === affiliationFilter),
          )
          .map((c) => c.id),
      ),
    [characters, typeFilter, affiliationFilter],
  )

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return new Set(
      characters
        .filter((c) => c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q))
        .map((c) => c.id),
    )
  }, [characters, query])

  // 絞り込みで非表示になったキャラは選択扱いにしない
  const focusId = selectedId && visibleIds.has(selectedId) ? selectedId : null

  const neighborIds = useMemo(() => {
    const set = new Set<string>()
    if (!focusId) return set
    for (const r of relations) {
      if (r.source === focusId) set.add(r.target)
      else if (r.target === focusId) set.add(r.source)
    }
    return set
  }, [relations, focusId])

  /* ---- 同じ2人の間に複数の関係があるとき、線を平行にずらす ---- */
  const offsets = useMemo(() => {
    const groups = new Map<string, GraphRelation[]>()
    for (const r of relations) {
      const key = r.source < r.target ? `${r.source}|${r.target}` : `${r.target}|${r.source}`
      const list = groups.get(key)
      if (list) list.push(r)
      else groups.set(key, [r])
    }
    const result = new Map<string, number>()
    groups.forEach((list) => {
      list.forEach((r, i) => {
        const base = (i - (list.length - 1) / 2) * PARALLEL_GAP
        // 向きに依存しないよう、id の小さい側から見た向きに揃える
        result.set(r.id, r.source < r.target ? base : -base)
      })
    })
    return result
  }, [relations])

  /* ---- 表示用のノード・エッジ ---- */
  const displayNodes = useMemo<CharacterNode[]>(
    () =>
      nodes.map((n) => {
        const selected = n.id === focusId
        const active = !!focusId && (selected || neighborIds.has(n.id))
        const dim = focusId ? !active : matchIds ? !matchIds.has(n.id) : false
        return { ...n, hidden: !visibleIds.has(n.id), data: { ...n.data, selected, active, dim, editable } }
      }),
    [nodes, visibleIds, focusId, neighborIds, matchIds, editable],
  )

  const showAllLabels = relations.length <= ALWAYS_LABEL_MAX
  const edges = useMemo<RelationEdge[]>(
    () =>
      relations.map((r) => {
        const hidden = !visibleIds.has(r.source) || !visibleIds.has(r.target)
        const active = !!focusId && (r.source === focusId || r.target === focusId)
        const dim = focusId ? !active : matchIds ? !(matchIds.has(r.source) || matchIds.has(r.target)) : false
        const color = active ? LINE.active : dim ? LINE.dim : LINE.normal
        const arrow = { type: MarkerType.ArrowClosed, width: 14, height: 14, color, markerUnits: "userSpaceOnUse" }
        return {
          id: r.id,
          type: "floating",
          source: r.source,
          target: r.target,
          hidden,
          zIndex: active ? 10 : 0,
          style: { stroke: color, strokeWidth: 1 + r.strength * 0.5 + (active ? 0.5 : 0) },
          markerEnd: arrow,
          markerStart: r.mutual ? arrow : undefined,
          data: {
            label: r.label,
            description: r.description,
            active,
            offset: offsets.get(r.id) ?? 0,
            showLabel: active || (!focusId && !matchIds && showAllLabels),
          },
        }
      }),
    [relations, visibleIds, focusId, matchIds, offsets, showAllLabels],
  )

  const visibleEdgeCount = useMemo(() => edges.filter((e) => !e.hidden).length, [edges])

  const panelRelations = useMemo(
    () =>
      relations.flatMap((r): PanelRelation[] => {
        if (!focusId || (r.source !== focusId && r.target !== focusId)) return []
        const partner = byId.get(r.source === focusId ? r.target : r.source)
        if (!partner || !visibleIds.has(partner.id)) return []
        return [
          {
            id: r.id,
            partner,
            label: r.label,
            description: r.description,
            direction: r.mutual ? "mutual" : r.source === focusId ? "out" : "in",
          },
        ]
      }),
    [relations, focusId, byId, visibleIds],
  )

  /* ---- 操作 ---- */
  // 選んだキャラと、その関係先が収まるようにズームする
  const focusOn = useCallback(
    (id: string) => {
      setSelectedId(id)
      const ids = new Set<string>([id])
      for (const r of relations) {
        if (r.source === id) ids.add(r.target)
        else if (r.target === id) ids.add(r.source)
      }
      fitView({ nodes: Array.from(ids).map((nid) => ({ id: nid })), duration: 500, padding: 0.3, maxZoom: 1.2 })
    },
    [fitView, relations],
  )

  // 詳細ページからのリンク（/relationgraph?character=<slug>）：そのキャラを選択した状態で開く。
  // グラフ内にいなければ何もしない（選択なし）
  const focusParam = searchParams.get("character")
  useEffect(() => {
    if (!focusParam) return
    const target = characters.find((c) => c.slug === focusParam)
    if (!target) return
    setSelectedId(target.id)
    // ノードの計測が終わってからズームする
    const t = window.setTimeout(() => focusOn(target.id), 300)
    return () => window.clearTimeout(t)
  }, [focusParam, characters, focusOn])

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || !matchIds) return // IME 確定の Enter は無視
    const first = characters.find((c) => matchIds.has(c.id) && visibleIds.has(c.id))
    if (first) focusOn(first.id)
  }

  // 絞り込みを変えたら、残ったキャラが収まるように表示を合わせる
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const t = window.setTimeout(() => fitView({ duration: 300, padding: 0.15 }), 50)
    return () => window.clearTimeout(t)
  }, [typeFilter, affiliationFilter, fitView])

  /* ---- 編集（管理者のみ） ---- */
  useEffect(() => {
    if (!editable || dirty.size === 0) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [editable, dirty.size])

  const save = useCallback(async () => {
    if (dirty.size === 0 || saving) return
    setSaving(true)
    setStatus(null)
    const entries = Array.from(dirty)
    try {
      const res = await fetch("/api/admin/relationship-positions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagram_key: diagramKey,
          positions: entries.map(([id, p]) => ({
            character_id: id,
            position_x: Math.round(p.x),
            position_y: Math.round(p.y),
          })),
        }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.error ?? `HTTP ${res.status}`)

      for (const [id, p] of entries) savedRef.current.set(id, p)
      // 保存中にさらに動かした分は未保存のまま残す
      setDirty((prev) => {
        const next = new Map(prev)
        for (const [id, p] of entries) {
          const cur = next.get(id)
          if (cur && cur.x === p.x && cur.y === p.y) next.delete(id)
        }
        return next
      })
      setStatus({ kind: "ok", text: `${entries.length} 人の位置を保存しました` })
    } catch (e) {
      setStatus({ kind: "error", text: e instanceof Error ? e.message : "保存に失敗しました" })
    } finally {
      setSaving(false)
    }
  }, [dirty, saving, diagramKey])

  const discard = () => {
    setNodes((ns) => ns.map((n) => ({ ...n, position: savedRef.current.get(n.id) ?? n.position })))
    setDirty(new Map())
    setStatus(null)
  }

  const autoLayout = () => {
    if (!window.confirm("全員の位置を自動配置で並べ直します（保存するまで確定しません）。よろしいですか？")) return
    const pos = layoutNodes(
      characters.map((c) => c.id),
      relations.map((r) => ({ source: r.source, target: r.target })),
    )
    setNodes((ns) => ns.map((n) => ({ ...n, position: pos.get(n.id) ?? n.position })))
    setDirty(new Map(pos))
    setStatus(null)
    window.setTimeout(() => fitView({ duration: 400, padding: 0.15 }), 50)
  }

  return (
    <div className="space-y-4">
      {/* ツールバー */}
      <CardPanel className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-pressed={typeFilter === null} onClick={() => setTypeFilter(null)} className={chipClass(typeFilter === null)}>
            ALL
          </button>
          {typeOptions.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={typeFilter === t}
              onClick={() => setTypeFilter(typeFilter === t ? null : t)}
              className={chipClass(typeFilter === t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {affiliationOptions.length > 0 && (
            <label className="flex min-w-0 items-center gap-3">
              <span className="w-12 shrink-0 text-sm text-ananta-muted">所属</span>
              <select
                value={affiliationFilter}
                onChange={(e) => setAffiliationFilter(e.target.value)}
                className="h-10 min-w-0 flex-1 rounded-lg border border-ananta-border bg-ananta-surface2 px-3 text-sm text-ananta-text outline-none focus:border-ananta-accent"
              >
                <option value="">すべて</option>
                {affiliationOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="relative min-w-0">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ananta-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="キャラクター名で探す（Enter で移動）"
              aria-label="キャラクター名で探す"
              className="h-10 w-full rounded-md border border-ananta-border bg-ananta-surface2/80 pl-9 pr-3 text-sm text-ananta-text outline-none transition-colors placeholder:text-ananta-muted/70 focus:border-ananta-accent focus:ring-1 focus:ring-ananta-accent"
            />
          </div>
        </div>

        {editable && (
          <div className="flex flex-wrap items-center gap-2 border-t border-ananta-border/50 pt-3">
            <Button onClick={save} disabled={dirty.size === 0 || saving}>
              {saving ? "保存中…" : "保存"}
            </Button>
            <Button variant="outline" onClick={discard} disabled={dirty.size === 0 || saving}>
              変更を破棄
            </Button>
            <Button variant="outline" onClick={autoLayout} disabled={saving}>
              自動配置し直す
            </Button>
            <span aria-live="polite" className="text-sm text-ananta-muted">
              {dirty.size > 0 ? `未保存の変更 ${dirty.size} 件` : "未保存の変更なし"}
            </span>
            {status && (
              <span className={`text-sm ${status.kind === "ok" ? "text-ananta-accent" : "text-destructive"}`}>
                {status.text}
              </span>
            )}
          </div>
        )}
      </CardPanel>

      <p className="text-sm text-ananta-muted" aria-live="polite">
        {visibleIds.size} 人 / {visibleEdgeCount} 件の関係
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* 親に高さが必要。ないと何も表示されない */}
        <div className="h-[70vh] min-h-[480px] w-full overflow-hidden rounded-lg border border-ananta-border/60 bg-ananta-surface/60">
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onNodeClick={(_, node) => setSelectedId((cur) => (cur === node.id ? null : node.id))}
            onPaneClick={() => setSelectedId(null)}
            onNodeDragStop={
              editable
                ? (_, node) => setDirty((prev) => new Map(prev).set(node.id, { x: node.position.x, y: node.position.y }))
                : undefined
            }
            nodesDraggable={editable}
            nodesConnectable={false}
            elementsSelectable={false}
            colorMode="dark"
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.15}
            maxZoom={1.8}
            style={FLOW_STYLE}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.10)" />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              className="hidden sm:block"
              nodeColor={(n) => (n.id === focusId ? LINE.active : LINE.normal)}
              maskColor="rgba(13,17,23,0.7)"
              style={{ backgroundColor: "#1B222C" }}
            />
          </ReactFlow>
        </div>

        <RelationshipDetailPanel
          character={focusId ? (byId.get(focusId) ?? null) : null}
          relations={panelRelations}
          editable={editable}
          onSelect={focusOn}
          onClose={() => setSelectedId(null)}
        />
      </div>

      <p className="text-xs text-ananta-muted">
        矢印は関係の向き（両端に矢印があるものは双方向）、線の太さは関係の強さを表します。
      </p>
    </div>
  )
}
