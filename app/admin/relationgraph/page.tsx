import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { requireAdminPage } from "@/lib/auth/require-admin"
import { SiteShell } from "@/components/layout/site-shell"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { RelationshipGraph } from "@/components/relationship/relationship-graph"
import { getRelationshipGraphData } from "@/lib/supabase/queries/relationship-graph"

export const metadata: Metadata = {
  title: "相関図の配置を編集",
  robots: { index: false },
}

// 管理者ごとに結果が変わるのでキャッシュしない
export const dynamic = "force-dynamic"

export default async function AdminRelationGraphPage() {
  await requireAdminPage("/admin/relationgraph")
  const data = await getRelationshipGraphData()

  return (
    <SiteShell showFooterAd={false}>
      <Section>
        <GameSectionTitle
          title="RELATIONSHIP MAP EDITOR"
          subtitle="ドラッグでキャラクターの位置を調整し、「保存」で公開ページに反映します。"
        />
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/admin" className="no-underline hover:underline">← 管理者ページへ</Link>
          <Link href="/relationgraph" className="no-underline hover:underline">公開ページを見る</Link>
        </div>
        <Suspense fallback={null}>
          <RelationshipGraph {...data} editable />
        </Suspense>
      </Section>
    </SiteShell>
  )
}
