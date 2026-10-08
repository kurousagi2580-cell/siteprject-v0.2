
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { RelationCard } from "@/components/ui/relation-card"
import type { MergedRelation } from "@/types/relationships"

export function RelationsSection({ relations }: { relations: MergedRelation[] }) {
  return (
    <Section id="relations">
      <GameSectionTitle title="RELATIONSHIPS" subtitle="このキャラクターと関係のあるキャラ一覧" />

      <CardPanel>
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