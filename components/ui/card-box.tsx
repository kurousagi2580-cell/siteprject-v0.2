
import type { ReactNode } from "react"
import { cn } from "@/lib/utils/utils"

export function CardBox({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-ananta-border/70 bg-ananta-surface2/85 p-4 text-ananta-text shadow-sm shadow-black/10",
        className,
      )}
    >
      {children}
    </div>
  )
}


