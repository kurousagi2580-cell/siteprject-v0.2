import { cn } from "@/lib/utils/utils"

type SurfaceProps = {
  children: React.ReactNode
  className?: string
  variant?: "default" | "raised" | "overlay"
}

export function Surface({
  children,
  className,
  variant = "default",
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-sm border text-ananta-text",
        variant === "default" &&
          "bg-ananta-surface/50 backdrop-blur-lg border-ananta-border/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]",
        variant === "raised" &&
          "bg-ananta-surface/40 backdrop-blur-md border-ananta-border/30 shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]",
        variant === "overlay" &&
          "bg-black/30 backdrop-blur-lg border-ananta-border/40 shadow-[inset_0_0_25px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {children}
    </div>
  )
}
