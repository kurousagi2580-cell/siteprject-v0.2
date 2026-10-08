"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { CardPanel } from "@/components/ui/card-panel"

export function Toc({ items }: { items: string[] }) {
  const [open, setOpen] = useState(true)

  return (
    <CardPanel className="p-0">
      {/* ▼▼▼ 折りたたみボタン ▼▼▼ */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          flex w-full items-center justify-between
          px-4 py-2
          text-sm font-bold
          text-ananta-text
          hover:bg-ananta-surface
        "
      >
        <span>目次（折りたたみ）</span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform text-ananta-muted",
            open ? "" : "-rotate-90"
          )}
        />
      </button>

      {/* ▼▼▼ 目次リスト ▼▼▼ */}
      {open && (
        <ol className="flex flex-col gap-y-1 px-4 pb-3 text-xs text-ananta-muted">
          {items.map((item, i) => (
            <li key={item}>
              {i + 1}. {item}
              {i < items.length - 1 ? " /" : ""}
            </li>
          ))}
        </ol>
      )}
    </CardPanel>
  )
}
