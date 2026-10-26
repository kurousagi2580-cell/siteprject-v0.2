"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant, Controls, MiniMap,
  MarkerType, useNodesState, useReactFlow, type OnNodesChange,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { Button } from "@/components/ui/button"
import { CardPanel } from "@/components/ui/card-panel"
import { layoutNodes, NODE_H, NODE_W, type Point } from "@/lib/grah/relationship-layout"
import {
  FRAME_MIN_H, FRAME_MIN_W, FRAME_PAD_BASE, FRAME_PAD_STEP, autoFrameColor, frameLayoutGroups,
} from "@/lib/grah/frame-style"
import type {
  FrameRect, GraphCharacter, GraphFrame, GraphRelation, RelationshipGraphData,
} from "@/types/relationship-graph"
import { CharacterNodeView } from "./character-node"
import { FloatingEdge } from "./floating-edge"
import { FrameNodeView } from "./frame-node"
import { FrameManager, type FramePatch } from "./frame-manager"
import { RelationshipDetailPanel, type PanelRelation } from "./relationship-detail-panel"
import type { AppNode, CharacterNode, FrameNode, RelationEdge, ResizeDir } from "./graph-types"

/* コンポーネントの外で定義する */
const nodeTypes = { character: CharacterNodeView, frame: FrameNodeView }
const edgeTypes = { floating: FloatingEdge }

// globals.css の --ananta-* と同じ値（SVG のマーカーは CSS 変数が使えないため直接書く）
const LINE = { normal: "#5E6A78", dim: "#262E39", active: "#B9FF3D" } as const
const TYPE_ORDER = ["プレイアブル", "NPC", "調査中"]
const ALWAYS_LABEL_MAX = 30 // 関係がこの件数以下なら、選択しなくてもラベルを常に表示する
const PARALLEL_GAP = 22
const CHARACTER_Z = 100 // 枠（zIndex 10 以下）より前に出す

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

function Graph({ characters, relations, frames: initialFrames, diagramKey, editable = false }: Props) {
  const { fitView, screenToFlowPosition } = useReactFlow()
  const searchParams = useSearchParams()
  const wrapRef = useRef<HTMLDivElement>(null)

  const [initialNodes] = useState(() => characters.map((c) => toNode(c, editable)))
  const [nodes, setNodes, onNodesChange] = useNodesState<CharacterNode>(initialNodes)
  const nodesRef = useRef<CharacterNode[]>(nodes)
  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [affiliationFilter, setAffiliationFilter] = useState("")
  const [query, setQuery] = useState("")

  // 編集モード用：未保存のキャラ座標 / 保存済みの座標 / 保存状況
  const [dirty, setDirty] = useState<Map<string, Point>>(() => new Map())
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null)
  const savedRef = useRef<Map<string, Point>>(
    new Map(characters.map((c): [string, Point] => [c.id, { x: c.x, y: c.y }])),
  )

  // 枠：現在の状態 / 未保存の枠 / 削除する自由枠の行ID / 最後に触った枠
  const [frames, setFrames] = useState<GraphFrame[]>(initialFrames)
  const savedFramesRef = useRef<GraphFrame[]>(initialFrames)
  const [frameDirty, setFrameDirty] = useState<Set<string>>(() => new Set())
  const [deletedFrameIds, setDeletedFrameIds] = useState<Set<string>>(() => new Set())
  const [activeFrameKey, setActiveFrameKey] = useState<string | null>(null)

  const changeCount = dirty.size + frameDirty.size + deletedFrameIds.size

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

  /* ---- 枠の位置と大きさ：手動ならその値、自動ならメンバー（表示中のキャラ）を囲む四角 ---- */
  const frameRects = useMemo(() => {
    const nodeById = new Map(nodes.map((n): [string, CharacterNode] => [n.id, n]))
    const result = new Map<string, FrameRect>()
    for (const f of frames) {
      if (!f.visible) continue
      const members = f.memberIds.filter((id) => visibleIds.has(id))
      if (f.affiliationId && members.length === 0) continue // 絞り込みで中身が無くなった枠は隠す
      if (f.rect) {
        result.set(f.key, f.rect)
        continue
      }
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const id of members) {
        const n = nodeById.get(id)
        if (!n) continue
        minX = Math.min(minX, n.position.x)
        minY = Math.min(minY, n.position.y)
        maxX = Math.max(maxX, n.position.x + (n.measured?.width ?? NODE_W))
        maxY = Math.max(maxY, n.position.y + (n.measured?.height ?? NODE_H))
      }
      if (!Number.isFinite(minX)) continue
      const pad = FRAME_PAD_BASE + FRAME_PAD_STEP * f.height // 外側の枠ほど余白を大きくして、入れ子にする
      result.set(f.key, { x: minX - pad, y: minY - pad, width: maxX - minX + pad * 2, height: maxY - minY + pad * 2 })
    }
    return result
  }, [frames, nodes, visibleIds])

  /* ---- 枠の編集（管理者のみ） ---- */
  const markFrameDirty = useCallback((key: string) => {
    setFrameDirty((prev) => (prev.has(key) ? prev : new Set(prev).add(key)))
  }, [])

  const updateFrame = useCallback(
    (key: string, patch: FramePatch) => {
      setFrames((fs) => fs.map((f) => (f.key === key ? { ...f, ...patch } : f)))
      markFrameDirty(key)
    },
    [markFrameDirty],
  )

  const resetFrameRect = useCallback(
    (key: string) => {
      setFrames((fs) => fs.map((f) => (f.key === key ? { ...f, rect: null } : f)))
      markFrameDirty(key)
    },
    [markFrameDirty],
  )

  const deleteFrame = useCallback(
    (key: string) => {
      const f = frames.find((x) => x.key === key)
      if (!f || f.affiliationId) return // 所属の枠は削除できない（非表示にする）
      if (f.hasRow) setDeletedFrameIds((prev) => new Set(prev).add(key.slice("custom:".length)))
      setFrames((fs) => fs.filter((x) => x.key !== key))
      setFrameDirty((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    },
    [frames],
  )

  const addFrame = useCallback(() => {
    const box = wrapRef.current?.getBoundingClientRect()
    const p = screenToFlowPosition({
      x: box ? box.left + box.width / 2 : window.innerWidth / 2,
      y: box ? box.top + box.height / 2 : window.innerHeight / 2,
    })
    const key = `custom:${crypto.randomUUID()}`
    setFrames((fs) => [
      ...fs,
      {
        key, affiliationId: null, defaultLabel: "新しい枠", label: null, color: null,
        rect: { x: p.x - 180, y: p.y - 130, width: 360, height: 260 },
        visible: true, hasRow: false, memberIds: [], height: 0, parentKey: null,
      },
    ])
    markFrameDirty(key)
    setActiveFrameKey(key)
  }, [screenToFlowPosition, markFrameDirty])

  // 枠ごと移動：スタート時点の座標を控えておき、移動量を足して絶対位置で反映する
  const frameMoveRef = useRef<{
    key: string
    chars: Map<string, Point>
    rects: Map<string, FrameRect>
    dx: number
    dy: number
  } | null>(null)

  const startFrameMove = useCallback(
    (key: string) => {
      const f = frames.find((x) => x.key === key)
      if (!f) return
      // 自分と、その中に入れ子になっている枠
      const keys = new Set([key])
      for (let grew = true; grew; ) {
        grew = false
        for (const g of frames) {
          if (g.parentKey && keys.has(g.parentKey) && !keys.has(g.key)) {
            keys.add(g.key)
            grew = true
          }
        }
      }
      const chars = new Map<string, Point>()
      for (const id of f.memberIds) {
        const n = nodesRef.current.find((x) => x.id === id)
        if (n) chars.set(id, { x: n.position.x, y: n.position.y })
      }
      const rects = new Map<string, FrameRect>()
      for (const g of frames) if (keys.has(g.key) && g.rect) rects.set(g.key, g.rect)
      frameMoveRef.current = { key, chars, rects, dx: 0, dy: 0 }
    },
    [frames],
  )

  const moveFrame = useCallback((dx: number, dy: number) => {
    const snap = frameMoveRef.current
    if (!snap) return
    snap.dx = dx
    snap.dy = dy
    if (snap.chars.size > 0) {
      setNodes((ns) =>
        ns.map((n) => {
          const p = snap.chars.get(n.id)
          return p ? { ...n, position: { x: p.x + dx, y: p.y + dy } } : n
        }),
      )
    }
    if (snap.rects.size > 0) {
      setFrames((fs) =>
        fs.map((f) => {
          const r = snap.rects.get(f.key)
          return r ? { ...f, rect: { ...r, x: r.x + dx, y: r.y + dy } } : f
        }),
      )
    }
  }, [setNodes])

  const endFrameMove = useCallback(() => {
    const snap = frameMoveRef.current
    frameMoveRef.current = null
    if (!snap || (snap.dx === 0 && snap.dy === 0)) return
    if (snap.chars.size > 0) {
      setDirty((prev) => {
        const next = new Map(prev)
        snap.chars.forEach((p, id) => next.set(id, { x: p.x + snap.dx, y: p.y + snap.dy }))
        return next
      })
    }
    if (snap.rects.size > 0) {
      setFrameDirty((prev) => {
        const next = new Set(prev)
        snap.rects.forEach((_, key) => next.add(key))
        return next
      })
    }
  }, [])

  // 大きさ変更：自動配置の枠も、触った時点で手動配置になる
  const frameResizeRef = useRef<{ key: string; start: FrameRect } | null>(null)

  const startFrameResize = useCallback(
    (key: string) => {
      const start = frameRects.get(key)
      frameResizeRef.current = start ? { key, start } : null
    },
    [frameRects],
  )

  const resizeFrame = useCallback(
    (dir: ResizeDir, dx: number, dy: number) => {
      const snap = frameResizeRef.current
      if (!snap) return
      const { start } = snap
      let { x, y, width, height } = start
      if (dir.includes("e")) width = Math.max(FRAME_MIN_W, start.width + dx)
      if (dir.includes("s")) height = Math.max(FRAME_MIN_H, start.height + dy)
      if (dir.includes("w")) {
        width = Math.max(FRAME_MIN_W, start.width - dx)
        x = start.x + start.width - width
      }
      if (dir.includes("n")) {
        height = Math.max(FRAME_MIN_H, start.height - dy)
        y = start.y + start.height - height
      }
      const rect = { x, y, width, height }
      setFrames((fs) => fs.map((f) => (f.key === snap.key ? { ...f, rect } : f)))
      markFrameDirty(snap.key)
    },
    [markFrameDirty],
  )

  /* ---- 表示用のノード・エッジ ---- */
  const frameNodes = useMemo<FrameNode[]>(
    () =>
      frames.flatMap((f): FrameNode[] => {
        const rect = frameRects.get(f.key)
        if (!rect) return []
        return [
          {
            id: f.key,
            type: "frame",
            position: { x: rect.x, y: rect.y },
            width: rect.width,
            height: rect.height,
            zIndex: 10 - Math.min(f.height, 9), // 外側の枠ほど後ろ
            draggable: false,
            selectable: false,
            focusable: false,
            connectable: false,
            deletable: false,
            data: {
              label: f.label || f.defaultLabel,
              color: f.color ?? autoFrameColor(f.key),
              editable,
              active: editable && activeFrameKey === f.key,
              onActivate: () => setActiveFrameKey(f.key),
              onMoveStart: () => startFrameMove(f.key),
              onMove: moveFrame,
              onMoveEnd: endFrameMove,
              onResizeStart: () => startFrameResize(f.key),
              onResize: resizeFrame,
            },
          },
        ]
      }),
    [frames, frameRects, editable, activeFrameKey, startFrameMove, moveFrame, endFrameMove, startFrameResize, resizeFrame],
  )

  const displayNodes = useMemo<AppNode[]>(() => {
    const characterNodes = nodes.map((n): CharacterNode => {
      const selected = n.id === focusId
      const active = !!focusId && (selected || neighborIds.has(n.id))
      const dim = focusId ? !active : matchIds ? !matchIds.has(n.id) : false
      return {
        ...n,
        hidden: !visibleIds.has(n.id),
        zIndex: CHARACTER_Z,
        data: { ...n.data, selected, active, dim, editable },
      }
    })
    return [...frameNodes, ...characterNodes]
  }, [nodes, frameNodes, visibleIds, focusId, neighborIds, matchIds, editable])

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

  /* ---- 保存・破棄・自動配置（管理者のみ） ---- */
  useEffect(() => {
    if (!editable || changeCount === 0) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [editable, changeCount])

  const save = useCallback(async () => {
    if (changeCount === 0 || saving) return
    setSaving(true)
    setStatus(null)
    const entries = Array.from(dirty)
    const dirtyFrames = frames.filter((f) => frameDirty.has(f.key))
    const deleteIds = Array.from(deletedFrameIds)
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
          frames: {
            upserts: dirtyFrames.map((f) => {
              const text = f.label?.trim() ?? ""
              return {
                ...(f.affiliationId ? {} : { id: f.key.slice("custom:".length) }),
                affiliation_id: f.affiliationId,
                // 所属の枠は「所属名と違うときだけ」上書き。自由枠は必ず名前を持つ
                label: f.affiliationId ? (text && text !== f.defaultLabel ? text : null) : text || f.defaultLabel,
                color: f.color,
                position_x: f.rect ? Math.round(f.rect.x) : null,
                position_y: f.rect ? Math.round(f.rect.y) : null,
                width: f.rect ? Math.round(f.rect.width) : null,
                height: f.rect ? Math.round(f.rect.height) : null,
                is_visible: f.visible,
              }
            }),
            deleteIds,
          },
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

      const savedKeys = new Set(dirtyFrames.map((f) => f.key))
      savedFramesRef.current = frames.map((f) => (savedKeys.has(f.key) ? { ...f, hasRow: true } : f))
      setFrames((fs) => fs.map((f) => (savedKeys.has(f.key) ? { ...f, hasRow: true } : f)))
      setFrameDirty((prev) => {
        const next = new Set(prev)
        savedKeys.forEach((k) => next.delete(k))
        return next
      })
      setDeletedFrameIds(new Set())
      setStatus({ kind: "ok", text: "保存しました" })
    } catch (e) {
      setStatus({ kind: "error", text: e instanceof Error ? e.message : "保存に失敗しました" })
    } finally {
      setSaving(false)
    }
  }, [changeCount, saving, dirty, frames, frameDirty, deletedFrameIds, diagramKey])

  const discard = () => {
    setNodes((ns) => ns.map((n) => ({ ...n, position: savedRef.current.get(n.id) ?? n.position })))
    setDirty(new Map())
    setFrames(savedFramesRef.current)
    setFrameDirty(new Set())
    setDeletedFrameIds(new Set())
    setActiveFrameKey(null)
    setStatus(null)
  }

  const autoLayout = () => {
    if (!window.confirm("全員の位置を自動配置で並べ直します（保存するまで確定しません）。よろしいですか？")) return
    const pos = layoutNodes(
      characters.map((c) => c.id),
      relations.map((r) => ({ source: r.source, target: r.target })),
      new Map(),
      frameLayoutGroups(frames), // 同じ所属は近くに集める
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
          <div className="space-y-3 border-t border-ananta-border/50 pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={save} disabled={changeCount === 0 || saving}>
                {saving ? "保存中…" : "保存"}
              </Button>
              <Button variant="outline" onClick={discard} disabled={changeCount === 0 || saving}>
                変更を破棄
              </Button>
              <Button variant="outline" onClick={autoLayout} disabled={saving}>
                自動配置し直す
              </Button>
              <span aria-live="polite" className="text-sm text-ananta-muted">
                {changeCount > 0 ? `未保存の変更 ${changeCount} 件` : "未保存の変更なし"}
              </span>
              {status && (
                <span className={`text-sm ${status.kind === "ok" ? "text-ananta-accent" : "text-destructive"}`}>
                  {status.text}
                </span>
              )}
            </div>
            <FrameManager
              frames={frames}
              dirtyKeys={frameDirty}
              onChange={updateFrame}
              onResetRect={resetFrameRect}
              onDelete={deleteFrame}
              onAdd={addFrame}
            />
          </div>
        )}
      </CardPanel>

      <p className="text-sm text-ananta-muted" aria-live="polite">
        {visibleIds.size} 人 / {visibleEdgeCount} 件の関係
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* 親に高さが必要。ないと何も表示されない */}
        <div
          ref={wrapRef}
          className="h-[70vh] min-h-[480px] w-full overflow-hidden rounded-lg border border-ananta-border/60 bg-ananta-surface/60"
        >
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange as unknown as OnNodesChange<AppNode>}
            onNodeClick={(_, node) => {
              if (node.type !== "character") {
                setSelectedId(null) // 枠の上のクリックは「選択解除」として扱う
                return
              }
              setSelectedId((cur) => (cur === node.id ? null : node.id))
            }}
            onPaneClick={() => {
              setSelectedId(null)
              setActiveFrameKey(null)
            }}
            onNodeDragStop={
              editable
                ? (_, node) => {
                    if (node.type !== "character") return
                    setDirty((prev) => new Map(prev).set(node.id, { x: node.position.x, y: node.position.y }))
                  }
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
              nodeColor={(n) => (n.type === "frame" ? "rgba(255,255,255,0.06)" : n.id === focusId ? LINE.active : LINE.normal)}
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
        矢印は関係の向き（両端に矢印があるものは双方向）、線の太さは関係の強さを表します。点線の枠は所属（陣営）です。
      </p>
    </div>
  )
}
