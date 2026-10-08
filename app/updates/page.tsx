
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"
import { getUpdates } from "@/lib/supabase/get-updates"
import { ExternalLink } from "@/components/external-link"

export default async function UpdatesPage() {
    const updates = await getUpdates()

    return (
        <SiteShell>

            {/* Surface */}
            <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
                アップデート情報一覧
            </Surface>

            <Section id="updates">
                <GameSectionTitle title="UPDATE NOTES" subtitle="更新内容" />

                <CardPanel>
                    {updates.length === 0 ? (
                        <p className="text-sm text-ananta-muted">現在アップデート情報はありません。</p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {updates.map((up) => (
                                <li key={up.id} className="flex gap-4 items-center">
                                    <ExternalLink url="{up.official_url}">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-ananta-text">{up.title}</span>
                                            <span className="text-ananta-muted text-sm">
                                                {up.ver_id}
                                            </span>
                                            <span className="text-xs text-ananta-muted">
                                                {up.release_date}
                                            </span>
                                        </div>
                                    </ExternalLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardPanel>
            </Section>
            {/*
            <Section id="logs">
                <GameSectionTitle title="UPDATE LOG" subtitle="更新履歴" />
                <CardPanel>
                    <ul className="text-sm text-ananta-muted space-y-2">
                        <li>2026/09/30 情報を更新</li>
                    </ul>
                </CardPanel>
            </Section>
            */}
        </SiteShell>

    )
}
