"use client"

import Link from "next/link"
import { SiteShell } from "@/components/layout/site-shell"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <SiteShell>
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-3xl font-bold text-ananta-text">問題が発生しました</h1>
        <p className="mt-4 text-ananta-muted">ページの読み込み中にエラーが発生しました。</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded bg-ananta-accent px-4 py-2 text-sm font-medium text-white"
          >
            再試行
          </button>
          <Link href="/" className="rounded border border-ananta-border px-4 py-2 text-sm font-medium text-ananta-text">
            トップへ戻る
          </Link>
        </div>
      </div>
    </SiteShell>
  )
}
