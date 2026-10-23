
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { RelationCard } from "@/components/ui/relation-card"
import type { MergedRelation } from "@/types/relationships"
import { relationshipGraphHref } from "@/lib/grah/graph-link"
import Link from "next/link"

export function RelationsSection({ relations, slug }: { relations: MergedRelation[], slug: string }) {
  return (
    <Section id="relations">
      <GameSectionTitle title="RELATIONSHIPS" subtitle="このキャラクターと関係のあるキャラ一覧" />

      <CardPanel>
        <div className="sm:float-right sm:mr-4 sm:relative sm:w-[70px] sm:h-[50px] 
                        flex justify-end mb-2">
          <Link href={relationshipGraphHref(slug)} className="text-ananta-muted no-underline hover:text-ananta-text">相関図へ</Link>
        </div>
        {relations.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relations.map((r) => (
              <RelationCard key={r.id} relation={r} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ananta-muted">関係データなし</p>
        )}

      </CardPanel>

    </Section>
  )
}