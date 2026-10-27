import { SiteShell } from "@/components/layout/site-shell"

export default function Loading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="inline-flex h-10 w-10 animate-spin rounded-full border-2 border-ananta-border border-t-ananta-accent" />
        <p className="mt-4 text-sm text-ananta-muted">読み込み中...</p>
      </div>
    </SiteShell>
  )
}
