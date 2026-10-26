"use client"

import type { PointerEvent as ReactPointerEvent } from "react"
import { useStore, type NodeProps } from "@xyflow/react"
import { cn } from "@/lib/utils/utils"
import { frameTextColor } from "@/lib/grah/frame-style"
import type { FrameNode, ResizeDir } from "./graph-types"

const HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: "nw", className: "-left-1.5 -top-1.5 cursor-nwse-resize" },
  { dir: "n", className: "left-1/2 -top-1.5 -translate-x-1/2 cursor-ns-resize" },
  { dir: "ne", className: "-right-1.5 -top-1.5 cursor-nesw-resize" },
  { dir: "e", className: "-right-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize" },
  { dir: "se", className: "-bottom-1.5 -right-1.5 cursor-nwse-resize" },
  { dir: "s", className: "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize" },
  { dir: "sw", className: "-bottom-1.5 -left-1.5 cursor-nesw-resize" },
  { dir: "w", className: "-left-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize" },
]

/**
 * 陣営の枠。ノード自体は動かさず（= 枠の中をドラッグして画面を動かせる）、
 * 編集モードのときだけ、ラベル（移動）と四辺・四隅のハンドル（大きさ変更）を操作できる。
 */
export function FrameNodeView({ data }: NodeProps<FrameNode>) {
  const zoom = useStore((s) => s.transform[2])

  // ポインターを掴んで動かす。移動量は画面のズームで割って、グラフ上の距離にする
  const bindDrag = (
    e: ReactPointerEvent<HTMLElement>,
    onStart: () => void,
    onDelta: (dx: number, dy: number) => void,
    onEnd?: () => void,
  ) => {
    e.stopPropagation()
    e.preventDefault()
    const el = e.currentTarget
    el.setPointerCapture(e.pointerId)
    const sx = e.clientX
    const sy = e.clientY
    data.onActivate()
    onStart()
    const move = (ev: PointerEvent) => onDelta((ev.clientX - sx) / zoom, (ev.clientY - sy) / zoom)
    const up = () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointercancel", up)
      onEnd?.()
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointercancel", up)
  }

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 rounded-lg border-2 border-dotted"
        style={{ borderColor: data.color, backgroundColor: `${data.color}12` }}
      />
      <div
        className={cn(
          "nodrag nopan absolute left-1/2 top-0 max-w-[90%] -translate-x-1/2 -translate-y-1/2 truncate whitespace-nowrap rounded-sm px-3 py-1 text-xs font-bold",
          data.editable && "cursor-grab touch-none active:cursor-grabbing",
        )}
        style={{ backgroundColor: data.color, color: frameTextColor(data.color) }}
        title={data.editable ? "ドラッグで枠ごと移動（中のキャラも一緒に動きます）" : undefined}
        onPointerDown={data.editable ? (e) => bindDrag(e, data.onMoveStart, data.onMove, data.onMoveEnd) : undefined}
      >
        {data.label}
      </div>

      {data.editable &&
        data.active &&
        HANDLES.map((h) => (
          <div
            key={h.dir}
            className={cn("nodrag nopan absolute size-3 touch-none rounded-sm border border-black/40", h.className)}
            style={{ backgroundColor: data.color }}
            onPointerDown={(e) => bindDrag(e, data.onResizeStart, (dx, dy) => data.onResize(h.dir, dx, dy))}
          />
        ))}
    </div>
  )
}
