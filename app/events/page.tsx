
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { Surface } from "@/components/ui/surface"
import { SiteShell } from "@/components/site-shell"
import { getGameEvents } from "@/lib/gameevents"
import { buildEntityUrl } from "@/lib/utils/url-utils"
import Link from "next/link"

export default async function EventsPage() {

    const events = await getGameEvents()

    const now = new Date()

    const activeEvents = events.filter(ev =>
        ev.status === "active" &&
        ev.end_date !== null &&
        new Date(ev.end_date) >= now
    )

    const endedEvents = events.filter(ev =>
        !(ev.status === "active" &&
          ev.end_date !== null &&
          new Date(ev.end_date) >= now)
    )


    return (
        <SiteShell>

            {/* Surface */}
            <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
                イベント一覧
            </Surface>

            <Section id="active-events">
                <GameSectionTitle title="ACTIVE EVENT LIST" subtitle="開催中イベント一覧" />

                <CardPanel>
                    {activeEvents.length === 0 ? (
                        <p className="text-sm text-ananta-muted">現在開催中のイベントはありません。</p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {activeEvents.map((ev) => (
                                <li key={ev.id} className="flex gap-4 items-center">
                                    <Link href={buildEntityUrl("events", ev.articles_slug ?? "")}>

                                        <div className="flex items-center gap-2">
                                            {/* 画像 */}
                                            <img
                                                src={ev.image_url ?? "/noimage.png"}
                                                alt={ev.title}
                                                className="wsize-4 shrink-0 text-ananta-muted object-cover rounded-sm"
                                            />
                                            {/* テキスト */}
                                            <span className="font-bold text-ananta-text">{ev.title}</span>
                                            <span className="text-ananta-muted text-sm">
                                                {ev.start_date} 〜 {ev.end_date}
                                            </span>
                                            <span className="text-xs text-ananta-muted">
                                                {ev.status === "active" ? "開催中" : "終了"}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardPanel>
            </Section>

            <Section id="end-events">
                <GameSectionTitle title="ENDED EVENT LIST" subtitle="終了イベント一覧" />

                <CardPanel>
                    {endedEvents.length === 0 ? (
                        <p className="text-sm text-ananta-muted">終了したイベントはありません。</p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {endedEvents.map((ev) => (
                                <li key={ev.id} className="flex gap-4 items-center">
                                    <Link href={`/pages/${ev.id}`}>

                                        <div className="flex items-center gap-2">
                                            {/* 画像 */}
                                            <img
                                                src={ev.image_url ?? "/noimage.png"}
                                                alt={ev.title}
                                                className="wsize-4 shrink-0 text-ananta-muted object-cover rounded-sm"
                                            />
                                            {/* テキスト */}
                                            <span className="font-bold text-ananta-text">{ev.title}</span>
                                            <span className="text-ananta-muted text-sm">
                                                {ev.start_date} 〜 {ev.end_date}
                                            </span>
                                            <span className="text-xs text-ananta-muted">
                                                {ev.status === "active" ? "開催中" : "終了"}
                                            </span>
                                        </div>
                                    </Link>
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
                        <li>2026/09/30 イベント情報を更新</li>
                    </ul>
                </CardPanel>
            </Section>
            */}
        </SiteShell>

    )
}
