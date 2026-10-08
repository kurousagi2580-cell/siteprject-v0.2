import Link from "next/link"
import { cn } from "@/lib/utils/utils"

export function LinkCardBox({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block bg-ananta-surface2 border border-ananta-border rounded-sm p-3 text-ananta-text space-y-3 transition-all hover:shadow-lg hover:scale-[1.02]",
        className
      )}
    >
      {children}
    </Link>
  )
}
