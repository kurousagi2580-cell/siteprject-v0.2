export function GameSectionTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex gap-3">

      {/* 縦バー：高さ固定 */}
      <div className="w-1 bg-ananta-accent rounded-sm h-full min-h-[20px]" />

      <div className="flex flex-col">
        <h2 className="text-lg font-bold leading-none">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-ananta-muted leading-tight mt-1">
            {subtitle}
          </p>
        )}
      </div>

    </div>
  )
}
