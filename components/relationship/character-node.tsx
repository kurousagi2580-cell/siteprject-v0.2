"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { AppImage } from "@/components/app-image"
import { cn } from "@/lib/utils/utils"
import type { CharacterNode } from "./graph-types"

/** ノード：丸い画像＋名前 */
export function CharacterNodeView({ data }: NodeProps<CharacterNode>) {
  // 線はノードの縁から縁へ引くので、Handle は見えない位置に置くだけ
  const hidden = { top: "50%", left: "50%", opacity: 0 } as const

  return (
    <div
      className={cn(
        "flex w-28 flex-col items-center gap-1.5 rounded-sm border bg-ananta-surface2 px-2 py-3 text-center text-ananta-text transition",
        data.selected
          ? "border-ananta-accent ring-1 ring-ananta-accent"
          : data.active
            ? "border-ananta-accent/60"
            : "border-ananta-border hover:border-ananta-accent/60",
        data.dim && "opacity-25",
        data.editable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
      )}
    >
      <Handle type="target" position={Position.Top} isConnectable={false} style={hidden} />
      <div className="relative size-14 overflow-hidden rounded-full border border-ananta-border bg-ananta-surface">
        <AppImage src={data.image || "/noimage.png"} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <span className="line-clamp-2 break-words text-xs font-medium leading-tight">{data.name}</span>
      <Handle type="source" position={Position.Bottom} isConnectable={false} style={hidden} />
    </div>
  )
}
