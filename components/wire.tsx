import { cn } from "@/lib/utils/utils"
import type { ReactNode } from "react"

// Grey placeholder box used across the wireframe.
export function WireBox({
  label,
  className,
  children,
}: {
  label?: string
  className?: string
  children?: ReactNode
}) {
  {/* ワイヤー時の値："flex items-start justify-start border border-neutral-300 bg-neutral-100 p-3 text-xs text-neutral-500" */}
  return (
    
    <div
      className={cn(
        "flex items-start justify-start border border-neutral-300 bg-neutral-100 p-3 text-xs text-neutral-500",
        className,
      )}
    >
      {children ?? label}
    </div>
  )
}

// Section heading with the wireframe underline style.
export function SectionHeading({
  children,
  note,
}: {
  children: ReactNode
  note?: string
}) {
  return (
    <div className="mt-8 mb-3 flex items-baseline gap-2">
      <h2 className="text-base font-bold text-neutral-800">{children}</h2>
      {note ? <span className="text-[10px] text-red-500">*{note}</span> : null}
    </div>
  )
}

// Bordered content panel (the outlined blocks in the wireframe).
export function WirePanel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("border border-neutral-300 bg-white p-4", className)}>
      {children}
    </div>
  )
}