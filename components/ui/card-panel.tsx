
import type { ReactNode } from "react"
import { cn } from "@/lib/utils/utils"

export function CardPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-ananta-border/60 bg-ananta-surface/85 p-4 text-ananta-text shadow-sm shadow-black/10 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}
