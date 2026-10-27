import Link from "next/link"
import { SiteShell } from "@/components/layout/site-shell"

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-ananta-muted">404</p>
        <h1 className="mt-3 text-3xl font-bold text-ananta-text">ページが見つかりません</h1>
        <p className="mt-4 text-ananta-muted">お探しのページは移動または削除された可能性があります。</p>
        <div className="mt-6">
          <Link href="/" className="rounded bg-ananta-accent px-4 py-2 text-sm font-medium text-white">
            トップへ戻る
          </Link>
        </div>
      </div>
    </SiteShell>
  )
}
