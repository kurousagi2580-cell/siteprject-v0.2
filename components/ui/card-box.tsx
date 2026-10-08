import { cn } from "@/lib/utils/utils";

export function CardBox({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-sm p-3 text-ananta-text space-y-3 bg-ananta-surface/40 backdrop-blur-md border border-ananta-border/30 shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-base font-bold text-ananta-text tracking-wide mb-2">
      <div className="h-3 w-1 bg-ananta-accent rounded-sm" />
      {children}
    </h3>
  )
}

