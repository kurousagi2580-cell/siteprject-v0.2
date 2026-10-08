import { cn } from "@/lib/utils/utils"
import type { ReactNode } from "react"

export function Section({
  id,
  children,
  className,
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("mt-6 mb-4", className)}>
      {/* アンカー専用の位置調整用ダミー要素 */}
      {id && <div id={id} className="scroll-mt-32"></div>}

      {/* 子要素の間に余白を付ける */}
      <div className="space-y-4">
        {children}
      </div>
    </section>
  )
}
