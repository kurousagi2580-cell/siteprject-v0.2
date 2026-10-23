import { Suspense } from "react"
import type { Metadata } from "next"
import { SiteShell } from "@/components/layout/site-shell"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { RelationshipGraph } from "@/components/relationship/relationship-graph"
import { getRelationshipGraphData } from "@/lib/supabase/queries/relationship-graph"

export const metadata: Metadata = {
  title: "キャラクター相関図",
  description: "キャラクター同士の関係を図で確認できます。",
}

export default async function RelationGraphPage() {
  const data = await getRelationshipGraphData()

  return (
    <SiteShell>
      <Section>
        <GameSectionTitle
          title="RELATIONSHIP MAP"
          subtitle="キャラクター同士の関係図です。キャラクターを選ぶと、関係のある相手が強調表示されます。"
        />
        {/* useSearchParams を使うので Suspense が必要（ページ自体は静的のまま） */}
        <Suspense fallback={null}>
          <RelationshipGraph {...data} />
        </Suspense>
      </Section>
    </SiteShell>
  )
}
