
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"

export default function NoticesPage() {
  return (
    <SiteShell>
        {/* Eyecatch → Surface に統一 */}
        <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
            INFORMATION
        </Surface>

        <Section id="info">
            <GameSectionTitle title="INFORMATION" subtitle="お知らせ内容" />
            <CardPanel>
            <p className="text-sm text-ananta-text">
                お知らせの本文をここに記載します。
            </p>
            </CardPanel>
        </Section>

        <Section id="logs">
            <GameSectionTitle title="UPDATE LOG" subtitle="更新履歴" />
            <CardPanel>
            <ul className="text-sm text-ananta-muted space-y-2">
                <li>2026/09/30 お知らせページを公開</li>
            </ul>
            </CardPanel>
        </Section>
        

    </SiteShell>
    
  )
}
