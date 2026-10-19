
type GameSectionTitleProps = {
  title: string
  subtitle?: string
  layout?: "vertical" | "horizontal"
}

export function GameSectionTitle({
  title,
  subtitle,
  layout = "vertical",
}: GameSectionTitleProps) {
  if (layout === "horizontal") {
    return (
      <div className="mb-4 flex min-w-0 items-center gap-x-3 gap-y-1 border-b border-ananta-border/50 pb-3">
        <span
          aria-hidden="true"
          className="h-5 w-1 shrink-0 rounded-sm bg-ananta-accent"
        />
        <h2 className="text-base font-bold tracking-[0.12em] text-ananta-text sm:text-lg">
          {title}
        </h2>
        {subtitle && (
          <span className="min-w-0 text-xs text-ananta-muted sm:text-sm">
            {subtitle}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="mb-4 border-b border-ananta-border/50 pb-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-5 w-1 shrink-0 rounded-sm bg-ananta-accent"
        />
        <h2 className="text-base font-bold tracking-[0.12em] text-ananta-text sm:text-lg">
          {title}
        </h2>
      </div>

      {subtitle && (
        <p className="mt-2 pl-4 text-xs leading-relaxed text-ananta-muted sm:text-sm">
          {subtitle}
        </p>
      )}
    </div>
  )
}
