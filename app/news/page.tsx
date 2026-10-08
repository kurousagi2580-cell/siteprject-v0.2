
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"

export default function NewsPage() {
  return (
      <SiteShell rightNavMode="none">
        {/* Eyecatch → Surface に統一 */}
        <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
          NEWS
        </Surface>
        {/* 情報本文 */}
      <Section id="info">
        <GameSectionTitle title="INFORMATION" subtitle="最新ニュース" />
        <CardPanel>
          <p className="text-sm text-ananta-text">
            最新情報の本文をここに記載します。
          </p>
        </CardPanel>
      </Section>

      {/* 更新ログ */}
      <Section id="logs">
        <GameSectionTitle title="UPDATE LOG" subtitle="更新履歴" />
        <CardPanel>
          <ul className="text-sm text-ananta-muted space-y-2">
            <li>2026/09/30 最新情報ページを公開</li>
            <li>2026/09/29 情報を追加</li>
          </ul>
        </CardPanel>
      </Section>
      </SiteShell>
  )
}
